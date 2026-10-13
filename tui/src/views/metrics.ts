import blessed, { Widgets } from 'blessed';
import { store } from '../store.js';
import { format } from 'date-fns';

export class MetricsView {
  private screen: Widgets.Screen;

  constructor(screen: Widgets.Screen) {
    this.screen = screen;
  }

  render(parent: Widgets.BoxElement): void {
    const state = store.getState();
    const project = state.project;
    if (!project) return;

    const metrics = project.metrics;
    const tickets = project.tickets;

    // Calculate additional metrics
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentDone = tickets.filter(t => 
      t.status === 'done' && t.completedAt && new Date(t.completedAt) > weekAgo
    ).length;
    
    const inProgressCount = tickets.filter(t => t.status === 'in-progress').length;
    const reviewCount = tickets.filter(t => t.status === 'review').length;
    const blockedCount = tickets.filter(t => t.status === 'blocked').length;
    
    const activeTickets = tickets.filter(t => !['backlog', 'done'].includes(t.status));
    const priorityInActive = activeTickets.reduce((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeDist = tickets.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const assigneeWorkload = tickets
      .filter(t => t.assignee && !['done', 'backlog'].includes(t.status))
      .reduce((acc, t) => {
        const points = t.storyPoints || 0;
        acc[t.assignee!] = (acc[t.assignee!] || 0) + points;
        return acc;
      }, {} as Record<string, number>);

    // Top metrics
    const statsBox = blessed.box({
      parent,
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      style: { bg: 'default' },
    });

    let statsContent = '';
    statsContent += `{green-fg}{bold}${recentDone}{/} {gray-fg}This Week{/}  `;
    statsContent += `{yellow-fg}{bold}${inProgressCount}{/} {gray-fg}In Progress{/}  `;
    statsContent += `{magenta-fg}{bold}${reviewCount}{/} {gray-fg}In Review{/}  `;
    statsContent += `{red-fg}{bold}${blockedCount}{/} {gray-fg}Blocked{/}  `;
    statsContent += `{blue-fg}{bold}${metrics.leadTime.toFixed(1)}{/} {gray-fg}Lead Time{/}  `;
    statsContent += `{cyan-fg}{bold}${metrics.cycleTime.toFixed(1)}{/} {gray-fg}Cycle Time{/}`;
    statsBox.setContent(statsContent);

    // Priority distribution
    const priorityBox = blessed.box({
      parent,
      top: 4,
      left: 0,
      width: '50%',
      height: '45%',
      border: 'line',
      style: { border: { fg: 'blue' } },
      label: ' Priority Distribution (Active) ',
      tags: true,
    });

    let priorityContent = '';
    Object.entries(priorityInActive).forEach(([priority, count]) => {
      const colors: Record<string, string> = {
        critical: 'red', high: 'magenta', medium: 'yellow', low: 'green',
      };
      const bar = '█'.repeat(Math.min(count * 3, 40));
      priorityContent += `{${colors[priority] || 'white'}-fg}${priority.padEnd(10)}{/} {white-fg}${count.toString().padStart(3)}{/} {gray-fg}${bar}{/}\n`;
    });
    if (Object.keys(priorityInActive).length === 0) {
      priorityContent = '{gray-fg}No active tickets{/}';
    }
    priorityBox.setContent(priorityContent);

    // Type distribution
    const typeBox = blessed.box({
      parent,
      top: 4,
      right: 0,
      width: '50%',
      height: '45%',
      border: 'line',
      style: { border: { fg: 'magenta' } },
      label: ' Ticket Types ',
      tags: true,
    });

    let typeContent = '';
    Object.entries(typeDist).forEach(([type, count]) => {
      const colors: Record<string, string> = {
        bug: 'red', feature: 'green', technical: 'blue', docs: 'gray',
      };
      const bar = '█'.repeat(Math.min(count * 3, 40));
      typeContent += `{${colors[type] || 'white'}-fg}${type.padEnd(12)}{/} {white-fg}${count.toString().padStart(3)}{/} {gray-fg}${bar}{/}\n`;
    });
    typeBox.setContent(typeContent);

    // Assignee workload + Status flow
    const bottomBox = blessed.box({
      parent,
      top: '50%+4',
      left: 0,
      right: 0,
      bottom: 1,
      style: { bg: 'default' },
    });

    const assigneeBox = blessed.box({
      parent: bottomBox,
      top: 0,
      left: 0,
      width: '50%',
      height: '100%',
      border: 'line',
      style: { border: { fg: 'green' } },
      label: ' Assignee Workload (SP) ',
      tags: true,
    });

    let assigneeContent = '';
    Object.entries(assigneeWorkload)
      .sort(([,a], [,b]) => b - a)
      .forEach(([assignee, points]) => {
        const bar = '█'.repeat(Math.min(points * 2, 40));
        assigneeContent += `{cyan-fg}@${assignee.padEnd(13)}{/} {yellow-fg}{bold}${points} SP{/} {gray-fg}${bar}{/}\n`;
      });
    if (Object.keys(assigneeWorkload).length === 0) {
      assigneeContent = '{gray-fg}No assigned active tickets{/}';
    }
    assigneeBox.setContent(assigneeContent);

    const statusFlowBox = blessed.box({
      parent: bottomBox,
      top: 0,
      right: 0,
      width: '50%',
      height: '100%',
      border: 'line',
      style: { border: { fg: 'yellow' } },
      label: ' Status Flow ',
      tags: true,
    });

    let statusContent = '';
    Object.entries(metrics.ticketsByStatus).forEach(([status, count]) => {
      const pct = metrics.totalTickets > 0 ? ((count / metrics.totalTickets) * 100).toFixed(1) : '0';
      const colors: Record<string, string> = {
        backlog: 'gray', ready: 'blue', 'in-progress': 'yellow',
        review: 'magenta', qa: 'cyan', done: 'green', blocked: 'red',
      };
      const bar = '█'.repeat(Math.min(Math.round(count * 40 / Math.max(1, metrics.totalTickets)), 40));
      statusContent += `{${colors[status] || 'white'}-fg}${status.padEnd(14)}{/} {white-fg}${count.toString().padStart(4)}{/} {gray-fg}${pct.padStart(5)}%{/} {${colors[status] || 'white'}-fg}${bar}{/}\n`;
    });
    statusFlowBox.setContent(statusContent);

    // Velocity & Predictability
    const velocityBox = blessed.box({
      parent,
      bottom: 0,
      left: 0,
      right: 0,
      height: 5,
      border: 'line',
      style: { border: { fg: 'cyan' } },
      label: ' Velocity & Predictability ',
      tags: true,
    });

    let velocityContent = '';
    velocityContent += `{bold}Total SP:{/} ${metrics.totalStoryPoints}  `;
    velocityContent += `{bold}Completed SP:{/} ${metrics.completedStoryPoints}  `;
    velocityContent += `{bold}Remaining SP:{/} ${metrics.totalStoryPoints - metrics.completedStoryPoints}  `;
    velocityContent += `{bold}Completion:{/} ${metrics.totalStoryPoints > 0 ? ((metrics.completedStoryPoints / metrics.totalStoryPoints) * 100).toFixed(1) + '%' : 'N/A'}\n`;
    velocityContent += `{bold}Velocity:{/} ${metrics.velocity} SP/week  `;
    velocityContent += `{bold}Throughput:{/} ${metrics.throughput.toFixed(1)} tickets/week  `;
    velocityContent += `{bold}Waves:{/} ${project.waves?.length || 0}  `;
    velocityContent += `{bold}Blockers:{/} ${metrics.blockersCount}\n`;
    velocityContent += `{bold}Lead Time:{/} ${metrics.leadTime.toFixed(1)} days  `;
    velocityContent += `{bold}Cycle Time:{/} ${metrics.cycleTime.toFixed(1)} days  `;
    velocityContent += `{bold}Updated:{/} ${format(new Date(project.updatedAt), 'MM/dd HH:mm')}`;
    velocityBox.setContent(velocityContent);

    // Help
    blessed.text({
      parent,
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      content: '{gray-fg}r: Refresh | Esc: Back{/}',
      tags: true,
      style: { bg: 'blue' },
    });
  }

  handleKey(key: string): boolean {
    if (key === 'r') {
      // Would refresh
      return true;
    }
    if (key === 'escape') {
      return true;
    }
    return false;
  }
}