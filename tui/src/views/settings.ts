import blessed, { Widgets } from 'blessed';
import { store } from '../store.js';
import { findBacklogFiles, parseBacklogMarkdown, listSavedProjects, loadProject, saveProject } from '../utils/project.js';

export class SettingsView {
  private screen: Widgets.Screen;
  private selectedIndex = 0;

  private settings = [
    { key: 'save', label: 'Save Project State', desc: 'Save current project to disk' },
    { key: 'load', label: 'Load Project', desc: 'Load a saved project state' },
    { key: 'refresh', label: 'Refresh from Backlog', desc: 'Reload tickets from backlog file' },
    { key: 'export', label: 'Export to JSON', desc: 'Export project as JSON file' },
    { key: 'clear', label: 'Clear Filters', desc: 'Reset all ticket filters' },
    { key: 'reset', label: 'Reset View', desc: 'Reset to dashboard view' },
  ];

  constructor(screen: Widgets.Screen) {
    this.screen = screen;
  }

  render(parent: Widgets.BoxElement): void {
    const state = store.getState();
    const project = state.project;

    blessed.text({
      parent,
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      content: '{bold}{cyan-fg}Settings{/}',
      tags: true,
    });

    // Actions list
    const listBox = blessed.list({
      parent,
      top: 1,
      left: 0,
      right: 0,
      bottom: project ? 12 : 3,
      style: {
        selected: { bg: 'blue', fg: 'white' },
        item: { fg: 'white' },
      },
      keys: true,
      vi: true,
      items: this.settings.map((s, i) => 
        `{${i === this.selectedIndex ? 'black-fg' : 'cyan-fg'}${i === this.selectedIndex ? '{blue-bg}' : ''} ${s.label} {/}{gray-fg} — ${s.desc}{/}`
      ),
    });

    listBox.select(this.selectedIndex);

    if (project) {
      // Project info
      const infoBox = blessed.box({
        parent,
        bottom: 1,
        left: 0,
        right: 0,
        height: 10,
        border: 'line',
        style: { border: { fg: 'green' } },
        label: ' Current Project ',
        tags: true,
      });

      let infoContent = '';
      infoContent += `{cyan-fg}Name:{/} {white-fg}${project.name}{/}\n`;
      infoContent += `{cyan-fg}Tickets:{/} {white-fg}${project.tickets.length}{/}\n`;
      infoContent += `{cyan-fg}Story Points:{/} {white-fg}${project.metrics.completedStoryPoints}/{/}{white-fg}${project.metrics.totalStoryPoints}{/}\n`;
      infoContent += `{cyan-fg}Waves:{/} {white-fg}${project.waves?.length || 0}{/}\n`;
      infoContent += `{cyan-fg}Last Updated:{/} {white-fg}${new Date(project.updatedAt).toLocaleString()}{/}`;
      infoBox.setContent(infoContent);
    }

    // Help
    blessed.text({
      parent,
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      content: '{gray-fg}↑/↓: Navigate | Enter: Select | Esc: Back to Dashboard{/}',
      tags: true,
      style: { bg: 'blue' },
    });
  }

  handleKey(key: string): boolean {
    switch (key) {
      case 'up':
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        return true;
      case 'down':
        this.selectedIndex = Math.min(this.settings.length - 1, this.selectedIndex + 1);
        return true;
      case 'enter':
        this.executeAction(this.settings[this.selectedIndex].key);
        return true;
      case 'escape':
        store.setView('dashboard');
        return true;
    }
    return false;
  }

  private executeAction(action: string): void {
    const state = store.getState();
    const project = state.project;

    switch (action) {
      case 'save':
        if (project) {
          const savedProject = { ...project, updatedAt: new Date().toISOString() };
          saveProject(savedProject);
          // Show confirmation
        }
        break;
      case 'load':
        this.showLoadDialog();
        break;
      case 'refresh':
        this.showRefreshDialog();
        break;
      case 'export':
        if (project) {
          const savedProject = { ...project, updatedAt: new Date().toISOString() };
          saveProject(savedProject);
        }
        break;
      case 'clear':
        store.clearFilters();
        break;
      case 'reset':
        store.setView('dashboard');
        break;
    }
  }

  private showLoadDialog(): void {
    const saved = listSavedProjects();
    if (saved.length === 0) return;

    const dialog = blessed.box({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: '60%',
      height: '50%',
      border: 'line',
      style: { border: { fg: 'blue' }, bg: 'black' },
      label: ' Load Project ',
      tags: true,
    });

    let loadDialogSelectedIndex = 0;
    const list = blessed.list({
      parent: dialog,
      top: 1,
      left: 1,
      right: 1,
      bottom: 1,
      items: saved.map(s => `{white-fg}${s}{/}`),
      style: { selected: { bg: 'blue', fg: 'white' }, item: { fg: 'white' } },
      keys: true,
      vi: true,
    });

    list.focus();

    list.key(['escape'], () => {
      dialog.destroy();
      this.screen.render();
    });

    list.key(['up'], () => {
      loadDialogSelectedIndex = Math.max(0, loadDialogSelectedIndex - 1);
      list.select(loadDialogSelectedIndex);
      this.screen.render();
    });

    list.key(['down'], () => {
      loadDialogSelectedIndex = Math.min(saved.length - 1, loadDialogSelectedIndex + 1);
      list.select(loadDialogSelectedIndex);
      this.screen.render();
    });

    list.key(['enter'], () => {
      const selected = saved[loadDialogSelectedIndex];
      if (selected) {
        const loaded = loadProject(selected);
        if (loaded) {
          store.setProject(loaded);
        }
      }
      dialog.destroy();
      this.screen.render();
    });

    this.screen.render();
  }

  private showRefreshDialog(): void {
    const dialog = blessed.box({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: '60%',
      height: 8,
      border: 'line',
      style: { border: { fg: 'yellow' }, bg: 'black' },
      label: ' Refresh from Backlog ',
      tags: true,
    });

    blessed.text({
      parent: dialog,
      top: 1,
      left: 1,
      right: 1,
      content: '{gray-fg}This will reload tickets from the backlog file.\nLocal changes will be merged where possible.{/}',
      tags: true,
    });

    const yesBtn = blessed.button({
      parent: dialog,
      bottom: 1,
      left: 'center-15',
      content: ' Yes ',
      style: { bg: 'green', fg: 'white', focus: { bg: 'green', fg: 'white' } },
      shrink: true,
      padding: { left: 2, right: 2 },
    });

    const noBtn = blessed.button({
      parent: dialog,
      bottom: 1,
      right: 'center-15',
      content: ' No ',
      style: { bg: 'red', fg: 'white', focus: { bg: 'red', fg: 'white' } },
      shrink: true,
      padding: { left: 2, right: 2 },
    });

    yesBtn.on('press', () => {
      const backlogs = findBacklogFiles();
      if (backlogs.length > 0) {
        const refreshed = parseBacklogMarkdown(backlogs[0]);
        store.setProject(refreshed);
      }
      dialog.destroy();
      this.screen.render();
    });

    noBtn.on('press', () => {
      dialog.destroy();
      this.screen.render();
    });

    yesBtn.focus();
    this.screen.render();
  }
}