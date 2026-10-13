# Orchestral — Pipeline de workflows

## Pipeline
```
/orcl/workflow/validate-cdc → [GATE] → /orcl/workflow/create-tickets → [GATE] → /orcl/workflow/validate-tickets → /orcl/workflow/push-kanban
```

## Workflows (shardés en steps)

| Workflow | Steps | Input | Output |
|----------|-------|-------|--------|
| `_orcl/workflows/validate-cdc/` | 4 steps | _orcl/client/specs/ | _orcl/output/verifications/ + CDC-validated.md |
| `_orcl/workflows/create-tickets/` | 7 steps | CDC-validated.md | _orcl/output/backlogs/ |
| `_orcl/workflows/validate-tickets/` | 4 steps | _orcl/output/backlogs/ | _orcl/output/backlogs/ (corrigé) |
| `_orcl/workflows/push-kanban/` | 5 steps | _orcl/output/backlogs/ | GitHub Issues + Project |

## Progressive Disclosure
Chaque workflow charge UN step à la fois. L'agent ne voit jamais les steps futurs.

## Gates
Entre chaque workflow, l'utilisateur valide avant de passer à l'étape suivante.
