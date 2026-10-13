import blessed, { Widgets } from 'blessed';
import { store } from '../store.js';
import { format } from 'date-fns';

export class TicketDetailView {
  private screen: Widgets.Screen;
  private scrollOffset = 0;
  private contentLines: string[] = [];

  constructor(screen: Widgets.Screen) {
    this.screen = screen;
  }

  render(parent: Widgets.BoxElement): void {
    const ticket = store.getSelectedTicket();
    if (!ticket) {
      store.setView('list');
      return;
    }

    this.contentLines = this.buildContent(ticket);
    this.scrollOffset = 0;

    // Header
    const header = blessed.box({
      parent,
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      border: 'line',
      style: { border: { fg: 'blue' } },
      tags: true,
    });

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

    let headerContent = `{bold}{white-fg}${ticket.id}{/}  `;
    headerContent += `{${priorityColors[ticket.priority] || 'white'}-fg}{bold}${ticket.priority.toUpperCase()}{/}  `;
    headerContent += `{${statusColors[ticket.status] || 'white'}-fg}{bold}${ticket.status.toUpperCase()}{/}  `;
    headerContent += `{${typeColors[ticket.type] || 'white'}-fg}${ticket.type}{/}  `;
    if (ticket.storyPoints) headerContent += `{yellow-fg}{bold}SP: ${ticket.storyPoints}{/}  `;
    if (ticket.wave) headerContent += `{cyan-fg}Wave ${ticket.wave}{/}  `;
    headerContent += `{right}{gray-fg}Updated: ${format(new Date(ticket.updatedAt), 'MM/dd/yyyy HH:mm')}{/}`;

    header.setContent(headerContent);

    // Title
    blessed.text({
      parent,
      top: 2,
      left: 0,
      right: 0,
      height: 1,
      content: `{bold}{cyan-fg}${ticket.title}{/}`,
      tags: true,
    });

    // Content box
    const contentBox = blessed.box({
      parent,
      top: 3,
      left: 0,
      right: 0,
      bottom: 2,
      border: 'line',
      style: { border: { fg: 'blue' } },
      tags: true,
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
      mouse: true,
    });

    const visibleLines = this.contentLines.slice(this.scrollOffset, this.scrollOffset + 100);
    contentBox.setContent(visibleLines.join('\n'));

    // Help
    blessed.text({
      parent,
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      content: '{gray-fg}↑/↓: Scroll | PgUp/PgDn: Page | Home/End | e: Edit | b/Esc: Back | r/i/v/q/o/7: Move | a: Assign | l: Label{/}',
      tags: true,
      style: { bg: 'blue' },
    });
  }

  private buildContent(ticket: any): string[] {
    const lines: string[] = [];

    if (ticket.description) {
      lines.push('{bold}Description{/}');
      lines.push(...this.wrapText(ticket.description, 100));
      lines.push('');
    }

    if (ticket.context) {
      lines.push('{bold}Context{/}');
      lines.push(...this.wrapText(ticket.context, 100));
      lines.push('');
    }

    if (ticket.acceptanceCriteria.length > 0) {
      lines.push('{bold}Acceptance Criteria{/}');
      ticket.acceptanceCriteria.forEach((ac: any, i: number) => {
        const status = ac.verified ? '{green-fg}✓{/}' : '{yellow-fg}☐{/}';
        lines.push(`  ${status} AC-${i + 1}: Given ${ac.given}, When ${ac.when}, Then ${ac.then}`);
        if (ac.testRef) {
          lines.push(`       {gray-fg}Test: ${ac.testRef}{/}`);
        }
      });
      lines.push('');
    }

    if (ticket.scopeIncluded.length > 0) {
      lines.push('{bold}Scope Included{/}');
      ticket.scopeIncluded.forEach((s: string) => lines.push(`  • ${s}`));
      lines.push('');
    }
    if (ticket.scopeExcluded.length > 0) {
      lines.push('{bold}Scope Excluded{/}');
      ticket.scopeExcluded.forEach((s: string) => lines.push(`  • ${s}`));
      lines.push('');
    }

    if (ticket.dependsOn.length > 0) {
      lines.push('{bold}Depends On{/}');
      ticket.dependsOn.forEach((d: string) => lines.push(`  → ${d}`));
      lines.push('');
    }
    if (ticket.blocks.length > 0) {
      lines.push('{bold}Blocks{/}');
      ticket.blocks.forEach((b: string) => lines.push(`  ← ${b}`));
      lines.push('');
    }

    if (ticket.labels.length > 0) {
      lines.push('{bold}Labels{/}');
      lines.push(`  ${ticket.labels.map((l: string) => `[${l}]`).join(' ')}`);
      lines.push('');
    }

    if (ticket.branch || ticket.commitSha || ticket.prUrl) {
      lines.push('{bold}Git{/}');
      if (ticket.branch) lines.push(`  Branch: ${ticket.branch}`);
      if (ticket.commitSha) lines.push(`  Commit: ${ticket.commitSha.substring(0, 8)}`);
      if (ticket.prUrl) lines.push(`  PR: ${ticket.prUrl}`);
      lines.push('');
    }

    if (ticket.reviewIteration > 0) {
      lines.push('{bold}Review{/}');
      lines.push(`  Iteration: ${ticket.reviewIteration}/${ticket.maxReviewIterations}`);
      if (ticket.reviewStatus) lines.push(`  Status: ${ticket.reviewStatus}`);
      if (ticket.reviewNotes) lines.push(`  Notes: ${ticket.reviewNotes}`);
      lines.push('');
    }

    lines.push('{bold}Metadata{/}');
    lines.push(`  Created: ${format(new Date(ticket.createdAt), 'MM/dd/yyyy HH:mm')}`);
    lines.push(`  Updated: ${format(new Date(ticket.updatedAt), 'MM/dd/yyyy HH:mm')}`);
    if (ticket.startedAt) lines.push(`  Started: ${format(new Date(ticket.startedAt), 'MM/dd/yyyy HH:mm')}`);
    if (ticket.completedAt) lines.push(`  Completed: ${format(new Date(ticket.completedAt), 'MM/dd/yyyy HH:mm')}`);
    if (ticket.assignee) lines.push(`  Assignee: ${ticket.assignee}`);

    return lines;
  }

  private wrapText(text: string, width: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).length > width) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine += (currentLine ? ' ' : '') + word;
      }
    }
    if (currentLine) lines.push(currentLine);

    return lines;
  }

  handleKey(key: string): boolean {
    switch (key) {
      case 'up':
        this.scrollOffset = Math.max(0, this.scrollOffset - 1);
        return true;
      case 'down':
        this.scrollOffset += 1;
        return true;
      case 'pageup':
        this.scrollOffset = Math.max(0, this.scrollOffset - 20);
        return true;
      case 'pagedown':
        this.scrollOffset += 20;
        return true;
      case 'home':
        this.scrollOffset = 0;
        return true;
      case 'end':
        this.scrollOffset = 1000;
        return true;
      case 'r':
        if (store.getSelectedTicket()) store.moveTicket(store.getSelectedTicket()!.id, 'ready');
        return true;
      case 'i':
        if (store.getSelectedTicket()) store.moveTicket(store.getSelectedTicket()!.id, 'in-progress');
        return true;
      case 'v':
        if (store.getSelectedTicket()) store.moveTicket(store.getSelectedTicket()!.id, 'review');
        return true;
      case 'q':
        if (store.getSelectedTicket()) store.moveTicket(store.getSelectedTicket()!.id, 'qa');
        return true;
      case 'o':
        if (store.getSelectedTicket()) store.moveTicket(store.getSelectedTicket()!.id, 'done');
        return true;
      case 'b':
      case 'escape':
        store.selectTicket(null);
        store.setView('list');
        return true;
    }
    return false;
  }
}