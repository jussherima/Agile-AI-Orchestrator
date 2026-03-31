# ORCL — Agile AI Orchestrator

## Projet

Orchestrateur IA pour la gestion de projet agile : validation CDC, découpage en tickets, push GitHub Projects, implémentation guidée.

## Structure

```
.claude/          → Config Claude Code (agents, commands, rules, skills)
.opencode/        → Config OpenCode (agents, commands, instructions)
_orcl/            → Données projet (specs, output, backlogs)
```

## Règles

- Ne jamais générer de fichier de documentation sauf si explicitement demandé
- Les fichiers de documentation ne dépassent jamais 1000 lignes
- Signaler les fautes d'orthographe brièvement
- Évaluation des prompts mal formulés : "📊 Prompt : X/10 - [raison]"

## Passation de session

- `handoff_dir` : `_orcl/handoffs/`

## Claude Code Exports

- `export_dir` : `.claude/exports/`
