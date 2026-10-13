import blessed, { Widgets } from 'blessed';
import { store } from '../store.js';
import { format } from 'date-fns';

export class WavesView {
  private screen: Widgets.Screen;
  private selectedWaveIndex = 0;
  private showDetail = false;

  constructor(screen: Widgets.Screen) {
    this.screen = screen;
  }

  render(parent: Widgets.BoxElement): void {
    const state = store.getState();
    const project = state.project;
    
    if (!project || !project.waves || project.waves.length === 0) {
      blessed.text({
        parent,
        top: 'center',
        left: 'center',
        content: '{gray-fg}No waves configured{/}\n{gray-fg}Run parallel implementation to generate waves{/}',
        tags: true,
        align: 'center',
      });
      return;
    }

    const waves = project.waves;

    blessed.text({
      parent,
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      content: '{bold}{cyan-fg}Parallel Execution Waves{/}',
      tags: true,
    });

    const wavesBox = blessed.box({
      parent,
      top: 1,
      left: 0,
      right: 0,
      bottom: 2,
      style: { bg: 'default' },
    });

    waves.forEach((wave, index) => {
      const isSelected = index === this.selectedWaveIndex;
      const ticketCount = wave.ticketIds.length;
      const completedTickets = wave.ticketIds.filter(id => {
        const t = project.tickets.find(t => t.id === id);
        return t?.status === 'done';
      }).length;

      const statusColors: Record<string, string> = {
        pending: 'gray', running: 'yellow', completed: 'green', failed: 'red',
      };

      const waveBox = blessed.box({
        parent: wavesBox,
        top: index * 4,
        left: 1,
        right: 1,
        height: this.showDetail && isSelected ? 12 : 3,
        border: isSelected ? 'line' : 'line',
        style: { 
          border: { fg: isSelected ? 'cyan' : statusColors[wave.status] || 'gray' },
          bg: isSelected ? 'blue' : 'default'
        },
        label: ` Wave ${wave.id}: ${wave.name} `,
        tags: true,
      });

      let waveContent = `{${statusColors[wave.status] || 'white'}-fg}{bold}${wave.status.toUpperCase()}{/}  `;
      waveContent += `{gray-fg}Tickets: ${completedTickets}/${ticketCount}{/}  `;
      waveContent += `{gray-fg}Parallel: ${wave.parallel ? 'Yes' : 'No'} (max ${wave.maxParallel}){/}`;
      if (wave.startedAt) waveContent += `  {gray-fg}Started: ${format(new Date(wave.startedAt), 'MM/dd HH:mm')}{/}`;
      if (wave.completedAt) waveContent += `  {gray-fg}Completed: ${format(new Date(wave.completedAt), 'MM/dd HH:mm')}{/}`;
      waveBox.setContent(waveContent);

      if (this.showDetail && isSelected) {
        const ticketsBox = blessed.box({
          parent: waveBox,
          top: 2,
          left: 1,
          right: 1,
          bottom: 1,
          tags: true,
        });

        let ticketsContent = '{bold}Tickets in this wave:{/}\n';
        wave.ticketIds.forEach(ticketId => {
          const ticket = project.tickets.find(t => t.id === ticketId);
          if (!ticket) return;
          
          const statusColors: Record<string, string> = {
            backlog: 'gray', ready: 'blue', 'in-progress': 'yellow',
            review: 'magenta', qa: 'cyan', done: 'green', blocked: 'red',
          };
          const priorityColors: Record<string, string> = {
            critical: 'red', high: 'magenta', medium: 'yellow', low: 'green',
          };

          ticketsContent += `{${statusColors[ticket.status] || 'white'}-fg}●{/} {white-fg}${ticket.title.substring(0, 40).padEnd(40)}{/} `;
          ticketsContent += `{${priorityColors[ticket.priority] || 'white'}-fg}${ticket.priority.padEnd(8)}{/} `;
          ticketsContent += `{${statusColors[ticket.status] || 'white'}-fg}${ticket.status.padEnd(14)}{/}`;
          if (ticket.storyPoints) ticketsContent += ` {yellow-fg}SP:${ticket.storyPoints}{/}`;
          if (ticket.assignee) ticketsContent += ` {cyan-fg}@${ticket.assignee}{/}`;
          ticketsContent += '\n';
        });
        ticketsBox.setContent(ticketsContent);
      }
    });

    // Help
    blessed.text({
      parent,
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      content: '{gray-fg}↑/↓: Navigate | Enter: Toggle detail | Space: Start/stop wave | Esc: Back{/}',
      tags: true,
      style: { bg: 'blue' },
    });
  }

  handleKey(key: string): boolean {
    const state = store.getState();
    const project = state.project;
    if (!project || !project.waves) return false;

    const waves = project.waves;

    switch (key) {
      case 'up':
        this.selectedWaveIndex = Math.max(0, this.selectedWaveIndex - 1);
        return true;
      case 'down':
        this.selectedWaveIndex = Math.min(waves.length - 1, this.selectedWaveIndex + 1);
        return true;
      case 'enter':
        this.showDetail = !this.showDetail;
        return true;
      case 'space':
        const wave = waves[this.selectedWaveIndex];
        if (wave.status === 'pending') {
          // Would start wave
        } else if (wave.status === 'running') {
          // Would pause wave
        }
        return true;
      case 'escape':
        if (this.showDetail) {
          this.showDetail = false;
        } else {
          store.setView('kanban');
        }
        return true;
    }
    return false;
  }
}