import { Project, Ticket, TicketStatus, TicketType, TicketPriority, Wave, ViewType, TicketFilters, TicketSort, TUIState } from './types.js';

const PRIORITY_ORDER: Record<TicketPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const DEFAULT_KANBAN_COLUMNS: { id: TicketStatus; title: string; order: number; wipLimit?: number }[] = [
  { id: 'backlog', title: 'Backlog', order: 0 },
  { id: 'ready', title: 'Ready', order: 1, wipLimit: 10 },
  { id: 'in-progress', title: 'In Progress', order: 2, wipLimit: 5 },
  { id: 'review', title: 'Review', order: 3, wipLimit: 3 },
  { id: 'qa', title: 'QA', order: 4, wipLimit: 3 },
  { id: 'done', title: 'Done', order: 5 },
  { id: 'blocked', title: 'Blocked', order: 6 },
];

const DEFAULT_SORT: TicketSort = { field: 'priority', direction: 'desc' };
const DEFAULT_FILTERS: TicketFilters = {};

export class Store {
  private state: TUIState = {
    currentView: 'dashboard',
    project: null,
    selectedTicketId: null,
    selectedColumn: null,
    filters: DEFAULT_FILTERS,
    sort: DEFAULT_SORT,
    searchQuery: '',
    commandPaletteOpen: false,
    helpOpen: false,
  };

  private listeners: Set<() => void> = new Set();

  getState(): TUIState {
    return this.state;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  setProject(project: Project): void {
    this.state = { ...this.state, project };
    this.notify();
  }

  getProject(): Project | null {
    return this.state.project;
  }

  setView(view: ViewType): void {
    this.state = { ...this.state, currentView: view };
    this.notify();
  }

  getView(): ViewType {
    return this.state.currentView;
  }

  selectTicket(id: string | null): void {
    this.state = { ...this.state, selectedTicketId: id };
    this.notify();
  }

  getSelectedTicket(): Ticket | null {
    if (!this.state.project || !this.state.selectedTicketId) return null;
    return this.state.project.tickets.find(t => t.id === this.state.selectedTicketId) || null;
  }

  selectColumn(column: TicketStatus | null): void {
    this.state = { ...this.state, selectedColumn: column };
    this.notify();
  }

  setFilters(filters: Partial<TicketFilters>): void {
    this.state = { ...this.state, filters: { ...this.state.filters, ...filters } };
    this.notify();
  }

  clearFilters(): void {
    this.state = { ...this.state, filters: DEFAULT_FILTERS };
    this.notify();
  }

  setSort(sort: TicketSort): void {
    this.state = { ...this.state, sort };
    this.notify();
  }

  toggleSortDirection(): void {
    this.state = {
      ...this.state,
      sort: { ...this.state.sort, direction: this.state.sort.direction === 'asc' ? 'desc' : 'asc' }
    };
    this.notify();
  }

  setSearchQuery(query: string): void {
    this.state = { ...this.state, searchQuery: query };
    this.notify();
  }

  setCommandPaletteOpen(open: boolean): void {
    this.state = { ...this.state, commandPaletteOpen: open };
    this.notify();
  }

  setHelpOpen(open: boolean): void {
    this.state = { ...this.state, helpOpen: open };
    this.notify();
  }

  addTicket(ticket: Ticket): void {
    if (!this.state.project) return;
    this.state = {
      ...this.state,
      project: { ...this.state.project, tickets: [...this.state.project.tickets, ticket] }
    };
    this.notify();
  }

  updateTicket(id: string, updates: Partial<Ticket>): void {
    if (!this.state.project) return;
    this.state = {
      ...this.state,
      project: {
        ...this.state.project,
        tickets: this.state.project.tickets.map(t =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        )
      }
    };
    this.notify();
  }

  deleteTicket(id: string): void {
    if (!this.state.project) return;
    this.state = {
      ...this.state,
      project: {
        ...this.state.project,
        tickets: this.state.project.tickets.filter(t => t.id !== id)
      }
    };
    if (this.state.selectedTicketId === id) {
      this.state.selectedTicketId = null;
    }
    this.notify();
  }

  moveTicket(ticketId: string, newStatus: TicketStatus): void {
    this.updateTicket(ticketId, { status: newStatus });
  }

  getFilteredTickets(): Ticket[] {
    if (!this.state.project) return [];
    
    let tickets = this.state.project.tickets;

    if (this.state.searchQuery) {
      const q = this.state.searchQuery.toLowerCase();
      tickets = tickets.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.labels.some(l => l.toLowerCase().includes(q))
      );
    }

    if (this.state.filters.status?.length) {
      tickets = tickets.filter(t => this.state.filters.status!.includes(t.status));
    }
    if (this.state.filters.type?.length) {
      tickets = tickets.filter(t => this.state.filters.type!.includes(t.type));
    }
    if (this.state.filters.priority?.length) {
      tickets = tickets.filter(t => this.state.filters.priority!.includes(t.priority));
    }
    if (this.state.filters.assignee?.length) {
      tickets = tickets.filter(t => t.assignee && this.state.filters.assignee!.includes(t.assignee));
    }
    if (this.state.filters.wave?.length) {
      tickets = tickets.filter(t => t.wave && this.state.filters.wave!.includes(t.wave));
    }

    tickets = [...tickets].sort((a, b) => {
      const dir = this.state.sort.direction === 'asc' ? 1 : -1;
      switch (this.state.sort.field) {
        case 'priority':
          return dir * (PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
        case 'status':
          return dir * (DEFAULT_KANBAN_COLUMNS.find(c => c.id === a.status)!.order -
            DEFAULT_KANBAN_COLUMNS.find(c => c.id === b.status)!.order);
        case 'createdAt':
          return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case 'updatedAt':
          return dir * (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        case 'title':
          return dir * a.title.localeCompare(b.title);
        case 'storyPoints':
          return dir * ((b.storyPoints || 0) - (a.storyPoints || 0));
        default:
          return 0;
      }
    });

    return tickets;
  }

  getTicketsByStatus(status: TicketStatus): Ticket[] {
    return this.getFilteredTickets().filter(t => t.status === status);
  }

  getKanbanColumns() {
    return DEFAULT_KANBAN_COLUMNS;
  }

  getWipLimit(status: TicketStatus): number | undefined {
    return DEFAULT_KANBAN_COLUMNS.find(c => c.id === status)?.wipLimit;
  }

  getWipCount(status: TicketStatus): number {
    return this.getTicketsByStatus(status).length;
  }

  isWipExceeded(status: TicketStatus): boolean {
    const limit = this.getWipLimit(status);
    if (!limit) return false;
    return this.getWipCount(status) >= limit;
  }
}

export const store = new Store();