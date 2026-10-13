# /orcl/subagent/review-ticket — Subagent Review

## Usage (appelé par agent principal via Task tool)
```
Task: "subagent review-ticket"
Input: JSON (voir ci-dessous)
```

## Input JSON
```json
{
  "ticket": {
    "id": "T-1",
    "title": "Auth login email/password",
    "acceptance_criteria": [...],
    "story_points": 3
  },
  "implementation_report": "_orcl/output/parallel-execution/T-1/implementation-report.json",
  "changed_files": ["src/features/auth/services/auth.service.ts", "tests/..."],
  "shared_context": {
    "architecture": "_orcl/output/architecture/architecture.md",
    "patterns": "_orcl/output/patterns/"
  },
  "output_dir": "_orcl/output/parallel-execution/T-1/",
  "mode": "review-only"
}
```

## Workflow exécuté (7 steps)
1. **load** — Ticket + implémentation + diff + contextes (~2.5k tokens)
2. **criteria-check** — CHAQUE critère d'acceptation validé par test (~1.5k tokens)
3. **code-quality** — Clean Code, SOLID, TypeScript, Conventions (~2k tokens)
4. **architecture** — Isolation feature, coupling, patterns, shared-types (~1.5k tokens)
5. **security** — Validation, AuthZ, Secrets, XSS, Rate limiting (~1.5k tokens)
6. **tests** — Exécution + couverture + mapping critères (~1k tokens)
7. **verdict** — Décision + review-report.json

## Output : review-report.json
```json
{
  "ticket_id": "T-1",
  "verdict": "approved|changes-requested|rejected",
  "criteria_check": [
    {"criterion": "...", "pass": true, "test": "...", "evidence": "..."}
  ],
  "issues": [
    {"severity": "blocker|major|minor", "file": "...", "line": 42, "rule": "...", "message": "...", "suggestion": "..."}
  ],
  "summary": {
    "blockers": 0,
    "majors": 2,
    "minors": 3,
    "criteria_passed": 5,
    "criteria_failed": 0
  },
  "token_cost": 4200,
  "duration_ms": 90000,
  "reviewer_notes": "Bon usage pattern Repository. Attention: login() 45 lignes."
}
```

## Règles de verdict

### APPROVED
- Tous critères validés
- 0 blockers, 0 majors non justifiés
- Tests pass + couverture ≥80%
- Security clean

### CHANGES-REQUESTED
- Issues major présentes (quality, arch, coverage)
- 0 blockers
- Critères tous validés
- → Relance implement-ticket sur CE ticket

### REJECTED
- ≥1 blocker (security, AuthZ manquant, test critique échoué, cross-coupling)
- OU critères non validés (gaps)
- OU architecture fondamentalement violée
- → STOP, escalade humain

## Contraintes
- **Lit SEULEMENT le diff** (pas tout codebase)
- **Output JSON seulement** (pas de prose)
- **Timeout** : 5 min max
- **Token budget** : ~5-8k par ticket
- **Exécute tests** pour vérification réelle