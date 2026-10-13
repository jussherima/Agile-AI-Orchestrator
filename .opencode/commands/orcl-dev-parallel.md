# /orcl/dev/parallel — Implémentation Parallèle Subagents

## Usage
```
/orcl/dev/parallel [backlog-name]
```

## Description
Lance l'implémentation parallèle de tous les tickets du backlog via subagents orchestrés.

**Architecture :**
- **Agent principal (vous)** = Orchestrateur uniquement
- **Subagents `implement-ticket`** = Implémentation (parallèle, max 3-4)
- **Subagents `review-ticket`** = Review (parallèle, après implémentation)
- **Boucle** : Implémentation → Review → Corrections → Review... (max 3 itérations)
- **Vagues** : Respecte dépendances (DAG topologique)

## Prérequis
- Backlog validé dans `_orcl/output/backlogs/[name]-backlog.md`
- Architecture définie dans `_orcl/output/architecture/architecture.md`
- Patterns/conventions/types partagés disponibles

## Déroulement

### 1. Analyse dépendances (step-01)
```
→ Charge backlog
→ Extrait dépendances explicites + implicites
→ Construit DAG, détecte cycles
→ Calcule niveaux topologiques
→ Sauvegarde _orcl/output/parallel-execution/graph.json
```

### 2. Planification vagues (step-02)
```
→ Regroupe par niveau topologique
→ Optimise : max 3-4 subagents/vague
→ Priorise tickets avec plus de dépendants
→ Estime tokens par vague
→ Prépare contextes partagés (économie tokens)
→ Sauvegarde plan.json
```

### 3. Boucle principales (steps-03 à 05)
```
POUR chaque vague du plan :
  
  3a. LANCER subagents implement-ticket (PARALLÈLE)
      - Input minimal : ticket + refs contextes partagés
      - Output : commit + implementation-report.json
      - Agent principal ATTEND tous (polling 30s, timeout 10min)
  
  3b. LANCER subagents review-ticket (PARALLÈLE)
      - Input : ticket + implementation-report + diff
      - Output : review-report.json (verdict + issues)
      - Agent principal ATTEND tous
  
  3c. BOUCLE CORRECTIONS (max 3 itérations)
      SI des "changes-requested" :
        RELANCER implement-ticket SEULEMENT sur ces tickets
        RELANCER review-ticket SEULEMENT sur ces tickets
      SINON vague validée → vague suivante
  
  3d. SI des "rejected" → STOP + escalade humain
  
  3e. MAJ state.json (vague courante, tokens cumulés, tickets done)
```

### 4. Vérification finale (step-06)
```
→ Merge toutes branches sur main
→ Tests globaux (unit + integration + e2e)
→ Build + lint + typecheck
→ Vérification CHAQUE feature vs critères acceptation
→ Architecture + Security audit
→ Génère verification-report.json
SI ÉCHEC → STOP
```

### 5. Rapport final (step-07)
```
→ Métriques : temps, tokens, vagues, parallélisme, taux approval
→ Tableau par ticket : vague, itérations, tokens, verdict
→ Leçons apprises
→ Nettoyage branches + archivage
```

## Token Optimization

| Technique | Économie |
|-----------|----------|
| Contextes partagés (architecture, patterns, types) lus 1 seule fois | ~60% |
| Subagents reçoivent ONLY leur ticket + refs fichiers | ~70% |
| Output structuré JSON (pas de prose) | ~40% |
| Diff seulement pour review (pas tout codebase) | ~80% |
| Parallélisme = temps mur réduit = moins tokens overhead | ~30% |

**Budget typique** : 100k-200k tokens pour 10-15 tickets (vs 400k+ séquentiel)

## Fichiers de tracking
```
_orcl/output/parallel-execution/
├── graph.json           # DAG dépendances
├── plan.json            # Plan vagues + tokens estimés
├── state.json           # État courant (vague, tokens utilisés, done/in-progress)
├── T-1/
│   ├── implementation-report.json
│   └── review-report.json
├── T-2/
│   ├── ...
├── verification-report.json
└── FINAL_REPORT.md
```

## Commandes subagents (lancées par agent principal)

### Implémentation
```
Task: subagent implement-ticket
Input: {"ticket": {...}, "shared_context": {...}, "output_dir": "...", "mode": "implement-only"}
```

### Review
```
Task: subagent review-ticket
Input: {"ticket": {...}, "implementation_report": "...", "changed_files": [...], "shared_context": {...}, "output_dir": "...", "mode": "review-only"}
```

## Gestion erreurs

| Situation | Action |
|-----------|--------|
| Subagent timeout (10min) | Marquer bloqué, continuer autres, reporter fin |
| Subagent crash | Relancer 1x, puis marquer bloqué |
| Cycle dépendances détecté | STOP immédiat, demander clarification |
| Tokens > budget 80% | Alerte, continuer avec prudence |
| Tokens > budget 100% | STOP (sauf override explicite) |
| Review rejected | STOP vague, escalade humain |

## Exemple
```
/orcl/dev/parallel my-project-backlog
```

Lance l'orchestration complète sur le backlog `my-project-backlog`.