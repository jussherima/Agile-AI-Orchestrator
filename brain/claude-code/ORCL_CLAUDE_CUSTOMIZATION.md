# ORCL_CLAUDE_CUSTOMIZATION — Guide complet de personnalisation de Claude Code

## Table des matières

1. [Vue d'ensemble de l'écosystème](#1-vue-densemble-de-lécosystème)
2. [CLAUDE.md — Instructions persistantes](#2-claudemd--instructions-persistantes)
3. [Rules — Règles contextuelles](#3-rules--règles-contextuelles)
4. [Skills — Expertise auto-chargée](#4-skills--expertise-auto-chargée)
5. [Slash Commands — Actions manuelles](#5-slash-commands--actions-manuelles)
6. [Subagents — Agents spécialisés](#6-subagents--agents-spécialisés)
7. [Hooks — Actions déterministes](#7-hooks--actions-déterministes)
8. [Agent Teams — Multi-agents coordonnés](#8-agent-teams--multi-agents-coordonnés)
9. [MCP Servers — Outils externes](#9-mcp-servers--outils-externes)
10. [Plugins Marketplace](#10-plugins-marketplace)
11. [Scheduled Tasks — Tâches planifiées](#11-scheduled-tasks--tâches-planifiées)
12. [Settings.json — Contrôle et permissions](#12-settingsjson--contrôle-et-permissions)
13. [System Prompt — Prompt engineering](#13-system-prompt--prompt-engineering)
14. [Extended & Adaptive Thinking](#14-extended--adaptive-thinking)
15. [Workflows — Pipelines orchestrés](#15-workflows--pipelines-orchestrés)
16. [Cas pratique : Plan du jour automatique](#16-cas-pratique--plan-du-jour-automatique)
17. [Arbre de décision : quel mécanisme utiliser ?](#17-arbre-de-décision--quel-mécanisme-utiliser-)
18. [Structure de fichiers recommandée](#18-structure-de-fichiers-recommandée)
19. [Sources](#19-sources)

---

## 1. Vue d'ensemble de l'écosystème

Claude Code possède **9 mécanismes** de personnalisation organisés en 5 catégories :

```
┌─────────────────────────────────────────────────────────┐
│                   PERSONNALISATION CLAUDE                │
├──────────────┬──────────────────────────────────────────┤
│ INSTRUCTIONS │ System Prompt (API/Projects)             │
│              │ CLAUDE.md (projet)                       │
│              │ .claude/rules/*.md (règles contextuelles)│
├──────────────┼──────────────────────────────────────────┤
│ AUTOMATISMES │ Skills (.claude/skills/)                 │
│              │ Hooks (settings.json)                    │
│              │ Slash Commands (.claude/commands/)       │
├──────────────┼──────────────────────────────────────────┤
│ DÉLÉGATION   │ Subagents (.claude/agents/)              │
│              │ Agent Teams (multi-sessions coordonnées) │
├──────────────┼──────────────────────────────────────────┤
│ INTÉGRATION  │ MCP Servers (outils externes)            │
│              │ Plugins (marketplace)                    │
├──────────────┼──────────────────────────────────────────┤
│ CONTRÔLE     │ settings.json (permissions, env vars)    │
│              │ Extended/Adaptive Thinking               │
├──────────────┼──────────────────────────────────────────┤
│ ORCHESTRATION│ Workflows (pipelines multi-étapes)       │
│              │ Scheduled Tasks (tâches récurrentes)     │
└──────────────┴──────────────────────────────────────────┘
```

### Comparaison rapide

| Mécanisme | Déclenchement | Isolation | Déterministe | Cas d'usage principal |
|-----------|---------------|-----------|-------------|----------------------|
| **CLAUDE.md** | Auto (chaque session) | Non | Non | Instructions globales du projet |
| **Rules** | Auto (path-scoped) | Non | Non | Règles par sous-dossier |
| **Skills** | Auto (matching description) | Non | Non | Expertise domaine "always on" |
| **Slash Commands** | Manuel (`/nom`) | Non | Non | Actions à la demande |
| **Hooks** | Auto (événement système) | Oui (shell) | **Oui** | Linting, validation, notifications |
| **Subagents** | Auto (matching) ou manuel | **Oui** (contexte isolé) | Non | Tâches lourdes, review, recherche |
| **Agent Teams** | Manuel | **Oui** (par teammate) | Non | Travail parallèle sur gros projets |
| **MCP Servers** | Auto (outils disponibles) | Oui (processus) | Oui | Accès BDD, API, navigateur |
| **Plugins** | Installation marketplace | Variable | Variable | Extensions tierces |

---

## 2. CLAUDE.md — Instructions persistantes

### Qu'est-ce que c'est ?

Le fichier `CLAUDE.md` est le **principal fichier d'instructions** de ton projet. Claude le lit automatiquement au début de chaque session. C'est la "constitution" de ton projet.

### Structure recommandée (< 80 lignes)

```markdown
# Projet [Nom]

## WHAT — Le projet
[Description en 1-2 lignes, stack technique]

## WHY — L'objectif
[Pourquoi ce projet existe, quel problème il résout]

## HOW — Comment travailler
### Commandes
- Build : `npm run build`
- Test : `npm test`
- Lint : `npm run lint`

### Style de code
- [Convention de nommage]
- [Pattern utilisé : ex. Repository pattern]
- [Import style : ES modules]

### Pièges à éviter
- [Gotcha spécifique au projet]
- [Ce qui a cassé avant]

### Architecture
- `src/api/` — endpoints REST
- `src/services/` — logique métier
- `src/models/` — modèles de données
```

### Hiérarchie des fichiers CLAUDE.md

```
~/.claude/CLAUDE.md              → Global (toutes tes sessions)
  ./CLAUDE.md                    → Projet (partagé avec l'équipe)
    ./src/CLAUDE.md              → Local (sous-dossier spécifique)
      .claude/rules/*.md         → Règles auto-chargées (même priorité)
```

Les fichiers les plus spécifiques ont priorité sur les plus généraux.

### Bonnes pratiques

- **< 80 lignes** : au-delà, Claude commence à ignorer des parties
- **< 150-200 instructions** max : limite de suivi fiable par les LLMs
- **Actionnable** : chaque ligne doit guider une action concrète
- Utiliser `/init` pour générer un CLAUDE.md de départ automatiquement

### Ce qu'il ne faut PAS mettre

- ❌ "Sois un senior engineer" (Claude Code a déjà ses instructions système)
- ❌ "Réfléchis étape par étape" (gaspillage de tokens)
- ❌ Documentation exhaustive du code
- ❌ Personnalité ou ton (inutile dans Claude Code)

---

## 3. Rules — Règles contextuelles

### Qu'est-ce que c'est ?

Les fichiers dans `.claude/rules/` sont des **règles complémentaires** au CLAUDE.md, auto-chargées avec la même priorité. Ils permettent de découper les instructions par domaine.

### Fonctionnement

- Tous les fichiers `.md` dans `.claude/rules/` sont automatiquement chargés
- Pas besoin d'imports — juste déposer le fichier
- Ils peuvent être **path-scoped** : ne se chargent que quand Claude travaille dans un sous-dossier spécifique

### Exemple

```markdown
# .claude/rules/api-conventions.md

## Conventions API REST
- Toujours utiliser des noms de ressources au pluriel : /users, /orders
- Utiliser les codes HTTP standards : 200, 201, 400, 404, 500
- Paginer les listes avec ?page=1&limit=20
- Toujours retourner un objet { data, meta, errors }
```

```markdown
# .claude/rules/testing.md

## Conventions de test
- Framework : Vitest
- Fichiers de test : *.test.ts à côté du fichier source
- Minimum 80% de couverture
- Toujours mocker les appels HTTP externes
- Commande : npm test -- --filter [nom]
```

---

## 4. Skills — Expertise auto-chargée

### Qu'est-ce que c'est ?

Les Skills sont des **dossiers contenant des instructions, scripts et ressources** que Claude découvre et charge **dynamiquement** quand la conversation correspond à leur description. Ce sont des "manuels d'expertise" spécialisés.

### Fonctionnement : Progressive Disclosure

```
1. Claude scanne les métadonnées (nom + description) de tous les Skills
2. Si un Skill matche le contexte de la conversation → charge les instructions complètes
3. Si le Skill inclut des fichiers exécutables ou de référence → charge seulement si nécessaire
```

Ce mécanisme permet d'avoir **beaucoup de Skills** sans surcharger le contexte.

### Emplacement

```
.claude/skills/          → Skills du projet (partagés avec l'équipe)
~/.claude/skills/        → Skills personnels (tous les projets)
```

### Structure d'un Skill

```markdown
# .claude/skills/deploy/deploy.md
---
name: deployment-guide
description: Guide de déploiement vers staging et production
---

## Processus de déploiement

### Staging
1. Vérifie que tous les tests passent : `npm test`
2. Build le projet : `npm run build`
3. Déploie : `npm run deploy:staging`
4. Vérifie les smoke tests : `npm run test:smoke`

### Production
1. Crée un tag de release : `git tag v$(date +%Y%m%d)`
2. Déploie : `npm run deploy:prod`
3. Monitore les métriques pendant 15 minutes
4. En cas de problème : `npm run rollback`
```

### Skills avec fichiers de support

```
.claude/skills/
  └── code-review/
      ├── code-review.md          # Instructions principales
      ├── checklist.md             # Checklist de review
      └── examples/
          ├── good-review.md       # Exemple de bonne review
          └── bad-review.md        # Exemple de mauvaise review
```

### Skills invocables manuellement

Les Skills peuvent aussi être déclenchés manuellement comme des slash commands. Un fichier dans `.claude/skills/` avec le bon format peut être invoqué avec `/nom-du-skill`.

### Différence avec CLAUDE.md et Rules

| | CLAUDE.md | Rules | Skills |
|---|---|---|---|
| Chargement | Toujours | Toujours | **Seulement si pertinent** |
| Scope | Tout le projet | Path-scoped possible | Par matching de description |
| Objectif | Instructions générales | Règles par domaine | Expertise spécialisée |
| Fichiers support | Non | Non | **Oui** (dossier complet) |

---

## 5. Slash Commands — Actions manuelles

### Qu'est-ce que c'est ?

Les Slash Commands sont des **raccourcis** que tu tapes dans le chat, commençant par `/`, pour exécuter des tâches prédéfinies. Contrairement aux Skills, ils ne se déclenchent **que manuellement**.

### Emplacement

```
.claude/commands/        → Commandes du projet
~/.claude/commands/      → Commandes personnelles (tous les projets)
```

### Créer une commande

```markdown
# .claude/commands/test.md

Lance les tests unitaires pour le fichier ou module spécifié.

Si aucun argument n'est donné, lance tous les tests.

```bash
npm test -- --filter $ARGUMENTS
```

Analyse les résultats et :
1. Résume les tests qui passent et échouent
2. Pour chaque échec, explique la cause probable
3. Propose un correctif
```

### Utilisation

```bash
/test src/services/auth    # Lance les tests du module auth
/test                       # Lance tous les tests
```

### Variable `$ARGUMENTS`

Le placeholder `$ARGUMENTS` est remplacé par tout ce que tu tapes après le nom de la commande.

### Bonnes pratiques

- Être **directif**, pas conversationnel : "Analyse le code" plutôt que "Pourrais-tu analyser..."
- Utiliser des verbes impératifs : "Review", "Write", "Create", "Deploy"
- Garder les commandes focalisées sur **une seule tâche**

### Commands vs Skills

| | Slash Commands | Skills |
|---|---|---|
| Déclenchement | **Manuel** (`/nom`) | **Automatique** (matching) |
| Arguments | Oui (`$ARGUMENTS`) | Non |
| Fichiers support | Non (fichier unique) | Oui (dossier) |
| Recommandation | Actions explicites | Contexte automatique |

> **Note** : Anthropic recommande désormais les Skills plutôt que les Commands car ils supportent plus de fonctionnalités. Les commands dans `.claude/commands/` fonctionnent toujours.

---

## 6. Subagents — Agents spécialisés

### Qu'est-ce que c'est ?

Les Subagents sont des **assistants IA spécialisés** qui tournent dans leur **propre contexte isolé** avec un prompt système personnalisé, des outils restreints et des permissions indépendantes.

### Pourquoi les utiliser ?

- **Préserver le contexte** : les résultats volumineux ne polluent pas la conversation principale
- **Restreindre les outils** : un agent de review n'a pas besoin d'écrire des fichiers
- **Spécialiser le comportement** : prompt système focalisé sur un domaine
- **Réutiliser** : partagés entre projets via `~/.claude/agents/`

### Emplacement

```
.claude/agents/          → Agents du projet (partagés avec l'équipe)
~/.claude/agents/        → Agents personnels (tous les projets)
```

### Structure d'un Subagent

```markdown
# .claude/agents/reviewer.md
---
name: code-reviewer
description: Revue de code focalisée sur la qualité et la sécurité
model: sonnet                    # Modèle à utiliser (optionnel)
tools:                           # Outils autorisés (optionnel)
  - Read
  - Glob
  - Grep
permissions:                     # Permissions (optionnel)
  allow:
    - Read
    - Glob
  deny:
    - Write
    - Bash
---

Tu es un revieweur de code expert. Pour chaque fichier :

1. Vérifie les vulnérabilités OWASP top 10
2. Identifie le code mort
3. Vérifie la gestion d'erreurs
4. Suggère des simplifications

Format de sortie :
- **Fichier** : chemin
- **Sévérité** : critique / warning / info
- **Problème** : description
- **Suggestion** : correction proposée
```

### Exemple : Agent de recherche

```markdown
# .claude/agents/researcher.md
---
name: codebase-researcher
description: Recherche approfondie dans le codebase pour répondre à des questions d'architecture
model: opus
tools:
  - Read
  - Glob
  - Grep
  - Bash(find)
  - Bash(wc)
---

Tu es un chercheur de codebase expert. Quand on te pose une question :

1. Explore le codebase en profondeur
2. Lis les fichiers pertinents
3. Trace les dépendances et les flux de données
4. Réponds avec des références précises (fichier:ligne)
5. Fournis un résumé structuré de tes découvertes
```

### Déclenchement

Les subagents se déclenchent de **deux façons** :
- **Automatiquement** : Claude détecte que la tâche correspond à la `description` du subagent
- **Manuellement** : via la commande `/agents` ou en le référençant explicitement

### Frontmatter complet disponible

```yaml
---
name: nom-de-l-agent
description: Description utilisée pour le matching automatique
model: sonnet | opus | haiku     # Modèle (optionnel)
tools:                           # Liste des outils autorisés
  - Read
  - Write
  - Bash(commande)
permissions:
  allow: [...]
  deny: [...]
memory: true | false             # Accès à la mémoire persistante
hooks:                           # Hooks spécifiques à cet agent
  on_tool_call: [...]
---
```

---

## 7. Hooks — Actions déterministes

### Qu'est-ce que c'est ?

Un Hook est un **script shell** qui s'exécute automatiquement à un point précis du workflow de Claude Code. Il ne demande pas à Claude de faire quelque chose — il le **fait**, à chaque fois, sans exception. C'est **déterministe**.

### Pourquoi les utiliser ?

- Formater automatiquement chaque fichier écrit
- Lancer les tests à chaque modification
- Bloquer l'accès à certains fichiers
- Logger les actions
- Envoyer des notifications

### Configuration

Les hooks sont configurés dans `settings.json` :

```json
// .claude/settings.json (projet) ou ~/.claude/settings.json (global)
{
  "hooks": {
    "on_tool_call": [
      {
        "matcher": "Write",
        "command": "echo 'Fichier écrit'"
      }
    ],
    "on_tool_result": [
      {
        "matcher": "Bash",
        "command": "notify-send 'Commande terminée'"
      }
    ]
  }
}
```

### Les 3 parties d'un Hook

| Partie | Description | Exemple |
|--------|-------------|---------|
| **Event** | Quand le hook se déclenche | `on_tool_call`, `on_tool_result`, `on_session_start` |
| **Matcher** | Quel outil déclenche le hook | `Write`, `Bash`, `Edit`, ou n'importe quel outil |
| **Command** | Le script shell à exécuter | `npx prettier --write $FILE_PATH` |

### Événements disponibles (17 au total)

Les événements couvrent le cycle de vie complet :

| Catégorie | Événements |
|-----------|-----------|
| **Session** | `on_session_start`, `on_session_end` |
| **Outils** | `on_tool_call`, `on_tool_result` |
| **Agents** | `on_agent_start`, `on_agent_stop` |
| **Notifications** | `on_notification` |

### Exemples pratiques

#### Auto-format à chaque écriture
```json
{
  "hooks": {
    "on_tool_result": [
      {
        "matcher": "Write",
        "command": "npx prettier --write $FILE_PATH"
      }
    ]
  }
}
```

#### Bloquer l'accès aux fichiers sensibles
```json
{
  "hooks": {
    "on_tool_call": [
      {
        "matcher": "Read",
        "command": "echo $FILE_PATH | grep -q '.env' && echo 'BLOCKED: fichier sensible' && exit 1 || exit 0"
      }
    ]
  }
}
```

#### Lancer les tests après chaque modification
```json
{
  "hooks": {
    "on_tool_result": [
      {
        "matcher": "Edit",
        "command": "npm test -- --related $FILE_PATH 2>&1 | tail -5"
      }
    ]
  }
}
```

### Hooks dans les Subagents

Les hooks peuvent aussi être définis dans le frontmatter d'un subagent — ils ne s'exécutent que lorsque cet agent est actif.

---

## 8. Agent Teams — Multi-agents coordonnés

### Qu'est-ce que c'est ?

Les Agent Teams coordonnent **plusieurs instances de Claude Code** travaillant en parallèle, avec des tâches partagées, de la messagerie inter-agents et une gestion centralisée.

### Activation

```bash
# Variable d'environnement
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# Ou dans settings.json
{
  "experiments": {
    "agentTeams": true
  }
}
```

### Architecture

```
Leader (toi ou un agent principal)
  ├── Teammate 1 : Implémente le backend
  │   └── Contexte isolé, outils complets
  ├── Teammate 2 : Implémente le frontend
  │   └── Contexte isolé, outils complets
  ├── Teammate 3 : Écrit les tests
  │   └── Contexte isolé, outils complets
  └── Coordination via :
      ├── Task List partagée (avec dépendances)
      ├── Inboxes JSON (messagerie inter-agents)
      └── File Locking (évite les conflits)
```

### Composants clés

| Composant | Rôle |
|-----------|------|
| **Leader** | Crée l'équipe, assigne les tâches, synthétise les résultats |
| **Teammates** | Exécutent dans leur propre contexte, communiquent entre eux |
| **Task List** | File d'attente partagée avec dépendances et statuts |
| **Inboxes** | Fichiers JSON pour la messagerie inter-agents |
| **File Locking** | Évite les race conditions quand plusieurs agents écrivent |

### Cycle de vie d'un teammate

```
Teammate spawné → Reçoit une tâche → Exécute →
  → Tâche terminée → Prend la prochaine tâche non assignée →
  → Plus de tâches → Se met en veille
```

### Cas d'usage optimaux

| Cas | Description |
|-----|-------------|
| **Recherche parallèle** | Plusieurs teammates investigent différents aspects |
| **Nouveaux modules** | Chaque teammate implémente un module séparé |
| **Debug par hypothèses** | Chaque teammate teste une théorie différente |
| **Cross-layer** | Frontend + Backend + Tests en parallèle |

### Recommandations

- **3-5 teammates** maximum pour un bon équilibre parallélisme / coordination
- Coûte **~3-4x** plus de tokens qu'une session séquentielle
- Les **gains de temps** compensent largement sur les tâches complexes
- Performance : Opus leader + Sonnet teammates = **+90.2%** vs Opus seul (benchmarks internes Anthropic)

### Limites connues

- Limitations autour de la reprise de session
- Coordination parfois imparfaite
- Comportement de shutdown non garanti

---

## 9. MCP Servers — Outils externes

### Qu'est-ce que c'est ?

Le **Model Context Protocol (MCP)** est un standard open-source qui permet de connecter Claude Code à des outils externes, bases de données et APIs via un protocole unifié.

### Fonctionnement

```
Claude Code (client MCP)
  ├── MCP Server PostgreSQL → requêtes BDD
  ├── MCP Server GitHub → issues, PRs, commits
  ├── MCP Server Slack → messages, channels
  ├── MCP Server Google Calendar → événements
  └── MCP Server Linear → tickets, boards
```

### Configuration

```json
// .claude/settings.json ou ~/.claude/settings.json
{
  "mcpServers": {
    "nom-du-serveur": {
      "command": "npx",
      "args": ["-y", "package-mcp-server"],
      "env": {
        "API_KEY": "..."
      }
    }
  }
}
```

### 3 types de transport

| Transport | Usage | Exemple |
|-----------|-------|---------|
| **Stdio** | Processus local | BDD, filesystem, outils CLI |
| **HTTP** | Serveur distant | APIs cloud, services SaaS |
| **SSE** | Streaming temps réel | Notifications, événements |

### Scopes de configuration

| Scope | Fichier | Priorité |
|-------|---------|----------|
| **Local** | `.claude/settings.local.json` | Haute (override) |
| **Projet** | `.claude/settings.json` | Moyenne |
| **User** | `~/.claude/settings.json` | Basse |

En cas de conflit de nom, le scope local gagne.

### Connecteurs disponibles (2026)

**Services de développement :**
- GitHub, GitLab, Bitbucket
- Jira, Linear, Asana
- PostgreSQL, MySQL, MongoDB, Redis

**Services de communication :**
- Slack, Discord, Microsoft Teams
- Gmail, Google Calendar

**Services business :**
- Google Drive, Notion, Confluence
- DocuSign, Salesforce, HubSpot
- WordPress, Shopify

**Outils IA/Dev :**
- Navigateur (Puppeteer/Playwright)
- Docker, Kubernetes
- AWS, GCP, Azure

### Optimisation du contexte : Tool Search

Quand les définitions d'outils MCP dépassent 10% de la fenêtre de contexte, Claude active automatiquement le **Tool Search** :
- Charge dynamiquement seulement les outils nécessaires
- Réduction de **~72 000 tokens → ~8 700 tokens** (85% de réduction)

### Exemples de configuration courants

#### PostgreSQL
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}
```

#### GitHub
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_..."
      }
    }
  }
}
```

#### Slack
```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-..."
      }
    }
  }
}
```

#### Google Calendar
```json
{
  "mcpServers": {
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "google-calendar-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "...",
        "GOOGLE_CLIENT_SECRET": "...",
        "GOOGLE_REFRESH_TOKEN": "..."
      }
    }
  }
}
```

#### Linear
```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "linear-mcp-server"],
      "env": {
        "LINEAR_API_KEY": "lin_api_..."
      }
    }
  }
}
```

---

## 10. Plugins Marketplace

### Qu'est-ce que c'est ?

Les Plugins sont des **extensions installables** depuis des marketplaces qui ajoutent des commandes, agents et capacités à Claude Code.

### Commandes

```bash
# Lister les marketplaces disponibles
/plugin marketplace list

# Chercher un plugin
/plugin search <terme>

# Installer un plugin
/plugin install <nom>
```

### Écosystème (2026)

- **834+ plugins** disponibles
- **43+ marketplaces** (dont le marketplace officiel Anthropic)
- Catégories : DevOps, documentation, gestion de projet, business workflows

### Marketplace officiel

Le marketplace `claude-plugins-official` (Anthropic) est automatiquement disponible à l'installation de Claude Code.

### Plugins d'entreprise

Les entreprises peuvent créer des **marketplaces privées** avec contrôle sur les plugins, connecteurs et skills autorisés.

### Portabilité

Les plugins sont de simples systèmes de fichiers portables qui fonctionnent avec Claude Code, Cowork, et tout ce qui est construit sur le Claude Agent SDK.

---

## 11. Scheduled Tasks — Tâches planifiées

### Qu'est-ce que c'est ?

Les Scheduled Tasks permettent de programmer des prompts qui s'exécutent **automatiquement à intervalles réguliers**. Tu définis le travail une seule fois, Claude gère le timing.

### Les 2 types de scheduling

| Type | Outil | Persistance | Durée de vie |
|------|-------|-------------|-------------|
| **CLI (session)** | `/loop` + `CronCreate` | Non — meurt avec la session | Expire après **3 jours** |
| **Desktop (persistent)** | Interface graphique | Oui — survit aux redémarrages | Tant que l'app est ouverte |

### `/loop` — Scheduling rapide en CLI

#### Syntaxe
```bash
/loop <intervalle> <prompt>
```

#### Exemples
```bash
# Vérifier un déploiement toutes les 5 minutes
/loop 5m check if the deployment finished and tell me what happened

# Surveiller les erreurs toutes les 30 minutes
/loop 30m check error logs in /var/log/app.log and summarize new errors

# Vérifier l'état d'une PR toutes les 10 minutes
/loop 10m check the status of PR #42 and notify me when CI passes

# Monitoring BDD toutes les heures
/loop 1h run SELECT count(*) FROM orders WHERE created_at > now() - interval '1 hour'
```

#### Intervalles supportés

| Unité | Signification | Note |
|-------|---------------|------|
| `s` | Secondes | Arrondi à 1 min minimum (granularité cron) |
| `m` | Minutes | `/loop 5m ...` |
| `h` | Heures | `/loop 2h ...` |
| `d` | Jours | `/loop 1d ...` |

#### Mécanisme interne

```
/loop 5m vérifie les logs
       ↓
Claude parse l'intervalle → expression cron "*/5 * * * *"
       ↓
CronCreate(cron="*/5 * * * *", prompt="vérifie les logs")
       ↓
Confirmation : "Job #abc123 créé, exécution toutes les 5 minutes"
       ↓
Toutes les 5 min : Claude exécute le prompt automatiquement
```

#### Outils natifs sous-jacents

| Outil | Rôle |
|-------|------|
| **CronCreate** | Crée un job cron avec expression + prompt |
| **CronList** | Liste les jobs programmés actifs |
| **CronDelete** | Supprime un job par son ID |

#### Comportements importants

- **Claude occupé** : le prompt attend que le tour actuel finisse
- **Jobs manqués** : un seul rattrapage, pas un par intervalle manqué
- **Timezone** : heure locale, pas UTC
- **Expiration** : auto-suppression après **3 jours**
- **Pas de persistance** : redémarrer Claude Code efface tous les jobs

### Desktop Scheduled Tasks — Persistantes

#### Création conversationnelle
Ouvre Claude Desktop et dis :
> "Crée une tâche planifiée qui s'exécute à 9h du lundi au vendredi pour faire une revue de code."

#### Création via interface
1. Cliquer **"Scheduled"** dans la barre latérale
2. Cliquer **"New task"**
3. Remplir : nom, description, prompt, fréquence, modèle, dossier

#### Stockage des tâches
```
~/.claude/scheduled-tasks/<task-name>/SKILL.md
```

Format :
```markdown
---
name: daily-code-review
description: Revue de code quotidienne du projet
---

Analyse les commits des dernières 24h.
Pour chaque commit :
1. Vérifie les vulnérabilités de sécurité
2. Identifie le code mort ajouté
3. Vérifie la couverture de tests
4. Crée un résumé dans /reports/daily-review-{date}.md
```

#### Capacités de chaque exécution

Chaque exécution est une **session Claude Code complète** avec accès à :
- Tous les fichiers du projet
- Les MCP Servers configurés
- Les Skills et Plugins
- Git (branches, commits, PRs)
- Les connecteurs (Slack, email...)

#### Contraintes Desktop

- Ne tourne que si le **PC est allumé** et **l'app ouverte**
- Si le PC dort au moment prévu → s'exécute au **réveil** (une seule fois)
- Chaque exécution consomme des **tokens**

### Alternative : Cron système + CLI

```bash
# crontab -e
0 9 * * 1-5 cd /path/to/project && claude --print "Fais ta revue de code quotidienne"
```

### Alternative : GitHub Actions (sans machine)

```yaml
# .github/workflows/daily-task.yml
name: Daily Task
on:
  schedule:
    - cron: '0 7 * * 1-5'  # 7h UTC du lundi au vendredi

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Claude
        run: npx claude-code --print "Ton prompt ici"
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Cas d'usage courants

| Cas d'usage | Fréquence | Outil recommandé |
|-------------|-----------|-----------------|
| Vérifier un déploiement | Toutes les 5 min | `/loop` |
| Revue de code matinale | Tous les jours 9h | Desktop Task |
| Rapport hebdo | Lundi 8h | Desktop Task ou GitHub Actions |
| Surveillance CI/CD | Toutes les 15 min | `/loop` ou cron |
| Veille sécurité dépendances | Tous les jours | GitHub Actions |
| Plan du jour au manager | Lun-Ven 7h | Desktop Task ou cron |

---

## 12. Settings.json — Contrôle et permissions

### Qu'est-ce que c'est ?

Le fichier `settings.json` contrôle les **permissions, variables d'environnement et comportements** de Claude Code de manière programmatique.

### Emplacements

| Fichier | Scope | Partagé avec l'équipe |
|---------|-------|----------------------|
| `~/.claude/settings.json` | Global (tous projets) | Non |
| `~/.claude/settings.local.json` | Global personnel | Non |
| `.claude/settings.json` | Projet | **Oui** (versionné) |
| `.claude/settings.local.json` | Projet personnel | Non |

### Structure

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(npm test)",
      "Bash(npm run lint)",
      "Bash(npm run build)",
      "WebFetch(domain:docs.anthropic.com)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Read(.env)",
      "Read(*.pem)"
    ],
    "defaultMode": "default"
  },
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "true"
  },
  "mcpServers": { ... },
  "hooks": { ... }
}
```

### Modes de permission

| Mode | Comportement |
|------|-------------|
| `default` | Demande permission au premier usage de chaque outil |
| `acceptEdits` | Accepte automatiquement les éditions de fichiers |

### Syntaxe des permissions

- `"Read"` : autorise/bloque l'outil Read globalement
- `"Bash(npm test)"` : autorise/bloque une commande Bash spécifique
- `"WebFetch(domain:example.com)"` : autorise un domaine spécifique
- `"Read(.env)"` : bloque la lecture d'un fichier spécifique (syntaxe gitignore)

---

## 13. System Prompt — Prompt engineering

### Structure optimale pour l'API/Projects

```xml
<role>
Tu es un [rôle précis] spécialisé en [domaine].
</role>

<instructions>
- Instruction explicite 1
- Instruction explicite 2
- Quand [situation], fais [action]
</instructions>

<constraints>
- Ne fais JAMAIS [X]
- Limite-toi à [Y]
- En cas d'incertitude, [comportement]
</constraints>

<output_format>
- Format attendu (JSON, Markdown, tableau...)
- Longueur attendue
- Langue
</output_format>

<examples>
<example>
  <input>Exemple d'entrée</input>
  <output>Exemple de sortie idéale</output>
</example>
</examples>
```

### Principes clés

| Principe | Explication |
|----------|-------------|
| **Explicite** | "Écris en phrases courtes, ton confidentiel, sans jargon" plutôt que "Sois professionnel" |
| **Balises XML** | Créent des frontières sémantiques que Claude interprète structurellement |
| **2-3 exemples** | Améliorent la cohérence plus qu'un paragraphe d'instructions |
| **Pas d'inférence** | Traiter Claude comme un employé brillant mais nouveau |

### Techniques avancées

#### Chain of Thought
```
Analyse ce bug en suivant ces étapes :
1. Identifie la cause racine
2. Liste les fichiers impactés
3. Propose un correctif minimal
4. Évalue les effets de bord
```

#### Prompt Chaining
```
Étape 1 : "Analyse le cahier des charges et liste les fonctionnalités"
     ↓ (résultat injecté)
Étape 2 : "Pour chaque fonctionnalité, crée des user stories"
     ↓
Étape 3 : "Pour chaque story, écris les critères d'acceptation"
```

#### Multishot Prompting
```xml
<examples>
  <example>
    <input>Créer un utilisateur</input>
    <output>POST /api/users — Body: { name, email } — Response: 201</output>
  </example>
  <example>
    <input>Supprimer un utilisateur</input>
    <output>DELETE /api/users/:id — Response: 204</output>
  </example>
</examples>

Maintenant fais la même chose pour : Modifier un utilisateur
```

---

## 14. Extended & Adaptive Thinking

### Modes de réflexion

| Mode | Description | Quand l'utiliser |
|------|-------------|------------------|
| **Standard** | Raisonnement normal | Tâches simples et directes |
| **Extended Thinking** | Budget de tokens fixe (min 1024) | Problèmes complexes bien définis |
| **Adaptive Thinking** | Claude décide dynamiquement | **Recommandé** — workflows agentiques |

### Extended Thinking

```json
// API
{
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  }
}
```

- `budget_tokens` : max de tokens pour la réflexion interne
- Minimum : 1 024 tokens
- Au-delà de 32k : rendements décroissants
- Claude peut ne pas utiliser tout le budget

### Adaptive Thinking (recommandé)

- Claude **décide lui-même** quand et combien réfléchir
- Surpasse le budget fixe sur les tâches bimodales
- Idéal pour les **workflows agentiques** de longue durée
- Disponible sur Claude Opus 4.6 et Sonnet 4.6

---

## 15. Workflows — Pipelines orchestrés

### Qu'est-ce que c'est ?

Un workflow n'est **pas un fichier de config unique** — c'est une **combinaison orchestrée** de skills, subagents, hooks et commands qui forment un pipeline de travail multi-étapes.

> Un workflow = une séquence structurée d'actions (automatiques ou déléguées) qui transforme un input en output, en passant par plusieurs étapes coordonnées.

### Les 3 types de workflows

#### a) Workflows manuels (Common Workflows)

Patterns d'utilisation documentés par Anthropic :

| Workflow | Prompt exemple |
|----------|---------------|
| Explorer du code | "Explique-moi le système d'auth" |
| Debugger | "Ce test échoue, trouve pourquoi et corrige" |
| Refactorer | "Migre ce composant vers des hooks React" |
| Écrire des tests | "Ajoute des tests pour le service de paiement" |
| Créer une PR | "Crée une PR avec les changements actuels" |

#### b) Workflows automatisés (combinaison de mécanismes)

```
Exemple : Workflow "qualité automatique"

Hook (on_tool_result, matcher: Write)
  → Formatter automatiquement chaque fichier écrit
  → Lancer les tests liés au fichier modifié
  → Bloquer si le linter échoue

Skill (testing-guide)
  → Claude sait écrire les tests du projet

Command (/review)
  → Lance un subagent de review de code isolé
```

#### c) Workflows multi-agents (Agent Teams)

```
Leader
  ├── Teammate 1 : Backend
  ├── Teammate 2 : Frontend
  ├── Teammate 3 : Tests
  └── Sync via Task List + Inboxes
```

---

## 16. Cas pratique : Plan du jour automatique

### Objectif

Chaque matin à 7h (lun-ven), Claude :
1. Consulte ton Google Calendar
2. Consulte ton board Linear
3. Rédige ton plan de journée
4. Envoie un message à ton patron sur Slack

### Prérequis

| Service | Clé nécessaire | Où la récupérer |
|---------|---------------|-----------------|
| Google Calendar | OAuth Client ID + Secret + Refresh Token | [Google Cloud Console](https://console.cloud.google.com) → APIs → Calendar API |
| Linear | API Key | Linear → Settings → API → Personal API Key |
| Slack | Bot Token (`xoxb-...`) | [api.slack.com/apps](https://api.slack.com) → Create App → Bot Token (permission `chat:write`) |

### Étape 1 — Configurer les MCP Servers

```json
// ~/.claude/settings.json
{
  "mcpServers": {
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "google-calendar-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "ton-client-id",
        "GOOGLE_CLIENT_SECRET": "ton-client-secret",
        "GOOGLE_REFRESH_TOKEN": "ton-refresh-token"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "linear-mcp-server"],
      "env": {
        "LINEAR_API_KEY": "lin_api_..."
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-..."
      }
    }
  }
}
```

### Étape 2 — Créer la Scheduled Task

#### Option A — Claude Desktop (le plus simple)

Dis à Claude :
> "Crée une tâche planifiée qui s'exécute à 7h du lundi au vendredi."

#### Option B — Fichier manuel

```bash
mkdir -p ~/.claude/scheduled-tasks/daily-plan
```

```markdown
# ~/.claude/scheduled-tasks/daily-plan/SKILL.md
---
name: daily-plan-to-manager
description: Plan du jour envoyé au manager chaque matin en semaine
---

Exécute les étapes suivantes dans l'ordre :

## 1. Agenda du jour
Utilise Google Calendar pour récupérer tous mes événements d'aujourd'hui.
Note les réunions, leurs horaires et participants.

## 2. Tickets Linear
Consulte mon board Linear et liste :
- Mes tickets "In Progress"
- Mes tickets "To Do" priorisés pour aujourd'hui
- Les tickets bloqués et pourquoi

## 3. Rédiger le plan
Rédige un message structuré :

---
Bonjour [Manager],

Voici mon plan pour aujourd'hui ([date]) :

**Réunions :**
- [heure] — [réunion] avec [participants]

**Priorités du jour :**
1. [Ticket-ID] — [description] (statut: en cours)
2. [Ticket-ID] — [description] (statut: à faire)

**Bloquants éventuels :**
- [Bloquant ou "Aucun"]

Bonne journée !
---

## 4. Envoyer sur Slack
Envoie ce message à @manager dans le channel #daily-standup sur Slack.
```

#### Option C — Cron système

```bash
# crontab -e
0 7 * * 1-5 cd /home/herimalala/Organization/DASN/Orchestral && claude --print "$(cat ~/.claude/scheduled-tasks/daily-plan/SKILL.md)"
```

#### Option D — GitHub Actions (sans PC allumé)

```yaml
# .github/workflows/daily-plan.yml
name: Daily Plan to Manager
on:
  schedule:
    - cron: '0 4 * * 1-5'  # 4h UTC = 7h Madagascar (UTC+3)

jobs:
  send-plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate and send daily plan
        run: |
          npx claude-code --print "$(cat ~/.claude/scheduled-tasks/daily-plan/SKILL.md)"
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Étape 3 — Tester manuellement d'abord

Dans Claude Code, tape :

```
Consulte mon Google Calendar pour aujourd'hui,
puis mes tickets Linear assignés,
puis rédige mon plan de journée
et envoie-le sur Slack à @manager dans #daily-standup.
```

Si ça marche en manuel → la tâche planifiée marchera aussi.

### Comparaison des options de scheduling

| Option | Persistant | Sans PC allumé | Difficulté |
|--------|-----------|---------------|------------|
| Desktop Scheduled Task | Oui | Non | Facile |
| Cron système + CLI | Oui | Non | Moyen |
| GitHub Actions | Oui | **Oui** | Moyen |

---

## 17. Arbre de décision : quel mécanisme utiliser ?

```
Quel est ton besoin ?
│
├── Instructions permanentes pour le projet ?
│   ├── Générales → CLAUDE.md
│   ├── Par sous-dossier → .claude/rules/
│   └── Par domaine expert → .claude/skills/
│
├── Action à la demande ?
│   └── Slash Command (.claude/commands/)
│
├── Action automatique déterministe ?
│   └── Hook (settings.json)
│
├── Tâche lourde avec contexte isolé ?
│   └── Subagent (.claude/agents/)
│
├── Travail parallèle sur gros projet ?
│   └── Agent Teams
│
├── Connexion à un service externe ?
│   ├── Service standard → MCP Server
│   └── Extension communautaire → Plugin marketplace
│
├── Tâche récurrente ?
│   ├── Ponctuelle (< 3 jours) → /loop
│   ├── Persistante (PC allumé) → Desktop Scheduled Task
│   └── Sans PC → GitHub Actions + cron
│
└── Contrôler les permissions ?
    └── settings.json (allow/deny/ask)
```

---

## 18. Structure de fichiers recommandée

```
projet/
├── CLAUDE.md                          # Instructions projet (< 80 lignes)
├── .claude/
│   ├── settings.json                  # Permissions, MCP, hooks (versionné)
│   ├── settings.local.json            # Permissions locales (non versionné)
│   ├── rules/
│   │   ├── api-conventions.md         # Conventions API
│   │   ├── testing.md                 # Règles de test
│   │   └── security.md               # Règles de sécurité
│   ├── skills/
│   │   ├── code-review/
│   │   │   ├── code-review.md         # Skill de review
│   │   │   └── checklist.md           # Checklist associée
│   │   └── deploy/
│   │       └── deploy.md              # Skill de déploiement
│   ├── agents/
│   │   ├── reviewer.md                # Agent de review (contexte isolé)
│   │   └── researcher.md             # Agent de recherche
│   └── commands/
│       ├── test.md                    # /test
│       └── deploy.md                  # /deploy
│
~/.claude/
├── CLAUDE.md                          # Instructions globales
├── settings.json                      # Permissions globales, MCP servers
├── agents/                            # Agents personnels (tous projets)
├── commands/                          # Commandes personnelles
├── skills/                            # Skills personnels
└── scheduled-tasks/
    └── daily-plan/
        └── SKILL.md                   # Tâche planifiée
```

---

## 19. Sources

### Documentation officielle
- [Common Workflows - Claude Code Docs](https://code.claude.com/docs/en/common-workflows)
- [Agent Teams - Claude Code Docs](https://code.claude.com/docs/en/agent-teams)
- [Create Custom Subagents - Claude Code Docs](https://code.claude.com/docs/en/sub-agents)
- [MCP Integration - Claude Code Docs](https://code.claude.com/docs/en/mcp)
- [Claude Code Settings - Docs](https://code.claude.com/docs/en/settings)
- [Slash Commands - Claude Code Docs](https://code.claude.com/docs/en/slash-commands)
- [Run Prompts on a Schedule - Claude Code Docs](https://code.claude.com/docs/en/scheduled-tasks)
- [Discover Plugins - Claude Code Docs](https://code.claude.com/docs/en/discover-plugins)
- [Prompting Best Practices - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [System Prompts - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/system-prompts)
- [Chain of Thought - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/chain-of-thought)
- [Prompt Chaining - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/chain-prompts)
- [Extended Thinking - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Adaptive Thinking - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)

### Blog et guides officiels
- [Using CLAUDE.md Files - Claude Blog](https://claude.com/blog/using-claude-md-files)
- [Skills Explained - Claude Blog](https://claude.com/blog/skills-explained)
- [Claude Code Plugins - Claude Blog](https://claude.com/blog/claude-code-plugins)
- [Schedule Recurring Tasks in Cowork - Claude Help Center](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-cowork)

### Guides communautaires
- [Writing a Good CLAUDE.md - HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [How to Write a Good CLAUDE.md - Builder.io](https://www.builder.io/blog/claude-md-guide)
- [Claude Code Full Stack: MCP, Skills, Subagents, Hooks - alexop.dev](https://alexop.dev/posts/understanding-claude-code-full-stack/)
- [Claude Code Customization Guide - alexop.dev](https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/)
- [Agent Teams Guide - alexop.dev](https://alexop.dev/posts/from-tasks-to-swarms-agent-teams-in-claude-code/)
- [Claude Code Swarm Orchestration - GitHub Gist](https://gist.github.com/kieranklaassen/4f2aba89594a4aea4ad64d753984b2ea)
- [Skills vs Subagents - DEV Community](https://dev.to/nunc/claude-code-skills-vs-subagents-when-to-use-what-4d12)
- [Claude Code Hooks Guide 2026 - DEV Community](https://dev.to/serenitiesai/claude-code-hooks-guide-2026-automate-your-ai-coding-workflow-dde)
- [Claude Prompt Engineering Best Practices 2026](https://promptbuilder.cc/blog/claude-prompt-engineering-best-practices-2026)
- [CLAUDE.md Templates - GitHub](https://github.com/abhishekray07/claude-md-templates)
- [Put Claude on Autopilot: /loop and /schedule - Medium](https://medium.com/@richardhightower/put-claude-on-autopilot-scheduled-tasks-with-loop-and-schedule-built-in-skills-43f3be5ac1ec)
- [How Anthropic Teams Use Claude Code (PDF)](https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf)

### MCP Servers
- [Linear MCP Server - Linear Docs](https://linear.app/docs/mcp)
- [Google Calendar MCP - GitHub](https://github.com/nspady/google-calendar-mcp)
- [Slack MCP Server - Slack Docs](https://docs.slack.dev/ai/slack-mcp-server/)
- [Connect to Claude - Slack Developer Docs](https://docs.slack.dev/ai/slack-mcp-server/connect-to-claude/)
