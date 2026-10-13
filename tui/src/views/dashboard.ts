import blessed, { Widgets } from 'blessed';
import { store } from '../store.js';
import { format } from 'date-fns';

export class DashboardView {
  private screen: Widgets.Screen;

  constructor(screen: Widgets.Screen) {
    this.screen = screen;
  }

  render(parent: Widgets.BoxElement): void {
    const state = store.getState();
    const project = state.project;
    if (!project) return;

    const metrics = project.metrics;
    const recentTickets = store.getFilteredTickets()
      .filter(t => t.updatedAt)
      .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())
      .slice(0, 5);

    // Stats row
    const statsBox = blessed.box({
      parent,
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      style: { bg: 'default' },
    });

    const stats = [
      { label: 'Total Tickets', value: metrics.totalTickets, color: 'cyan' },
      { label: 'In Progress', value: metrics.ticketsByStatus['in-progress'], color: 'yellow' },
      { label: 'In Review', value: metrics.ticketsByStatus.review, color: 'magenta' },
      { label: 'Done', value: metrics.ticketsByStatus.done, color: 'green' },
      { label: 'Blocked', value: metrics.blockersCount, color: 'red' },
      { label: 'Story Points', value: `${metrics.completedStoryPoints}/${metrics.totalStoryPoints}`, color: 'blue' },
    ];

    let statsContent = '';
    stats.forEach((s, i) => {
      statsContent += `{${s.color}-fg}${s.value}{/} {gray-fg}${s.label}{/}  `;
    });
    statsBox.setContent(statsContent);

    // Charts row
    const chartsBox = blessed.box({
      parent,
      top: 4,
      left: 0,
      right: 0,
      height: '50%',
      style: { bg: 'default' },
    });

    // Status chart
    const statusBox = blessed.box({
      parent: chartsBox,
      top: 0,
      left: 0,
      width: '50%',
      height: '100%',
      border: 'line',
      style: { border: { fg: 'blue' } },
      label: ' Tickets by Status ',
    });

    let statusContent = '';
    Object.entries(metrics.ticketsByStatus).forEach(([status, count]) => {
      const colors: Record<string, string> = {
        backlog: 'gray', ready: 'blue', 'in-progress': 'yellow',
        review: 'magenta', qa: 'cyan', done: 'green', blocked: 'red',
      };
      const bar = '█'.repeat(Math.min(count * 2, 30));
      statusContent += `{${colors[status] || 'white'}-fg}${status.padEnd(14)}{/} {white-fg}${count.toString().padStart(3)}{/} {gray-fg}${bar}{/}\n`;
    });
    statusBox.setContent(statusContent);

    // Priority chart
    const priorityBox = blessed.box({
      parent: chartsBox,
      top: 0,
      right: 0,
      width: '50%',
      height: '100%',
      border: 'line',
      style: { border: { fg: 'magenta' } },
      label: ' Tickets by Priority ',
    });

    let priorityContent = '';
    Object.entries(metrics.ticketsByPriority).forEach(([priority, count]) => {
      const colors: Record<string, string> = {
        critical: 'red', high: 'magenta', medium: 'yellow', low: 'green',
      };
      const bar = '█'.repeat(Math.min(count * 2, 30));
      priorityContent += `{${colors[priority] || 'white'}-fg}${priority.padEnd(10)}{/} {white-fg}${count.toString().padStart(3)}{/} {gray-fg}${bar}{/}\n`;
    });
    priorityBox.setContent(priorityContent);

    // Type chart + Recent activity
    const bottomBox = blessed.box({
      parent,
      top: '50%+4',
      left: 0,
      right: 0,
      bottom: 0,
      style: { bg: 'default' },
    });

    const typeBox = blessed.box({
      parent: bottomBox,
      top: 0,
      left: 0,
      width: '50%',
      height: '100%',
      border: 'line',
      style: { border: { fg: 'green' } },
      label: ' Tickets by Type ',
    });

    let typeContent = '';
    Object.entries(metrics.ticketsByType).forEach(([type, count]) => {
      const colors: Record<string, string> = {
        bug: 'red', feature: 'green', technical: 'blue', docs: 'gray',
      };
      typeContent += `{${colors[type] || 'white'}-fg}${type.padEnd(12)}{/} {white-fg}${count}{/}\n`;
    });
    typeBox.setContent(typeContent);

    const recentBox = blessed.box({
      parent: bottomBox,
      top: 0,
      right: 0,
      width: '50%',
      height: '100%',
      border: 'line',
      style: { border: { fg: 'yellow' } },
      label: ' Recent Activity ',
    });

    let recentContent = '';
    if (recentTickets.length === 0) {
      recentContent = '{gray-fg}No recent activity{/}';
    } else {
      recentTickets.forEach(t => {
        const colors: Record<string, string> = {
          backlog: 'gray', ready: 'blue', 'in-progress': 'yellow',
          review: 'magenta', qa: 'cyan', done: 'green', blocked: 'red',
        };
        recentContent += `{${colors[t.status] || 'white'}-fg}●{/} {white-fg}${t.title.substring(0, 30).padEnd(30)}{/} {gray-fg}${format(new Date(t.updatedAt), 'MM/dd HH:mm')}{/}\n`;
      });
    }
    recentBox.setContent(recentContent);

    // Project health at bottom
    const healthBox = blessed.box({
      parent,
      bottom: 0,
      left: 0,
      right: 0,
      height: 5,
      border: 'line',
      style: { border: { fg: 'cyan' } },
      label: ' Project Health ',
    });

    let healthContent = '';
    healthContent += `{bold}Lead Time:{/} ${metrics.leadTime.toFixed(1)} days avg  `;
    healthContent += `{bold}Cycle Time:{/} ${metrics.cycleTime.toFixed(1)} days avg  `;
    healthContent += `{bold}Throughput:{/} ${metrics.throughput.toFixed(1)} tickets/week\n`;
    healthContent += `{bold}Velocity:{/} ${metrics.velocity} SP/week  `;
    healthContent += `{bold}Completion:{/} ${metrics.totalStoryPoints > 0 ? ((metrics.completedStoryPoints / metrics.totalStoryPoints) * 100).toFixed(1) + '%' : 'N/A'}  `;
    healthContent += `{bold}Waves:{/} ${project.waves?.length || 0} planned`;
    healthBox.setContent(healthContent);
  }
}