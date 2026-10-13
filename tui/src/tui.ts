import blessed, { Widgets } from 'blessed';
import { store } from './store.js';
import { format } from 'date-fns';
import { DashboardView } from './views/dashboard.js';
import { KanbanView } from './views/kanban.js';
import { ListView } from './views/list.js';
import { TicketDetailView } from './views/ticket-detail.js';
import { WavesView } from './views/waves.js';
import { MetricsView } from './views/metrics.js';
import { SettingsView } from './views/settings.js';

export class TUI {
  private screen: Widgets.Screen;
  private currentView: 'dashboard' | 'kanban' | 'list' | 'ticket-detail' | 'waves' | 'metrics' | 'settings' = 'dashboard';
  private views: Map<string, any> = new Map();
  private helpOverlay: Widgets.BoxElement | null = null;
  private commandPalette: Widgets.BoxElement | null = null;
  private unsubscribe: (() => void) | null = null;

  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'ORCL TUI',
      fullUnicode: true,
      dockBorders: true,
      autoPadding: true,
    });

    this.setupViews();
    this.setupKeyBindings();
    this.setupStoreSubscription();
    this.render();
  }

  private setupViews(): void {
    this.views.set('dashboard', new DashboardView(this.screen));
    this.views.set('kanban', new KanbanView(this.screen));
    this.views.set('list', new ListView(this.screen));
    this.views.set('ticket-detail', new TicketDetailView(this.screen));
    this.views.set('waves', new WavesView(this.screen));
    this.views.set('metrics', new MetricsView(this.screen));
    this.views.set('settings', new SettingsView(this.screen));
  }

  private setupStoreSubscription(): void {
    this.unsubscribe = store.subscribe(() => {
      this.render();
    });
  }

  private setupKeyBindings(): void {
    this.screen.key(['C-c'], () => {
      this.destroy();
      process.exit(0);
    });

    this.screen.key(['F1', 'C-h'], () => {
      this.toggleHelp();
    });

    this.screen.key(['escape'], () => {
      if (this.commandPalette) {
        this.closeCommandPalette();
      } else if (this.helpOverlay) {
        this.toggleHelp();
      } else if (this.currentView === 'ticket-detail') {
        this.switchView('list');
      } else {
        this.switchView('dashboard');
      }
    });

    this.screen.key(['tab'], () => {
      this.cycleView(1);
    });

    this.screen.key(['S-tab'], () => {
      this.cycleView(-1);
    });

    this.screen.key(['C-k'], () => {
      this.openCommandPalette();
    });

    // View shortcuts
    this.screen.key(['1'], () => this.switchView('dashboard'));
    this.screen.key(['2'], () => this.switchView('kanban'));
    this.screen.key(['3'], () => this.switchView('list'));
    this.screen.key(['4'], () => this.switchView('waves'));
    this.screen.key(['5'], () => this.switchView('metrics'));
    this.screen.key(['6'], () => this.switchView('settings'));
  }

  private cycleView(direction: number): void {
    const views: Array<'dashboard' | 'kanban' | 'list' | 'ticket-detail' | 'waves' | 'metrics' | 'settings'> = ['dashboard', 'kanban', 'list', 'ticket-detail', 'waves', 'metrics', 'settings'];
    const currentIndex = views.indexOf(this.currentView);
    const nextIndex = (currentIndex + direction + views.length) % views.length;
    this.switchView(views[nextIndex]);
  }

  private switchView(view: typeof this.currentView): void {
    this.currentView = view;
    store.setView(view);
    this.render();
  }

  private openCommandPalette(): void {
    if (this.commandPalette) return;
    
    let commandPaletteSelectedIndex = 0;
    
    this.commandPalette = blessed.box({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: '60%',
      height: '50%',
      border: 'line',
      style: { border: { fg: 'cyan' } },
      label: ' Command Palette ',
      tags: true,
      keys: true,
      vi: true,
    });

    const commands = [
      { name: 'New Ticket', desc: 'Create a new ticket', keys: 'n' },
      { name: 'Edit Ticket', desc: 'Edit selected ticket', keys: 'e' },
      { name: 'Delete Ticket', desc: 'Delete selected ticket', keys: 'd' },
      { name: 'Move to Ready', desc: 'Move selected to Ready', keys: 'r' },
      { name: 'Move to In Progress', desc: 'Move selected to In Progress', keys: 'i' },
      { name: 'Move to Review', desc: 'Move selected to Review', keys: 'v' },
      { name: 'Move to Done', desc: 'Move selected to Done', keys: 'o' },
      { name: 'Toggle Blocked', desc: 'Toggle blocked status', keys: 'b' },
      { name: 'Assign Ticket', desc: 'Assign ticket to user', keys: 'a' },
      { name: 'Add Label', desc: 'Add label to ticket', keys: 'l' },
      { name: 'Clear Filters', desc: 'Clear all filters', keys: 'f c' },
      { name: 'View Dashboard', desc: 'Switch to dashboard', keys: '1' },
      { name: 'View Kanban', desc: 'Switch to kanban', keys: '2' },
      { name: 'View List', desc: 'Switch to list', keys: '3' },
      { name: 'View Waves', desc: 'Switch to waves', keys: '4' },
      { name: 'View Metrics', desc: 'Switch to metrics', keys: '5' },
      { name: 'View Settings', desc: 'Switch to settings', keys: '6' },
      { name: 'Save Project', desc: 'Save current project state', keys: 'Ctrl+s' },
      { name: 'Refresh', desc: 'Reload from backlog', keys: 'F5' },
    ];

    const list = blessed.list({
      parent: this.commandPalette,
      top: 1,
      left: 1,
      right: 1,
      bottom: 1,
      items: commands.map(c => `${c.name} — ${c.desc} {gray-fg}(${c.keys}){/}`),
      style: {
        selected: { bg: 'cyan', fg: 'black' },
        item: { fg: 'white' },
      },
      keys: true,
      vi: true,
      mouse: true,
    });

    list.focus();

    list.key(['escape'], () => this.closeCommandPalette());
    list.key(['up'], () => {
      commandPaletteSelectedIndex = Math.max(0, commandPaletteSelectedIndex - 1);
      list.select(commandPaletteSelectedIndex);
      this.screen.render();
    });
    list.key(['down'], () => {
      commandPaletteSelectedIndex = Math.min(commands.length - 1, commandPaletteSelectedIndex + 1);
      list.select(commandPaletteSelectedIndex);
      this.screen.render();
    });
    list.key(['enter'], () => {
      const selected = commands[commandPaletteSelectedIndex];
      if (selected) {
        this.handleCommand(selected.name);
      }
      this.closeCommandPalette();
    });

    this.screen.render();
  }

  private closeCommandPalette(): void {
    if (this.commandPalette) {
      this.commandPalette.destroy();
      this.commandPalette = null;
      this.screen.render();
    }
  }

  private handleCommand(name: string): void {
    const state = store.getState();
    const ticket = store.getSelectedTicket();
    
    switch (name) {
      case 'Clear Filters':
        store.clearFilters();
        break;
      case 'Move to Ready':
        if (ticket) store.moveTicket(ticket.id, 'ready');
        break;
      case 'Move to In Progress':
        if (ticket) store.moveTicket(ticket.id, 'in-progress');
        break;
      case 'Move to Review':
        if (ticket) store.moveTicket(ticket.id, 'review');
        break;
      case 'Move to Done':
        if (ticket) store.moveTicket(ticket.id, 'done');
        break;
      case 'Toggle Blocked':
        if (ticket) store.moveTicket(ticket.id, ticket.status === 'blocked' ? 'backlog' : 'blocked');
        break;
      case 'View Dashboard':
        this.switchView('dashboard');
        break;
      case 'View Kanban':
        this.switchView('kanban');
        break;
      case 'View List':
        this.switchView('list');
        break;
      case 'View Waves':
        this.switchView('waves');
        break;
      case 'View Metrics':
        this.switchView('metrics');
        break;
      case 'View Settings':
        this.switchView('settings');
        break;
      case 'Save Project':
        // Would save project
        break;
      case 'Refresh':
        // Would refresh from backlog
        break;
    }
  }

  private toggleHelp(): void {
    if (this.helpOverlay) {
      this.helpOverlay.destroy();
      this.helpOverlay = null;
      this.screen.render();
      return;
    }

    this.helpOverlay = blessed.box({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: '80%',
      height: '70%',
      border: 'line',
      style: { border: { fg: 'yellow' }, bg: 'black' },
      label: ' Keyboard Shortcuts ',
      tags: true,
    });

    const globalKeys = [
      'Tab / Shift+Tab  → Cycle views',
      '1-6              → Jump to view',
      'Ctrl+K           → Command palette',
      'F1 / Ctrl+H      → Toggle help',
      'Esc              → Close dialog / Back',
      'Ctrl+C           → Quit',
    ];

    const viewKeys: Record<string, string[]> = {
      dashboard: ['Enter → Open selected', 'j/k → Navigate', 'r → Refresh'],
      kanban: ['←/→ → Column', '↑/↓ → Ticket', 'Enter → Detail', 'Space → Drag', 'r/i/v/q/o/b → Quick move'],
      list: ['↑/↓ → Navigate', 'Enter → Detail', '/ → Search', 'f → Filters', '1-7 → Move status'],
      'ticket-detail': ['↑/↓ → Scroll', 'e → Edit', 'b/Esc → Back', 'r/i/v/q/o/b → Move'],
      waves: ['↑/↓ → Navigate', 'Enter → Toggle detail', 'Space → Start/stop'],
      metrics: ['j/k → Scroll', 'r → Refresh'],
      settings: ['↑/↓ → Navigate', 'Enter → Select'],
    };

    const content = [
      '{bold}{yellow-fg}Global{/}{/}',
      ...globalKeys.map(k => `  ${k}`),
      '',
      `{bold}{yellow-fg}${this.currentView.charAt(0).toUpperCase() + this.currentView.slice(1)} View{/}{/}`,
      ...(viewKeys[this.currentView] || ['No specific shortcuts']).map(k => `  ${k}`),
      '',
      '{gray-fg}Press F1 or Esc to close{/}',
    ].join('\n');

    blessed.text({
      parent: this.helpOverlay,
      top: 1,
      left: 1,
      right: 1,
      bottom: 1,
      content,
      style: { fg: 'white' },
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
      mouse: true,
    }).focus();

    this.helpOverlay.key(['escape', 'F1'], () => this.toggleHelp());
    this.screen.render();
  }

  private render(): void {
    const state = store.getState();
    const project = state.project;

    if (!project) {
      this.screen.clearRegion(0, 0, this.screen.width as number, this.screen.height as number);
      this.screen.render();
      return;
    }

    // Clear previous view
    this.screen.children.forEach(child => {
      if (child !== this.helpOverlay && child !== this.commandPalette) {
        child.destroy();
      }
    });

    // Header
    const header = blessed.box({
      parent: this.screen,
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      border: 'line',
      style: { border: { fg: 'blue' } },
      tags: true,
    });

    const views = [
      { id: 'dashboard', label: 'Dashboard', key: '1' },
      { id: 'kanban', label: 'Kanban', key: '2' },
      { id: 'list', label: 'List', key: '3' },
      { id: 'waves', label: 'Waves', key: '4' },
      { id: 'metrics', label: 'Metrics', key: '5' },
      { id: 'settings', label: 'Settings', key: '6' },
    ];

    let headerContent = '{bold}{cyan-fg}ORCL TUI{/} {gray-fg}v1.0.0{/}  ';
    headerContent += views.map(v => 
      this.currentView === v.id 
        ? `{bold}{black-fg}{cyan-bg} ${v.key}: ${v.label} {/}` 
        : `{white-fg} ${v.key}: ${v.label} {/}`
    ).join(' ');
    headerContent += `  {right}{gray-fg}${project.name} | ${project.tickets.length} tickets | Updated: ${format(new Date(project.updatedAt), 'HH:mm:ss')}{/}`;
    
    header.setContent(headerContent);

    // View content area
    const viewBox = blessed.box({
      parent: this.screen,
      top: 3,
      left: 0,
      right: 0,
      bottom: 3,
      style: { bg: 'default' },
    });

    // Render current view
    const viewInstance = this.views.get(this.currentView);
    if (viewInstance) {
      viewInstance.render(viewBox);
    }

    // Footer
    const footer = blessed.box({
      parent: this.screen,
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      border: 'line',
      style: { border: { fg: 'gray' } },
      tags: true,
    });

    const metrics = project.metrics;
    let footerContent = '';
    
    // Status counts
    Object.entries(metrics.ticketsByStatus).forEach(([status, count]) => {
      if (count > 0) {
        const colors: Record<string, string> = {
          backlog: 'gray', ready: 'blue', 'in-progress': 'yellow',
          review: 'magenta', qa: 'cyan', done: 'green', blocked: 'red',
        };
        footerContent += `{${colors[status]}-fg}${status}: ${count}{/}  `;
      }
    });
    
    footerContent += `| SP: {yellow-fg}${metrics.completedStoryPoints}/{/}{white-fg}${metrics.totalStoryPoints}{/}  `;
    footerContent += `| Blockers: {red-fg}${metrics.blockersCount}{/}  `;
    footerContent += `{right}{gray-fg}Tab: Next view | 1-6: Jump | Ctrl+K: Commands | F1: Help | Esc: Back | Ctrl+C: Quit{/}`;

    footer.setContent(footerContent);

    this.screen.render();
  }

  run(): void {
    // Start the main loop
    this.screen.render();
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.screen.destroy();
  }
}