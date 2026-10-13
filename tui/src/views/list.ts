import blessed, { Widgets } from 'blessed';
import { store } from '../store.js';
import { format } from 'date-fns';

export class ListView {
  private screen: Widgets.Screen;
  private selectedIndex = 0;
  private showFilters = false;
  private searchMode = false;
  private searchQuery = '';
  private listBox: Widgets.ListElement | null = null;

  constructor(screen: Widgets.Screen) {
    this.screen = screen;
  }

  render(parent: Widgets.BoxElement): void {
    const state = store.getState();
    const tickets = store.getFilteredTickets();
    const filteredTickets = this.searchQuery
      ? tickets.filter(t => 
          t.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      : tickets;

    // Header
    blessed.text({
      parent,
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      content: `{bold}Tickets (${filteredTickets.length}/${tickets.length}){/}  {right}{gray-fg}Sort: ${state.sort.field} (${state.sort.direction}){/}`,
      tags: true,
      style: { bg: 'blue', fg: 'white' },
    });

    // Table header
    const headerBox = blessed.box({
      parent,
      top: 1,
      left: 0,
      right: 0,
      height: 1,
      style: { bg: 'blue', fg: 'white' },
    });

    const headers = [
      { key: 'id', label: 'ID', width: 14 },
      { key: 'title', label: 'Title', width: 45 },
      { key: 'type', label: 'Type', width: 12 },
      { key: 'pri', label: 'Pri', width: 6 },
      { key: 'status', label: 'Status', width: 14 },
      { key: 'sp', label: 'SP', width: 4 },
      { key: 'assignee', label: 'Assignee', width: 12 },
      { key: 'updated', label: 'Updated', width: 16 },
    ];

    let headerContent = '';
    headers.forEach(h => {
      headerContent += `{bold}${h.label.padEnd(h.width)}{/}`;
    });
    headerBox.setContent(headerContent);

    // List
    this.listBox = blessed.list({
      parent,
      top: 2,
      left: 0,
      right: 0,
      bottom: this.showFilters ? 15 : 2,
      style: {
        selected: { bg: 'blue', fg: 'white' },
        item: { fg: 'white' },
      },
      keys: true,
      vi: true,
      mouse: true,
      items: filteredTickets.map(t => this.formatRow(t, headers)),
    });

    this.listBox.select(this.selectedIndex);

    // Help
    blessed.text({
      parent,
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      content: this.searchMode
        ? '{cyan-fg}/{/}{gray-fg} Search: ' + this.searchQuery + '{/}'
        : '{gray-fg}↑/↓: Navigate | Enter: Detail | /: Search | f: Filters | 1-7: Move status | Esc: Back{/}',
      tags: true,
      style: { bg: 'blue' },
    });

    if (this.showFilters) {
      this.renderFilterPanel(parent);
    }
  }

  private formatRow(ticket: any, headers: any[]): string {
    const statusColors: Record<string, string> = {
      backlog: 'gray', ready: 'blue', 'in-progress': 'yellow',
      review: 'magenta', qa: 'cyan', done: 'green', blocked: 'red',
    };
    const priorityColors: Record<string, string> = {
      critical: 'red', high: 'magenta', medium: 'yellow', low: 'green',
    };
    const typeColors: Record<string, string> = {
      bug: 'red', feature: 'green', technical: 'blue', docs: 'gray',
    };

    return (
      `{gray-fg}${ticket.id.padEnd(14)}{/}` +
      `{white-fg}${ticket.title.substring(0, 43).padEnd(45)}{/}` +
      `{${typeColors[ticket.type] || 'white'}-fg}${ticket.type.padEnd(12)}{/}` +
      `{${priorityColors[ticket.priority] || 'white'}-fg}${ticket.priority.substring(0, 3).toUpperCase().padEnd(6)}{/}` +
      `{${statusColors[ticket.status] || 'white'}-fg}${ticket.status.padEnd(14)}{/}` +
      `{gray-fg}${(ticket.storyPoints || '-').toString().padEnd(4)}{/}` +
      `{cyan-fg}${(ticket.assignee || '-').substring(0, 10).padEnd(12)}{/}` +
      `{gray-fg}${format(new Date(ticket.updatedAt), 'MM/dd HH:mm').padEnd(16)}{/}`
    );
  }

  private renderFilterPanel(parent: Widgets.BoxElement): void {
    const panel = blessed.box({
      parent,
      bottom: 1,
      left: 0,
      right: 0,
      height: 14,
      border: 'line',
      style: { border: { fg: 'yellow' }, bg: 'black' },
      label: ' Filters ',
      tags: true,
    });

    const state = store.getState();

    // Status filter
    blessed.text({
      parent: panel,
      top: 0,
      left: 1,
      content: '{bold}Status:{/}',
      tags: true,
    });

    const statusOptions: Array<'backlog' | 'ready' | 'in-progress' | 'review' | 'qa' | 'done' | 'blocked'> = ['backlog', 'ready', 'in-progress', 'review', 'qa', 'done', 'blocked'];
    const statusList = blessed.list({
      parent: panel,
      top: 1,
      left: 1,
      width: 20,
      height: 7,
      items: statusOptions.map(s => {
        const selected = state.filters.status?.includes(s);
        return `{${selected ? 'green' : 'white'}-fg}${selected ? '✓ ' : '  '}${s}{/}`;
      }),
      style: { selected: { bg: 'blue', fg: 'white' }, item: { fg: 'white' } },
      keys: true,
      vi: true,
    });

    // Type filter
    blessed.text({
      parent: panel,
      top: 0,
      left: 22,
      content: '{bold}Type:{/}',
      tags: true,
    });

    const typeOptions: Array<'bug' | 'feature' | 'technical' | 'docs'> = ['bug', 'feature', 'technical', 'docs'];
    const typeList = blessed.list({
      parent: panel,
      top: 1,
      left: 22,
      width: 15,
      height: 7,
      items: typeOptions.map(s => {
        const selected = state.filters.type?.includes(s);
        return `{${selected ? 'green' : 'white'}-fg}${selected ? '✓ ' : '  '}${s}{/}`;
      }),
      style: { selected: { bg: 'blue', fg: 'white' }, item: { fg: 'white' } },
      keys: true,
      vi: true,
    });

    // Priority filter
    blessed.text({
      parent: panel,
      top: 0,
      left: 38,
      content: '{bold}Priority:{/}',
      tags: true,
    });

    const priorityOptions: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
    const priorityList = blessed.list({
      parent: panel,
      top: 1,
      left: 38,
      width: 12,
      height: 7,
      items: priorityOptions.map(s => {
        const selected = state.filters.priority?.includes(s);
        return `{${selected ? 'green' : 'white'}-fg}${selected ? '✓ ' : '  '}${s}{/}`;
      }),
      style: { selected: { bg: 'blue', fg: 'white' }, item: { fg: 'white' } },
      keys: true,
      vi: true,
    });

    // Buttons
    const clearBtn = blessed.button({
      parent: panel,
      bottom: 1,
      left: 2,
      content: ' Clear All ',
      style: { bg: 'red', fg: 'white', focus: { bg: 'red', fg: 'white' } },
      shrink: true,
      padding: { left: 1, right: 1 },
    });

    clearBtn.on('press', () => {
      store.clearFilters();
      this.showFilters = false;
      this.screen.render();
    });

    const closeBtn = blessed.button({
      parent: panel,
      bottom: 1,
      right: 2,
      content: ' Close ',
      style: { bg: 'blue', fg: 'white', focus: { bg: 'blue', fg: 'white' } },
      shrink: true,
      padding: { left: 1, right: 1 },
    });

    closeBtn.on('press', () => {
      this.showFilters = false;
      this.screen.render();
    });

    // Focus handling
    const focusables = [statusList, typeList, priorityList, clearBtn, closeBtn];
    let focusIndex = 0;
    focusables[focusIndex].focus();

    const handleTab = () => {
      focusIndex = (focusIndex + 1) % focusables.length;
      focusables[focusIndex].focus();
      this.screen.render();
    };

    const handleShiftTab = () => {
      focusIndex = (focusIndex - 1 + focusables.length) % focusables.length;
      focusables[focusIndex].focus();
      this.screen.render();
    };

    this.screen.key(['tab'], handleTab);
    this.screen.key(['S-tab'], handleShiftTab);
  }

  handleKey(key: string): boolean {
    const state = store.getState();
    const tickets = store.getFilteredTickets();
    const filteredTickets = this.searchQuery
      ? tickets.filter(t => 
          t.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      : tickets;

    if (this.searchMode) {
      if (key === 'escape') {
        this.searchMode = false;
        this.searchQuery = '';
        store.setSearchQuery('');
        return true;
      }
      return false; // Let text input handle it
    }

    if (this.showFilters) {
      if (key === 'escape' || key === 'f') {
        this.showFilters = false;
        return true;
      }
      return false; // Let filter panel handle it
    }

    switch (key) {
      case 'up':
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        this.listBox?.select(this.selectedIndex);
        return true;
      case 'down':
        this.selectedIndex = Math.min(Math.max(0, filteredTickets.length - 1), this.selectedIndex + 1);
        this.listBox?.select(this.selectedIndex);
        return true;
      case 'pageup':
        this.selectedIndex = Math.max(0, this.selectedIndex - 10);
        this.listBox?.select(this.selectedIndex);
        return true;
      case 'pagedown':
        this.selectedIndex = Math.min(Math.max(0, filteredTickets.length - 1), this.selectedIndex + 10);
        this.listBox?.select(this.selectedIndex);
        return true;
      case 'enter':
        if (filteredTickets[this.selectedIndex]) {
          store.selectTicket(filteredTickets[this.selectedIndex].id);
          store.setView('ticket-detail');
        }
        return true;
      case 'f':
        this.showFilters = true;
        return true;
      case 's':
        // Open command palette for sort
        return false;
      case '/':
        this.searchMode = true;
        return true;
      case 'escape':
        return true; // Handled by main
      case '1': case '2': case '3': case '4': case '5': case '6': case '7':
        if (filteredTickets[this.selectedIndex]) {
          const statuses: Record<string, 'backlog' | 'ready' | 'in-progress' | 'review' | 'qa' | 'done' | 'blocked'> = {
            '1': 'backlog', '2': 'ready', '3': 'in-progress',
            '4': 'review', '5': 'qa', '6': 'done', '7': 'blocked'
          };
          store.moveTicket(filteredTickets[this.selectedIndex].id, statuses[key]);
        }
        return true;
    }
    return false;
  }

  handleInput(ch: string): void {
    if (this.searchMode) {
      if (ch === '\u0008' || ch === '\u007f') { // backspace
        this.searchQuery = this.searchQuery.slice(0, -1);
      } else if (ch >= ' ' && ch <= '~') {
        this.searchQuery += ch;
      }
      store.setSearchQuery(this.searchQuery);
      this.selectedIndex = 0;
      this.screen.render();
    }
  }
}