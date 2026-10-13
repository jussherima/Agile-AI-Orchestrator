import blessed, { Widgets } from 'blessed';
import { store } from '../store.js';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'gray' },
  { id: 'ready', title: 'Ready', color: 'blue' },
  { id: 'in-progress', title: 'In Progress', color: 'yellow' },
  { id: 'review', title: 'Review', color: 'magenta' },
  { id: 'qa', title: 'QA', color: 'cyan' },
  { id: 'done', title: 'Done', color: 'green' },
  { id: 'blocked', title: 'Blocked', color: 'red' },
] as const;

type ColumnId = typeof COLUMNS[number]['id'];

export class KanbanView {
  private screen: Widgets.Screen;
  private selectedColumnIndex = 0;
  private selectedTicketIndex = 0;
  private dragMode = false;
  private draggedTicketId: string | null = null;
  private columnBoxes: Map<ColumnId, Widgets.BoxElement> = new Map();
  private ticketBoxes: Map<string, Widgets.BoxElement> = new Map();

  constructor(screen: Widgets.Screen) {
    this.screen = screen;
  }

  render(parent: Widgets.BoxElement): void {
    const state = store.getState();
    this.columnBoxes.clear();
    this.ticketBoxes.clear();

    // Render columns
    COLUMNS.forEach((col, colIndex) => {
      const tickets = store.getTicketsByStatus(col.id);
      const wipLimit = store.getWipLimit(col.id as any);
      const wipCount = tickets.length;
      const wipExceeded = wipLimit && wipCount >= wipLimit;
      const isSelected = colIndex === this.selectedColumnIndex;

      const colBox = blessed.box({
        parent,
        top: 0,
        left: `${Math.round((colIndex / COLUMNS.length) * 100)}%`,
        width: `${Math.round(100 / COLUMNS.length)}%`,
        height: '100%',
        border: isSelected ? 'line' : 'line',
        style: { 
          border: { fg: isSelected ? 'cyan' : col.color },
          bg: isSelected ? 'blue' : 'default'
        },
        label: ` ${col.title} ${wipCount}${wipLimit ? '/' + wipLimit : ''} `,
        tags: true,
      });

      this.columnBoxes.set(col.id, colBox);

      if (tickets.length === 0) {
        blessed.text({
          parent: colBox,
          top: 1,
          left: 1,
          content: '{gray-fg}(empty){/}',
          tags: true,
        });
      } else {
        tickets.forEach((ticket, ticketIndex) => {
          const isTicketSelected = isSelected && ticketIndex === this.selectedTicketIndex;
          const isDragged = this.dragMode && this.draggedTicketId === ticket.id;
          
          const priorityColors: Record<string, string> = {
            critical: 'red', high: 'magenta', medium: 'yellow', low: 'green',
          };

          const ticketBox = blessed.box({
            parent: colBox,
            top: ticketIndex + 1,
            left: 1,
            right: 1,
            height: 1,
            border: isDragged || isTicketSelected ? 'line' : undefined,
            style: {
              border: { fg: isDragged ? 'cyan' : isTicketSelected ? 'cyan' : 'gray' },
              bg: isDragged ? 'cyan' : isTicketSelected ? 'blue' : 'default',
            },
            content: `{${priorityColors[ticket.priority] || 'white'}-fg}${ticket.priority[0].toUpperCase()}{/} {${isDragged ? 'black' : isTicketSelected ? 'white' : 'white'}-fg}${ticket.title.substring(0, 28)}{/} ${ticket.storyPoints ? `{gray-fg}SP:${ticket.storyPoints}{/}` : ''} ${ticket.assignee ? `{cyan-fg}@${ticket.assignee}{/}` : ''}`,
            tags: true,
          });

          this.ticketBoxes.set(ticket.id, ticketBox);
        });

        if (wipExceeded) {
          blessed.text({
            parent: colBox,
            bottom: 0,
            left: 1,
            content: '{red-fg}{bold}⚠ WIP LIMIT EXCEEDED{/}',
            tags: true,
          });
        }
      }
    });

    // Help text at bottom
    blessed.text({
      parent,
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      content: this.dragMode 
        ? '{yellow-fg}🔄 DRAG MODE - Space to drop, ←/→ to move column{/}' 
        : '{gray-fg}←/→: Column | ↑/↓: Ticket | Enter: Detail | Space: Drag | r/i/v/q/o/b: Quick move{/}',
      tags: true,
      style: { bg: 'blue' },
    });
  }

  handleKey(key: string): boolean {
    const state = store.getState();
    const selectedColumn = COLUMNS[this.selectedColumnIndex];
    const tickets = store.getTicketsByStatus(selectedColumn.id);

    switch (key) {
      case 'left':
        this.selectedColumnIndex = Math.max(0, this.selectedColumnIndex - 1);
        this.selectedTicketIndex = 0;
        return true;
      case 'right':
        this.selectedColumnIndex = Math.min(COLUMNS.length - 1, this.selectedColumnIndex + 1);
        this.selectedTicketIndex = 0;
        return true;
      case 'up':
        this.selectedTicketIndex = Math.max(0, this.selectedTicketIndex - 1);
        return true;
      case 'down':
        this.selectedTicketIndex = Math.min(Math.max(0, tickets.length - 1), this.selectedTicketIndex + 1);
        return true;
      case 'enter':
        if (tickets[this.selectedTicketIndex]) {
          store.selectTicket(tickets[this.selectedTicketIndex].id);
          store.setView('ticket-detail');
        }
        return true;
      case 'space':
        if (tickets[this.selectedTicketIndex]) {
          this.dragMode = !this.dragMode;
          this.draggedTicketId = this.dragMode ? tickets[this.selectedTicketIndex].id : null;
        }
        return true;
      case 'r':
        this.moveSelected('ready');
        return true;
      case 'i':
        this.moveSelected('in-progress');
        return true;
      case 'v':
        this.moveSelected('review');
        return true;
      case 'q':
        this.moveSelected('qa');
        return true;
      case 'o':
        this.moveSelected('done');
        return true;
      case 'b':
        this.moveSelected('blocked');
        return true;
      case 'escape':
        if (this.dragMode) {
          this.dragMode = false;
          this.draggedTicketId = null;
        }
        return true;
    }
    return false;
  }

  private moveSelected(newStatus: ColumnId): void {
    const selectedColumn = COLUMNS[this.selectedColumnIndex];
    const tickets = store.getTicketsByStatus(selectedColumn.id);
    if (tickets[this.selectedTicketIndex]) {
      store.moveTicket(tickets[this.selectedTicketIndex].id, newStatus);
    }
  }
}