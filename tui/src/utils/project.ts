import { Project, Ticket, TicketStatus, TicketType, TicketPriority, Wave } from '../types.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yaml';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find project root by looking for _orcl directory with workflows, starting from cwd first
function findProjectRoot(startDir: string): string {
  // First check cwd and parents for _orcl with workflows
  let dir = process.cwd();
  while (dir !== '/') {
    if (existsSync(join(dir, '_orcl', 'workflows'))) return dir;
    dir = dirname(dir);
  }
  // Then check from __dirname
  dir = startDir;
  while (dir !== '/') {
    if (existsSync(join(dir, '_orcl', 'workflows'))) return dir;
    dir = dirname(dir);
  }
  // Fallback: any _orcl
  dir = process.cwd();
  while (dir !== '/') {
    if (existsSync(join(dir, '_orcl'))) return dir;
    dir = dirname(dir);
  }
  return process.cwd();
}

const PROJECT_ROOT = findProjectRoot(__dirname);
const ORCL_DIR = join(PROJECT_ROOT, '_orcl');
const BACKLOGS_DIR = join(ORCL_DIR, 'output', 'backlogs');
const PARALLEL_DIR = join(ORCL_DIR, 'output', 'parallel-execution');

export function findBacklogFiles(): string[] {
  const results: string[] = [];
  
  // Check primary BACKLOGS_DIR
  if (existsSync(BACKLOGS_DIR)) {
    results.push(...glob.sync('**/*-backlog.md', { cwd: BACKLOGS_DIR, absolute: true }));
  }
  
  // Also check parent directory for _orcl/output/backlogs
  const parentBacklogsDir = join(PROJECT_ROOT, '..', '_orcl', 'output', 'backlogs');
  if (existsSync(parentBacklogsDir)) {
    const parentResults = glob.sync('**/*-backlog.md', { cwd: parentBacklogsDir, absolute: true });
    // Avoid duplicates
    for (const r of parentResults) {
      if (!results.includes(r)) results.push(r);
    }
  }
  
  return results;
}

export function parseBacklogMarkdown(filePath: string): Project {
  const content = readFileSync(filePath, 'utf-8');
  const name = filePath.split('/').pop()?.replace('-backlog.md', '') || 'Unknown';
  
  const tickets: Ticket[] = [];
  const lines = content.split('\n');
  
  let currentTicket: Partial<Ticket> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    const ticketMatch = line.match(/^##\s+(.+)$/);
    if (ticketMatch) {
      if (currentTicket) {
        tickets.push(finalizeTicket(currentTicket));
      }
      
      const title = ticketMatch[1].trim();
      currentTicket = {
        id: generateId(title),
        title,
        type: 'feature',
        priority: 'medium',
        status: 'backlog',
        description: '',
        acceptanceCriteria: [],
        scopeIncluded: [],
        scopeExcluded: [],
        dependsOn: [],
        blocks: [],
        labels: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviewIteration: 0,
        maxReviewIterations: 3,
      };
      continue;
    }
    
    if (!currentTicket) continue;
    
    const typeMatch = line.match(/^\*\*Type\*\s*:\s*(.+)$/);
    if (typeMatch) {
      const type = typeMatch[1].trim().toLowerCase();
      currentTicket.type = (['bug', 'feature', 'technical', 'docs'].includes(type) ? type : 'feature') as TicketType;
      continue;
    }
    
    const priorityMatch = line.match(/^\*\*Priorit[eé]\*\s*:\s*(.+)$/);
    if (priorityMatch) {
      const priority = priorityMatch[1].trim().toLowerCase();
      currentTicket.priority = (['critical', 'high', 'medium', 'low'].includes(priority) ? priority : 'medium') as TicketPriority;
      continue;
    }
    
    const spMatch = line.match(/^\*\*Story Points\*\s*:\s*(.+)$/);
    if (spMatch) {
      const sp = parseInt(spMatch[1].trim());
      currentTicket.storyPoints = [1, 2, 3, 5, 8, 13].includes(sp) ? sp as Ticket['storyPoints'] : undefined;
      continue;
    }
    
    if (line.startsWith('### Crit') || line.startsWith('### Acceptance')) {
      continue;
    }
    
    if (line.trim().startsWith('- [ ]')) {
      const criterionText = line.replace('- [ ]', '').trim();
      const givenMatch = criterionText.match(/^Given\s+(.+),\s*When\s+(.+),\s*Then\s+(.+)$/i);
      if (givenMatch) {
        currentTicket.acceptanceCriteria!.push({
          id: `ac-${currentTicket.acceptanceCriteria!.length + 1}`,
          given: givenMatch[1].trim(),
          when: givenMatch[2].trim(),
          then: givenMatch[3].trim(),
          verified: false,
        });
      } else {
        currentTicket.acceptanceCriteria!.push({
          id: `ac-${currentTicket.acceptanceCriteria!.length + 1}`,
          given: '',
          when: '',
          then: criterionText,
          verified: false,
        });
      }
      continue;
    }
    
    if (line.startsWith('**Inclus') || line.startsWith('**Included')) {
      const items = line.split(':')[1]?.split(',').map(s => s.trim()) || [];
      currentTicket.scopeIncluded = items;
      continue;
    }
    if (line.startsWith('**Exclu') || line.startsWith('**Excluded')) {
      const items = line.split(':')[1]?.split(',').map(s => s.trim()) || [];
      currentTicket.scopeExcluded = items;
      continue;
    }
    
    if (line.startsWith('**Dépendances') || line.startsWith('**Dependencies')) {
      const deps = line.split(':')[1]?.split(',').map(s => s.trim()) || [];
      currentTicket.dependsOn = deps;
      continue;
    }
    
    if (line && !line.startsWith('#') && !line.startsWith('**') && currentTicket.description === '') {
      currentTicket.description = line.trim();
    } else if (line && currentTicket.description && !line.startsWith('#') && !line.startsWith('**')) {
      currentTicket.description += '\n' + line.trim();
    }
  }
  
  if (currentTicket) {
    tickets.push(finalizeTicket(currentTicket));
  }
  
  const waves = loadWaves();
  
  const project: Project = {
    name,
    description: `Project loaded from ${filePath}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tickets,
    kanban: {
      columns: [
        { id: 'backlog', title: 'Backlog', order: 0 },
        { id: 'ready', title: 'Ready', order: 1, wipLimit: 10 },
        { id: 'in-progress', title: 'In Progress', order: 2, wipLimit: 5 },
        { id: 'review', title: 'Review', order: 3, wipLimit: 3 },
        { id: 'qa', title: 'QA', order: 4, wipLimit: 3 },
        { id: 'done', title: 'Done', order: 5 },
        { id: 'blocked', title: 'Blocked', order: 6 },
      ],
      wipLimits: { 'ready': 10, 'in-progress': 5, 'review': 3, 'qa': 3 },
    },
    waves,
    metrics: calculateMetrics(tickets),
  };
  
  return project;
}

function finalizeTicket(t: Partial<Ticket>): Ticket {
  return {
    id: t.id || 'unknown',
    title: t.title || 'Untitled',
    type: t.type || 'feature',
    priority: t.priority || 'medium',
    status: t.status || 'backlog',
    storyPoints: t.storyPoints,
    assignee: t.assignee,
    labels: t.labels || [],
    description: t.description || '',
    acceptanceCriteria: t.acceptanceCriteria || [],
    context: t.context,
    scopeIncluded: t.scopeIncluded || [],
    scopeExcluded: t.scopeExcluded || [],
    dependsOn: t.dependsOn || [],
    blocks: t.blocks || [],
    createdAt: t.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startedAt: t.startedAt,
    completedAt: t.completedAt,
    branch: t.branch,
    commitSha: t.commitSha,
    prUrl: t.prUrl,
    reviewIteration: t.reviewIteration || 0,
    maxReviewIterations: t.maxReviewIterations || 3,
    reviewStatus: t.reviewStatus,
    reviewNotes: t.reviewNotes,
    wave: t.wave,
    parallelGroup: t.parallelGroup,
  };
}

function generateId(title: string): string {
  const prefix = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 20);
  const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${num}`;
}

function loadWaves(): Wave[] | undefined {
  const planPath = join(PARALLEL_DIR, 'plan.json');
  if (!existsSync(planPath)) return undefined;
  
  try {
    const content = readFileSync(planPath, 'utf-8');
    const plan = JSON.parse(content);
    return plan.waves?.map((w: any) => ({
      id: w.id,
      name: w.description || `Wave ${w.id}`,
      ticketIds: w.tickets,
      status: 'pending',
      parallel: w.parallel,
      maxParallel: w.max_parallel || 3,
    })) || [];
  } catch {
    return undefined;
  }
}

function calculateMetrics(tickets: Ticket[]): Project['metrics'] {
  const byStatus: Record<TicketStatus, number> = {
    backlog: 0, ready: 0, 'in-progress': 0, review: 0, qa: 0, done: 0, blocked: 0,
  };
  const byType: Record<TicketType, number> = { bug: 0, feature: 0, technical: 0, docs: 0 };
  const byPriority: Record<TicketPriority, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  
  let totalPoints = 0;
  let completedPoints = 0;
  let completedTickets = 0;
  let totalCycleTime = 0;
  let totalLeadTime = 0;
  
  for (const t of tickets) {
    byStatus[t.status]++;
    byType[t.type]++;
    byPriority[t.priority]++;
    
    if (t.storyPoints) {
      totalPoints += t.storyPoints;
      if (t.status === 'done') completedPoints += t.storyPoints;
    }
    
    if (t.status === 'done') completedTickets++;
    
    if (t.startedAt && t.completedAt) {
      const cycle = (new Date(t.completedAt).getTime() - new Date(t.startedAt).getTime()) / (1000 * 60 * 60 * 24);
      totalCycleTime += cycle;
    }
    if (t.createdAt && t.completedAt) {
      const lead = (new Date(t.completedAt).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      totalLeadTime += lead;
    }
  }
  
  const blockers = tickets.filter(t => t.status === 'blocked').length;
  
  return {
    totalTickets: tickets.length,
    ticketsByStatus: byStatus,
    ticketsByType: byType,
    ticketsByPriority: byPriority,
    totalStoryPoints: totalPoints,
    completedStoryPoints: completedPoints,
    velocity: 0,
    leadTime: completedTickets > 0 ? totalLeadTime / completedTickets : 0,
    cycleTime: completedTickets > 0 ? totalCycleTime / completedTickets : 0,
    throughput: 0,
    blockersCount: blockers,
  };
}

export function saveProject(project: Project): void {
  const outputDir = join(ORCL_DIR, 'tui-state');
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
  
  const filePath = join(outputDir, `${project.name.toLowerCase().replace(/\s+/g, '-')}.json`);
  writeFileSync(filePath, JSON.stringify(project, null, 2));
}

export function loadProject(name: string): Project | null {
  const filePath = join(ORCL_DIR, 'tui-state', `${name.toLowerCase().replace(/\s+/g, '-')}.json`);
  if (!existsSync(filePath)) return null;
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export function listSavedProjects(): string[] {
  const outputDir = join(ORCL_DIR, 'tui-state');
  if (!existsSync(outputDir)) return [];
  
  return glob.sync('*.json', { cwd: outputDir }).map(f => f.replace('.json', ''));
}

export function createProjectFromSpec(source: string, name?: string, type: 'spec' | 'backlog' | 'auto' = 'auto'): Project | null {
  // source should already be resolved to absolute path by caller
  const resolvedSource = source.startsWith('/') ? source : join(PROJECT_ROOT, source);
  
  if (!existsSync(resolvedSource)) {
    console.error(`Source not found: ${resolvedSource}`);
    return null;
  }
  
  const stat = readFileSync(resolvedSource, 'utf-8');
  let tickets: Ticket[] = [];
  let projectName = name || resolvedSource.split('/').pop()?.replace(/\.(md|json)$/, '') || 'Imported Project';
  
  if (type === 'backlog' || (type === 'auto' && resolvedSource.endsWith('-backlog.md'))) {
    return parseBacklogMarkdown(resolvedSource);
  }
  
  if (type === 'spec' || (type === 'auto' && (resolvedSource.endsWith('.md') || resolvedSource.endsWith('.yaml') || resolvedSource.endsWith('.yml')))) {
    tickets = parseSpecToTickets(stat);
  } else if (resolvedSource.endsWith('.json')) {
    try {
      const data = JSON.parse(stat);
      if (data.tickets) {
        projectName = data.name || projectName;
        tickets = data.tickets;
      }
    } catch {
      console.error('Invalid JSON format');
      return null;
    }
  }
  
  if (tickets.length === 0) {
    console.warn('No tickets found in source');
    return null;
  }
  
  const waves = loadWaves();
  
  return {
    name: projectName,
    description: `Project imported from ${source}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tickets,
    kanban: {
      columns: [
        { id: 'backlog', title: 'Backlog', order: 0 },
        { id: 'ready', title: 'Ready', order: 1, wipLimit: 10 },
        { id: 'in-progress', title: 'In Progress', order: 2, wipLimit: 5 },
        { id: 'review', title: 'Review', order: 3, wipLimit: 3 },
        { id: 'qa', title: 'QA', order: 4, wipLimit: 3 },
        { id: 'done', title: 'Done', order: 5 },
        { id: 'blocked', title: 'Blocked', order: 6 },
      ],
      wipLimits: { 'ready': 10, 'in-progress': 5, 'review': 3, 'qa': 3 },
    },
    waves,
    metrics: calculateMetrics(tickets),
  };
}

function parseSpecToTickets(content: string): Ticket[] {
  const tickets: Ticket[] = [];
  const lines = content.split('\n');
  let currentTicket: Partial<Ticket> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    const ticketMatch = line.match(/^##\s+(.+)$/);
    if (ticketMatch) {
      if (currentTicket) {
        tickets.push(finalizeTicket(currentTicket));
      }
      
      const title = ticketMatch[1].trim();
      currentTicket = {
        id: generateId(title),
        title,
        type: 'feature',
        priority: 'medium',
        status: 'backlog',
        description: '',
        acceptanceCriteria: [],
        scopeIncluded: [],
        scopeExcluded: [],
        dependsOn: [],
        blocks: [],
        labels: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviewIteration: 0,
        maxReviewIterations: 3,
      };
      continue;
    }
    
    if (!currentTicket) continue;
    
    const typeMatch = line.match(/^\*\*Type\*\s*:\s*(.+)$/);
    if (typeMatch) {
      const type = typeMatch[1].trim().toLowerCase();
      currentTicket.type = (['bug', 'feature', 'technical', 'docs'].includes(type) ? type : 'feature') as TicketType;
      continue;
    }
    
    const priorityMatch = line.match(/^\*\*Priorit[eé]\*\s*:\s*(.+)$/);
    if (priorityMatch) {
      const priority = priorityMatch[1].trim().toLowerCase();
      currentTicket.priority = (['critical', 'high', 'medium', 'low'].includes(priority) ? priority : 'medium') as TicketPriority;
      continue;
    }
    
    const spMatch = line.match(/^\*\*Story Points\*\s*:\s*(.+)$/);
    if (spMatch) {
      const sp = parseInt(spMatch[1].trim());
      currentTicket.storyPoints = [1, 2, 3, 5, 8, 13].includes(sp) ? sp as Ticket['storyPoints'] : undefined;
      continue;
    }
    
    if (line.startsWith('### Crit') || line.startsWith('### Acceptance')) {
      continue;
    }
    
    if (line.trim().startsWith('- [ ]')) {
      const criterionText = line.replace('- [ ]', '').trim();
      const givenMatch = criterionText.match(/^Given\s+(.+),\s*When\s+(.+),\s*Then\s+(.+)$/i);
      if (givenMatch) {
        currentTicket.acceptanceCriteria!.push({
          id: `ac-${currentTicket.acceptanceCriteria!.length + 1}`,
          given: givenMatch[1].trim(),
          when: givenMatch[2].trim(),
          then: givenMatch[3].trim(),
          verified: false,
        });
      } else {
        currentTicket.acceptanceCriteria!.push({
          id: `ac-${currentTicket.acceptanceCriteria!.length + 1}`,
          given: '',
          when: '',
          then: criterionText,
          verified: false,
        });
      }
      continue;
    }
    
    if (line.startsWith('**Inclus') || line.startsWith('**Included')) {
      const items = line.split(':')[1]?.split(',').map(s => s.trim()) || [];
      currentTicket.scopeIncluded = items;
      continue;
    }
    if (line.startsWith('**Exclu') || line.startsWith('**Excluded')) {
      const items = line.split(':')[1]?.split(',').map(s => s.trim()) || [];
      currentTicket.scopeExcluded = items;
      continue;
    }
    
    if (line.startsWith('**Dépendances') || line.startsWith('**Dependencies')) {
      const deps = line.split(':')[1]?.split(',').map(s => s.trim()) || [];
      currentTicket.dependsOn = deps;
      continue;
    }
    
    if (line && !line.startsWith('#') && !line.startsWith('**') && currentTicket.description === '') {
      currentTicket.description = line.trim();
    } else if (line && currentTicket.description && !line.startsWith('#') && !line.startsWith('**')) {
      currentTicket.description += '\n' + line.trim();
    }
  }
  
  if (currentTicket) {
    tickets.push(finalizeTicket(currentTicket));
  }
  
  return tickets;
}