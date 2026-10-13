# Claude Code — Inventaire Complet des Fonctionnalités

> Référence exhaustive de toutes les fonctionnalités, customisations et techniques avancées de Claude Code.

---

## Table des matières

- [1. Fichiers de customisation](#1-fichiers-de-customisation)
- [2. Skills](#2-skills)
- [3. Agents / Subagents](#3-agents--subagents)
- [4. Commands](#4-commands)
- [5. Rules](#5-rules)
- [6. Hooks](#6-hooks)
- [7. MCP Servers](#7-mcp-servers)
- [8. Agent Teams](#8-agent-teams)
- [9. Plugins](#9-plugins)
- [10. Variables d'environnement](#10-variables-denvironnement)
- [11. CLI — Flags et options](#11-cli--flags-et-options)
- [12. Commandes slash intégrées](#12-commandes-slash-intégrées)
- [13. Raccourcis clavier](#13-raccourcis-clavier)
- [14. Extended Thinking](#14-extended-thinking)
- [15. Gestion du contexte](#15-gestion-du-contexte)
- [16. Worktrees](#16-worktrees)
- [17. Tâches planifiées](#17-tâches-planifiées)
- [18. Permissions et sécurité](#18-permissions-et-sécurité)
- [19. Mémoire](#19-mémoire)
- [20. IDE Integrations](#20-ide-integrations)
- [21. Notebooks Jupyter](#21-notebooks-jupyter)
- [22. Mode /btw](#22-mode-btw)

---

## 1. Fichiers de customisation

| Fichier | Emplacement | Rôle | Chargement |
|---------|-------------|------|------------|
| **CLAUDE.md** | `./CLAUDE.md` | Instructions projet | Automatique à chaque session |
| **CLAUDE.md** | `~/.claude/CLAUDE.md` | Instructions personnelles | Automatique (tous projets) |
| **CLAUDE.md** | Managed (système) | Politiques organisation | Automatique (priorité max) |
| **Rules** | `.claude/rules/*.md` | Règles conditionnelles par chemin | Automatique |
| **Skills** | `.claude/skills/nom/SKILL.md` | Connaissances + workflows | Auto (description match) ou `/nom` |
| **Commands** | `.claude/commands/nom.md` | Actions manuelles | `/nom` uniquement |
| **Agents** | `.claude/agents/nom.md` | Subagents isolés avec persona | Invoqués par skills/commands |
| **Hooks** | `settings.json` → `hooks` | Automatismes sur événements | Automatique sur événement |
| **Plugins** | `.claude-plugin/plugin.json` | Extensions distribuables | Installation manuelle |
| **MCP** | `.mcp.json` | Serveurs externes | Automatique au démarrage |

### Hiérarchie de priorité

```
Managed (organisation) > Project (.claude/settings.json) > Local (.claude/settings.local.json) > User (~/.claude/settings.json)
```

### Import de fichiers dans CLAUDE.md

```markdown
# Mon projet
@docs/architecture.md          ← importe un fichier
@~/.claude/my-conventions.md   ← importe depuis le home
```

---

## 2. Skills

### Structure

```
.claude/skills/mon-skill/
├── SKILL.md          # Obligatoire — instructions + frontmatter
├── templates/        # Optionnel — modèles de fichiers
├── examples/         # Optionnel — exemples
├── scripts/          # Optionnel — scripts utilitaires
└── reference.md      # Optionnel — documentation détaillée
```

### Frontmatter complet

```yaml
---
name: mon-skill                          # Identifiant (→ /mon-skill)
description: |                           # Description pour auto-chargement
  Ce que fait ce skill.
  Mots-clés pour le matching contextuel.
disable-model-invocation: true           # true = seulement toi peux invoquer
user-invocable: false                    # false = seulement Claude peut charger
context: fork                            # Exécute dans un subagent isolé
agent: Explore|Plan|general-purpose      # Type de subagent si context: fork
model: sonnet|opus|haiku|inherit         # Modèle spécifique
allowed-tools: Read, Grep, Bash          # Outils autorisés sans permission
disallowedTools: Write, Edit             # Outils interdits
argument-hint: "[fichier] [format]"      # Hint pour l'autocomplétion
---
```

### Modes d'invocation

| Frontmatter | Toi | Claude | Quand |
|-------------|-----|--------|-------|
| (défaut) | `/skill` | Auto si description matche | Plus flexible |
| `disable-model-invocation: true` | `/skill` | Jamais | Actions sensibles (deploy) |
| `user-invocable: false` | Jamais | Auto si description matche | Contexte invisible (legacy) |

### Substitutions dynamiques

| Variable | Contenu |
|----------|---------|
| `$ARGUMENTS` | Tous les arguments passés |
| `$0`, `$1`, `$2` | Arguments par position |
| `${CLAUDE_SESSION_ID}` | ID de session unique |
| `${CLAUDE_SKILL_DIR}` | Chemin du dossier du skill |
| `` !`commande` `` | Exécute la commande et injecte le résultat |

### Progressive disclosure (chargement intelligent)

1. **Descriptions** de tous les skills → toujours en contexte (~2% de la fenêtre)
2. **Contenu complet** → chargé uniquement si la conversation matche la description
3. **Budget** : contrôlé par `SLASH_COMMAND_TOOL_CHAR_BUDGET` (défaut: ~20000 chars)

### Localisation

| Niveau | Chemin | Portée |
|--------|--------|--------|
| Personnel | `~/.claude/skills/nom/` | Tous tes projets |
| Projet | `.claude/skills/nom/` | Ce projet |
| Plugin | `plugin/skills/nom/` | Où le plugin est activé |
| Entreprise | Managed settings | Tous les utilisateurs |

---

## 3. Agents / Subagents

### Structure

```
.claude/agents/mon-agent.md
```

### Frontmatter complet

```yaml
---
name: Mon Agent
description: Quand déléguer à cet agent
tools: Read, Grep, Bash                  # Outils autorisés
disallowedTools: Write, Edit             # Outils interdits
model: sonnet|opus|haiku|inherit         # Modèle
maxTurns: 10                             # Limite de tours agentic
isolation: worktree                      # Copie isolée du repo
background: true                         # Toujours en arrière-plan
permissionMode: default|acceptEdits|bypassPermissions|plan
skills: [api-conventions, testing]       # Skills pré-chargés
mcpServers:                              # MCP spécifiques à cet agent
  - github
  - slack:
      type: stdio
      command: npx -y slack-mcp
hooks:                                   # Hooks spécifiques
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./validate.sh"
memory: user|project|local               # Portée mémoire
---

Instructions de l'agent en markdown...
```

### Agents intégrés

| Agent | Modèle | Outils | Usage |
|-------|--------|--------|-------|
| **Explore** | Haiku | Lecture seule | Recherche rapide dans le code |
| **Plan** | Hérite | Lecture seule | Planification sans implémentation |
| **general-purpose** | Hérite | Tous | Tâches complexes multi-étapes |

---

## 4. Commands

### Structure

```
.claude/commands/ma-commande.md
```

### Format

```markdown
Description de ce que fait la commande.

Instructions pour Claude quand /ma-commande est invoquée.

Arguments reçus : $ARGUMENTS
Premier argument : $1
Deuxième : $2
```

### Différence avec les Skills

| | Commands | Skills |
|---|---------|--------|
| Auto-chargement | Non | Oui |
| Fichiers support | Non | Oui (dossier) |
| Isolation | Non | Optionnel (context: fork) |
| Recommandation | Legacy | Approche recommandée |

---

## 5. Rules

### Structure

```yaml
# .claude/rules/ma-regle.md
---
paths:                    # Optionnel — si absent, toujours chargé
  - "src/api/**/*.ts"
  - "lib/data/**/*.dart"
---

# Instructions conditionnelles

Règles qui s'appliquent uniquement aux fichiers matchant les paths.
```

### Localisation

| Niveau | Chemin |
|--------|--------|
| Projet | `.claude/rules/*.md` |
| Personnel | `~/.claude/rules/*.md` |

**Chargement** : toujours actif (pas de matching description comme les skills).

---

## 6. Hooks

### Tous les événements

| Événement | Se déclenche quand | Peut bloquer |
|-----------|-------------------|--------------|
| **SessionStart** | Session démarre/reprend | Oui |
| **InstructionsLoaded** | CLAUDE.md/rules chargés | Oui |
| **UserPromptSubmit** | Utilisateur envoie un message | Oui |
| **PreToolUse** | Avant exécution d'un outil | Oui (exit 2) |
| **PermissionRequest** | Dialogue de permission | Oui |
| **PostToolUse** | Après exécution réussie | Oui |
| **PostToolUseFailure** | Après échec d'un outil | Oui |
| **Notification** | Notification système | Non |
| **SubagentStart** | Subagent créé | Non |
| **SubagentStop** | Subagent terminé | Non |
| **Stop** | Claude finit de répondre | Oui |
| **TeammateIdle** | Teammate inactif | Oui |
| **TaskCompleted** | Tâche marquée complète | Oui |
| **ConfigChange** | Config modifiée | Oui |
| **WorktreeCreate** | Worktree créé | Remplace comportement |
| **WorktreeRemove** | Worktree supprimé | Non |
| **PreCompact** | Avant compression contexte | Non |
| **SessionEnd** | Session se termine | Non |

### 4 types de hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "dart format \"$CLAUDE_FILE_PATH\"",
            "timeout": 10
          },
          {
            "type": "http",
            "url": "http://localhost:8080/hooks",
            "headers": {"Authorization": "Bearer $TOKEN"}
          },
          {
            "type": "prompt",
            "prompt": "Ce code est-il sécurisé ?",
            "model": "haiku"
          },
          {
            "type": "agent",
            "prompt": "Vérifie que les tests passent",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

### Codes de sortie (command hooks)

| Exit code | Effet |
|-----------|-------|
| `0` | Autorisé, continuer |
| `2` | Bloqué — stderr affiché comme feedback |
| Autre | Autorisé mais stderr loggé |

### Output JSON pour contrôle

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny|allow|ask",
    "permissionDecisionReason": "raison"
  }
}
```

---

## 7. MCP Servers (Model Context Protocol)

### Installation

```bash
# HTTP (remote)
claude mcp add --transport http github https://api.github.com/mcp

# Stdio (local)
claude mcp add --transport stdio my-tool -- npx my-mcp-server

# Depuis un JSON
claude mcp add-json postgres '{"type":"stdio","command":"npx","args":["-y","@mcp/postgres"]}'

# Importer depuis Claude Desktop
claude mcp add-from-claude-desktop
```

### Config `.mcp.json`

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {"Authorization": "Bearer ${GITHUB_TOKEN}"}
    },
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {"DATABASE_URL": "${DATABASE_URL}"}
    }
  }
}
```

### Scopes

| Scope | Fichier | Partagé |
|-------|---------|---------|
| Project | `.mcp.json` | Oui (git) |
| Local | `~/.claude.json` | Non |
| User | `~/.claude.json` | Non |
| Managed | `managed-mcp.json` | Oui (organisation) |

### Features avancées

- **OAuth 2.0** : authentification automatique
- **MCP Tool Search** : lazy loading quand beaucoup d'outils (réduit -95% contexte)
- **MCP Prompts** : exécuter `/mcp__servername__promptname`
- **MCP Resources** : référencer `@servername:protocol://resource`

---

## 8. Agent Teams

### Activation

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Architecture

- **Team lead** : session principale qui coordonne
- **Teammates** : sessions indépendantes en parallèle
- **Communication** : `Shift+Down` pour cycler, messages directs ou broadcast
- **Tâches partagées** avec dépendances

### Modes d'affichage

| Mode | Requis |
|------|--------|
| `in-process` | Tout terminal |
| `tmux` | tmux ou iTerm2 |
| `auto` | Détecte automatiquement |

---

## 9. Plugins

### Structure

```
mon-plugin/
├── .claude-plugin/
│   └── plugin.json          # Manifest obligatoire
├── skills/                  # Skills du plugin
├── agents/                  # Agents du plugin
├── hooks/hooks.json         # Hooks du plugin
├── .mcp.json                # MCP servers
├── .lsp.json                # LSP servers
├── settings.json            # Settings par défaut
└── README.md
```

### Manifest `plugin.json`

```json
{
  "name": "mon-plugin",
  "version": "1.0.0",
  "description": "Description du plugin",
  "author": {"name": "Nom", "url": "https://github.com/..."},
  "license": "MIT"
}
```

### Commandes

```bash
claude --plugin-dir ./mon-plugin    # Test local
/plugin install nom                 # Installer
/plugin uninstall nom               # Supprimer
/plugin enable/disable nom          # Activer/désactiver
/reload-plugins                     # Recharger
```

---

## 10. Variables d'environnement

### Raisonnement

```bash
CLAUDE_CODE_EFFORT_LEVEL=low|medium|high     # Profondeur de réflexion
MAX_THINKING_TOKENS=10000                    # Budget thinking
CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING=1      # Thinking fixe au lieu d'adaptatif
```

### Contexte

```bash
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50           # Auto-compact à 50% du contexte
SLASH_COMMAND_TOOL_CHAR_BUDGET=20000         # Budget pour descriptions de skills
```

### Features

```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1       # Agent teams
ENABLE_TOOL_SEARCH=auto:5                    # Lazy loading outils MCP
CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1       # Désactiver tâches background
CLAUDE_CODE_DISABLE_CRON=1                   # Désactiver tâches planifiées
CLAUDE_CODE_DISABLE_AUTO_MEMORY=1            # Désactiver mémoire auto
CLAUDE_CODE_DISABLE_SLASH_COMMANDS=true      # Désactiver skills/commands
```

### API

```bash
ANTHROPIC_API_KEY=sk-...                     # Clé API
ANTHROPIC_BASE_URL=https://api.anthropic.com # Endpoint API
```

### Debug

```bash
CLAUDE_CODE_DEBUG=api,hooks                  # Catégories de debug
CLAUDE_CODE_VERBOSE=1                        # Output verbeux
```

---

## 11. CLI — Flags et options

### Session

```bash
claude                                # Session interactive
claude "prompt"                       # Démarrer avec un prompt
claude -p "prompt"                    # Mode print (non-interactif)
claude -c                             # Continuer dernière session
claude -r "nom"                       # Reprendre par nom/ID
claude --resume                       # Choisir session interactivement
claude -w feature-name                # Démarrer dans un worktree
claude --teleport                     # Reprendre session web localement
```

### Configuration

```bash
--model claude-opus-4-6               # Choisir le modèle
--agent mon-agent                     # Utiliser un agent custom
--permission-mode plan|default|acceptEdits|bypassPermissions
--tools "Bash,Edit,Read"              # Restreindre les outils
--allowedTools "Bash(git *)"          # Auto-approuver des outils
--disallowedTools "Write,Edit"        # Bloquer des outils
--add-dir ../other ../libs            # Ajouter des répertoires
--chrome                              # Activer le browser
--system-prompt "Tu es..."            # Remplacer le system prompt
--append-system-prompt "Aussi..."     # Ajouter des instructions
```

### Output

```bash
--output-format text|json|stream-json
--json-schema '{"type":"object"...}'  # Output structuré
--verbose                             # Mode verbeux
--debug "api,hooks"                   # Debug spécifique
```

### Limites

```bash
--max-turns 5                         # Limiter les tours agentic
--max-budget-usd 10.00                # Limite de dépense
--fallback-model sonnet               # Modèle de secours
```

### Pipe

```bash
cat fichier.txt | claude -p "analyse ce fichier"
git diff --staged | claude -p "review ces changements"
```

---

## 12. Commandes slash intégrées

```
/help              Aide
/config            Interface de configuration
/agents            Gérer les subagents
/memory            Voir/éditer CLAUDE.md et mémoire
/hooks             Gérer les hooks
/mcp               Gérer les serveurs MCP
/plugin            Gérer les plugins
/context           Voir l'utilisation du contexte
/compact           Compresser la conversation
/clear             Nouvelle session
/model             Changer de modèle
/cost              Voir les coûts tokens
/init              Générer un CLAUDE.md
/vim               Activer le mode vim
/theme             Changer le thème UI
/statusline        Configurer la barre de statut
/rename [nom]      Renommer la session
/resume [session]  Reprendre une session
/checkpoint        Créer un checkpoint
/rewind [N]        Restaurer un checkpoint
/debug [desc]      Debugger la session
/terminal-setup    Configurer le terminal
/btw               Question rapide (sans outils)
/batch             Changements parallèles à grande échelle
/simplify          Review et simplification de code
/loop [interval]   Tâche planifiée récurrente
```

---

## 13. Raccourcis clavier

### Contrôles généraux

| Raccourci | Action |
|-----------|--------|
| `Ctrl+C` | Annuler l'input/génération |
| `Ctrl+D` | Quitter la session |
| `Ctrl+L` | Effacer l'écran |
| `Ctrl+O` | Toggle verbose (voir le thinking) |
| `Ctrl+F` (×2) | Kill les agents background |
| `Ctrl+G` | Ouvrir le prompt dans un éditeur |
| `Ctrl+R` | Recherche historique |
| `Ctrl+V` | Coller une image |
| `Ctrl+B` | Mettre en arrière-plan |
| `Ctrl+T` | Toggle la task list |
| `Shift+Tab` | Changer mode permission |
| `Alt+P` | Changer de modèle |
| `Alt+T` | Toggle extended thinking |
| `Esc Esc` | Rewind |

### Saisie multi-ligne

| Raccourci | Terminal |
|-----------|---------|
| `Shift+Enter` | iTerm2, WezTerm, Ghostty, Kitty |
| `Option+Enter` | macOS |
| `\ + Enter` | Tous |

### Mode Vim (`/vim`)

| Mode | Raccourci | Action |
|------|-----------|--------|
| Normal | `i/a/o` | Passer en insertion |
| Normal | `dd` | Supprimer ligne |
| Normal | `w/b/e` | Navigation par mot |
| Normal | `0/$` | Début/fin de ligne |
| Normal | `y/p` | Copier/coller |
| Normal | `.` | Répéter dernière action |

---

## 14. Extended Thinking

### Activation

```bash
# Variable d'environnement
export CLAUDE_CODE_EFFORT_LEVEL=high

# Settings
"effort": "low|medium|high"

# Mot-clé dans le prompt (ponctuel)
ultrathink: analyse cette architecture complexe

# Toggle en session
Alt+T

# Toujours actif
"alwaysThinkingEnabled": true

# Voir le raisonnement
Ctrl+O (toggle verbose)
```

### Fonctionnement

- **Opus 4.6** : raisonnement adaptatif (tokens dynamiques selon l'effort)
- **Autres modèles** : budget fixe de 31 999 tokens
- `MAX_THINKING_TOKENS` pour limiter le budget

---

## 15. Gestion du contexte

### Commandes

| Commande | Effet |
|----------|-------|
| `/context` | Voir l'utilisation et les warnings |
| `/compact` | Compresser manuellement |
| `/clear` | Nouvelle session (reset) |

### Auto-compaction

```bash
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50    # Compact à 50% au lieu du défaut
```

### Bonnes pratiques

- CLAUDE.md < 200 lignes
- Utiliser rules/ pour les instructions par chemin
- Utiliser subagents pour isoler les résultats verbeux
- Importer avec `@fichier` au lieu de copier du contenu

---

## 16. Worktrees

### Utilisation

```bash
claude -w feature-auth              # Nommé
claude --worktree                   # Nom auto-généré
claude --worktree --fork-session    # Fork dans un worktree
```

### Dans un agent

```yaml
---
isolation: worktree
---
```

### Chemins

- Location : `<repo>/.claude/worktrees/<nom>`
- Branche : `worktree-<nom>`

### Nettoyage

- Pas de changements → auto-supprimé
- Avec changements → demande confirmation
- Manuel : `git worktree list` / `git worktree remove`

---

## 17. Tâches planifiées

### `/loop` — Récurrent

```bash
/loop 5m vérifie le build
/loop 1h résume les nouvelles issues
/loop 30m /mon-skill
```

### Rappels one-shot

```
rappelle-moi à 15h de pusher
dans 45 minutes, vérifie les tests
```

### Cron (expressions 5 champs)

```
*/5 * * * *       Toutes les 5 minutes
0 * * * *         Toutes les heures
0 9 * * 1-5       Lundi-vendredi à 9h
```

### Limitations

- Expirent après 3 jours
- Seulement quand la session est idle
- Pas de persistance entre restarts

---

## 18. Permissions et sécurité

### Config

```json
{
  "permissions": {
    "defaultMode": "default|acceptEdits|plan|bypassPermissions",
    "allow": ["Read", "Bash(git *)", "Skill(deploy)"],
    "deny": ["Edit(.env*)", "Bash(rm -rf *)"]
  },
  "sandboxing": {
    "enabled": true,
    "writeablePaths": ["/tmp"]
  }
}
```

### Syntaxe des règles

```
Read                    # Outil entier
Bash(git *)             # Préfixe de commande
Edit(.env)              # Fichier spécifique
Skill(deploy)           # Skill spécifique
Agent(researcher)       # Agent spécifique
MCP(github)             # Serveur MCP spécifique
```

---

## 19. Mémoire

### Auto-mémoire

```
~/.claude/projects/<projet>/memory/
├── MEMORY.md           # Index (200 lignes max, toujours chargé)
├── user_role.md        # Infos utilisateur
├── feedback_testing.md # Corrections reçues
└── project_goals.md    # Objectifs projet
```

### CLAUDE.md comme mémoire projet

- Chargé automatiquement
- Supporte les imports `@fichier`
- Hiérarchie : Global → Projet → Local

---

## 20. IDE Integrations

### VS Code

- Extension "Claude" sur le marketplace
- Prompt box intégré, références fichiers, reprise de session
- Bascule entre CLI et IDE

### JetBrains

- IntelliJ, PyCharm, WebStorm, Rider, CLion...
- Installation via marketplace intégré
- Support WSL et remote development

---

## 21. Notebooks Jupyter

Claude lit et édite les `.ipynb` directement :
- Affiche le code, les outputs, les visualisations
- Peut modifier les cellules individuellement

---

## 22. Mode /btw

```
/btw c'est quoi la différence entre StatefulWidget et StatelessWidget ?
```

Réponse instantanée depuis les connaissances de Claude, sans lire de fichiers ni exécuter d'outils. Rapide et économique.

---

## Résumé — Impact par feature

| Feature | Impact | Difficulté |
|---------|--------|-----------|
| **CLAUDE.md bien écrit** | Enorme | Facile |
| **Skills avec auto-chargement** | Enorme | Moyen |
| **Agents spécialisés** | Très fort | Moyen |
| **MCP servers** | Très fort | Moyen |
| **Hooks** (linting, validation) | Fort | Avancé |
| **Agent Teams** | Fort | Avancé |
| **Worktrees** | Fort | Facile |
| **Extended thinking** | Fort | Facile |
| **Rules par chemin** | Moyen | Facile |
| **Plugins** | Moyen | Avancé |
| **CLI pipes** | Moyen | Facile |
| **Scheduled tasks** | Moyen | Facile |

---

## Sources

- [Claude Code Docs — Features Overview](https://code.claude.com/docs/en/features-overview)
- [Claude Code Settings Reference](https://code.claude.com/docs/en/settings)
- [Claude Code Setup Guide 2026](https://okhlopkov.com/claude-code-setup-mcp-hooks-skills-2026/)
- [Claude Code Extensions Explained](https://muneebsa.medium.com/claude-code-extensions-explained-skills-mcp-hooks-subagents-agent-teams-plugins-9294907e84ff)
- [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code)
