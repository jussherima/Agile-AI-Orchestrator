import { program } from 'commander';
import { findBacklogFiles, parseBacklogMarkdown, listSavedProjects, loadProject, saveProject, createProjectFromSpec } from './utils/project.js';
import { store } from './store.js';
import { TUI } from './tui.js';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const PROJECT_ROOT = join(__dirname, '..', '..', '..');

program
  .name('orcl-tui')
  .description('ORCL TUI — Terminal UI for ticket management and project state')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize TUI state from backlog')
  .argument('[backlog]', 'Backlog file name (without -backlog.md)')
  .action(async (backlog) => {
    const backlogs = findBacklogFiles();
    
    if (backlogs.length === 0) {
      console.error('No backlog files found in _orcl/output/backlogs/');
      process.exit(1);
    }
    
    let selectedPath: string;
    
    if (backlog) {
      selectedPath = backlogs.find(p => p.includes(backlog)) || backlogs[0];
    } else {
      selectedPath = backlogs[0];
      console.log(`Using backlog: ${selectedPath}`);
    }
    
    const project = parseBacklogMarkdown(selectedPath);
    store.setProject(project);
    
    console.log(`Loaded project: ${project.name}`);
    console.log(`Tickets: ${project.tickets.length}`);
    console.log('Starting TUI...');
    
    const tui = new TUI();
    tui.run();
  });

program
  .command('open')
  .description('Open saved project state')
  .argument('<name>', 'Project name')
  .action((name) => {
    const project = loadProject(name);
    if (!project) {
      console.error(`Project "${name}" not found`);
      process.exit(1);
    }
    
    store.setProject(project);
    console.log(`Loaded project: ${project.name}`);
    
    const tui = new TUI();
    tui.run();
  });

program
  .command('list')
  .description('List available backlogs and saved projects')
  .action(() => {
    const backlogs = findBacklogFiles();
    const saved = listSavedProjects();
    
    console.log('\n📋 Available Backlogs:');
    if (backlogs.length === 0) {
      console.log('  (none)');
    } else {
      backlogs.forEach(b => console.log(`  - ${b.split('/').pop()?.replace('-backlog.md', '')}`));
    }
    
    console.log('\n💾 Saved Projects:');
    if (saved.length === 0) {
      console.log('  (none)');
    } else {
      saved.forEach(s => console.log(`  - ${s}`));
    }
  });

program
  .command('view')
  .description('View backlog as static board (no TUI)')
  .argument('[backlog]', 'Backlog file name (without -backlog.md)')
  .option('-f, --format <type>', 'Output format: table|kanban|json', 'table')
  .action((backlog, options) => {
    const backlogs = findBacklogFiles();
    
    if (backlogs.length === 0) {
      console.error('No backlog files found');
      process.exit(1);
    }
    
    let selectedPath: string;
    if (backlog) {
      selectedPath = backlogs.find(p => p.includes(backlog)) || backlogs[0];
    } else {
      selectedPath = backlogs[0];
    }
    
    const project = parseBacklogMarkdown(selectedPath);
    
    if (options.format === 'json') {
      console.log(JSON.stringify(project, null, 2));
      return;
    }
    
    if (options.format === 'kanban') {
      printKanbanView(project);
    } else {
      printTableView(project);
    }
  });

program
  .command('import')
  .description('Import project from existing spec or backlog')
  .argument('<source>', 'Path to spec file, backlog, or project directory')
  .option('-n, --name <name>', 'Project name (defaults to source name)')
  .option('-t, --type <type>', 'Source type: spec|backlog|auto', 'auto')
  .action((source, options) => {
    // Resolve source path: absolute -> cwd -> project root backlogs (verified) -> parent project backlogs
    let resolvedSource: string;
    if (source.startsWith('/')) {
      resolvedSource = source;
    } else if (existsSync(resolve(process.cwd(), source))) {
      resolvedSource = resolve(process.cwd(), source);
    } else {
      const backlogs = findBacklogFiles();
      // Find a backlog that actually exists
      resolvedSource = backlogs.find(p => p.includes(source) && existsSync(p)) || '';
      
      // Also check parent directory for _orcl
      if (!resolvedSource) {
        const parentOrcl = resolve(process.cwd(), '..', '_orcl', 'output', 'backlogs', source);
        if (existsSync(parentOrcl)) {
          resolvedSource = parentOrcl;
        }
      }
      
      if (!resolvedSource) {
        resolvedSource = resolve(process.cwd(), source);
      }
    }
    
    const project = createProjectFromSpec(resolvedSource, options.name, options.type);
    if (!project) {
      console.error('Failed to import project');
      process.exit(1);
    }
    
    saveProject(project);
    console.log(`✓ Imported project: ${project.name}`);
    console.log(`  Tickets: ${project.tickets.length}`);
    console.log(`  Saved to: _orcl/tui-state/${project.name}.json`);
    console.log('\nRun: orcl-tui open ' + project.name);
  });

program
  .command('create')
  .description('Create new backlog from template')
  .argument('<name>', 'Project name')
  .option('-t, --template <type>', 'Template: feature|bugfix|tech|full', 'full')
  .action((name, options) => {
    const backlogDir = join(PROJECT_ROOT, '_orcl', 'output', 'backlogs');
    if (!existsSync(backlogDir)) {
      mkdirSync(backlogDir, { recursive: true });
    }
    
    const filePath = join(backlogDir, `${name}-backlog.md`);
    
    if (existsSync(filePath)) {
      console.error(`Backlog already exists: ${filePath}`);
      process.exit(1);
    }
    
    const template = getBacklogTemplate(name, options.template);
    writeFileSync(filePath, template);
    
    console.log(`✓ Created backlog: ${filePath}`);
    console.log('\nEdit the file to add your tickets, then run:');
    console.log(`  orcl-tui init ${name}`);
  });

program
  .command('sync')
  .description('Sync with external systems (GitHub Projects, etc.)')
  .argument('<direction>', 'push|pull')
  .option('-p, --provider <name>', 'Provider: github|gitlab|linear')
  .option('-r, --repo <name>', 'Repository (owner/repo)')
  .action((direction, options) => {
    console.log(`Sync ${direction} with ${options.provider || 'github'}...`);
    console.log('Not yet implemented — use GitHub Projects CLI or web UI for now');
  });

function printTableView(project: any) {
  console.log(`\n📋 ${project.name} — ${project.tickets.length} tickets\n`);
  console.log('ID              Title                              Type        Pri    Status        SP  Assignee');
  console.log('────────────────────────────────────────────────────────────────────────────────────');
  
  project.tickets.forEach((t: any) => {
    const id = t.id.padEnd(14);
    const title = t.title.substring(0, 32).padEnd(34);
    const type = t.type.padEnd(10);
    const pri = t.priority.substring(0, 4).toUpperCase().padEnd(6);
    const status = t.status.padEnd(12);
    const sp = (t.storyPoints || '-').toString().padEnd(3);
    const assignee = (t.assignee || '-').substring(0, 10);
    console.log(`${id} ${title} ${type} ${pri} ${status} ${sp} ${assignee}`);
  });
}

function printKanbanView(project: any) {
  const columns = [
    { key: 'backlog', label: 'BACKLOG', color: '\x1b[90m' },
    { key: 'ready', label: 'READY', color: '\x1b[34m' },
    { key: 'in-progress', label: 'IN PROGRESS', color: '\x1b[33m' },
    { key: 'review', label: 'REVIEW', color: '\x1b[35m' },
    { key: 'qa', label: 'QA', color: '\x1b[36m' },
    { key: 'done', label: 'DONE', color: '\x1b[32m' },
    { key: 'blocked', label: 'BLOCKED', color: '\x1b[31m' },
  ];
  
  console.log(`\n📋 ${project.name} — Kanban Board\n`);
  
  columns.forEach(col => {
    const tickets = project.tickets.filter((t: any) => t.status === col.key);
    console.log(`${col.color}${col.label.padEnd(14)}\x1b[0m ${tickets.length} tickets`);
    tickets.forEach((t: any) => {
      console.log(`  ${t.id}  ${t.title.substring(0, 50)}`);
    });
    console.log('');
  });
}

function getBacklogTemplate(name: string, type: string): string {
  const today = new Date().toISOString().split('T')[0];
  
  if (type === 'feature') {
    return `# ${name} Backlog

## Feature: [Titre]

**Type** : Feature
**Priorité** : medium
**Story Points** : 3

### Description
En tant que [rôle], je veux [action], afin de [bénéfice].

### Critères d'acceptation
- Étant donné [contexte], Quand [action], Alors [résultat attendu]

### Inclus
- [Ce qui fait partie du ticket]

### Exclu
- [Ce qui n'en fait PAS partie]

### Dépendances
- [Dépendance 1]

---
`;
  }
  
  return `# ${name} Backlog

## [Verbe] + [Description]

**Type** : Feature
**Priorité** : medium
**Story Points** : 3

### Description
[Contexte et description]

### Critères d'acceptation
- [ ] [Critère vérifiable 1]
- [ ] [Critère vérifiable 2]

### Inclus
- [Ce qui fait partie du ticket]

### Exclu
- [Ce qui n'en fait PAS partie]

### Dépendances
- [Dépendance 1]

---
`;
}

program.parse();