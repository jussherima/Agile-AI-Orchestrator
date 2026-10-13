export type TicketType = 'bug' | 'feature' | 'technical' | 'docs';
export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';
export type TicketStatus = 'backlog' | 'ready' | 'in-progress' | 'review' | 'qa' | 'done' | 'blocked';
export type TicketSeverity = 'blocker' | 'critical' | 'high' | 'normal' | 'low';

export interface Ticket {
  id: string;
  title: string;
  type: TicketType;
  priority: TicketPriority;
  severity?: TicketSeverity;
  status: TicketStatus;
  storyPoints?: 1 | 2 | 3 | 5 | 8 | 13;
  assignee?: string;
  labels: string[];
  
  description: string;
  acceptanceCriteria: AcceptanceCriterion[];
  context?: string;
  
  scopeIncluded: string[];
  scopeExcluded: string[];
  
  dependsOn: string[];
  blocks: string[];
  
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  
  branch?: string;
  commitSha?: string;
  prUrl?: string;
  
  reviewIteration: number;
  maxReviewIterations: number;
  reviewStatus?: 'pending' | 'approved' | 'changes-requested' | 'rejected';
  reviewNotes?: string;
  
  wave?: number;
  parallelGroup?: string;
}

export interface AcceptanceCriterion {
  id: string;
  given: string;
  when: string;
  then: string;
  testRef?: string;
  verified: boolean;
  verifiedAt?: string;
}

export interface Project {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  tickets: Ticket[];
  
  kanban: KanbanConfig;
  
  waves?: Wave[];
  
  metrics: ProjectMetrics;
}

export interface KanbanConfig {
  columns: KanbanColumn[];
  wipLimits: Record<string, number>;
}

export interface KanbanColumn {
  id: TicketStatus;
  title: string;
  order: number;
  wipLimit?: number;
}

export interface Wave {
  id: number;
  name: string;
  ticketIds: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  parallel: boolean;
  maxParallel: number;
}

export interface ProjectMetrics {
  totalTickets: number;
  ticketsByStatus: Record<TicketStatus, number>;
  ticketsByType: Record<TicketType, number>;
  ticketsByPriority: Record<TicketPriority, number>;
  totalStoryPoints: number;
  completedStoryPoints: number;
  velocity: number;
  leadTime: number;
  cycleTime: number;
  throughput: number;
  blockersCount: number;
}

export interface TUIState {
  currentView: ViewType;
  project: Project | null;
  selectedTicketId: string | null;
  selectedColumn: TicketStatus | null;
  filters: TicketFilters;
  sort: TicketSort;
  searchQuery: string;
  commandPaletteOpen: boolean;
  helpOpen: boolean;
}

export type ViewType = 'dashboard' | 'kanban' | 'list' | 'ticket-detail' | 'waves' | 'metrics' | 'settings';

export interface TicketFilters {
  status?: TicketStatus[];
  type?: TicketType[];
  priority?: TicketPriority[];
  assignee?: string[];
  wave?: number[];
}

export interface TicketSort {
  field: 'priority' | 'status' | 'createdAt' | 'updatedAt' | 'title' | 'storyPoints';
  direction: 'asc' | 'desc';
}

export interface KeyBinding {
  key: string;
  action: string;
  description: string;
  global?: boolean;
  view?: ViewType;
}