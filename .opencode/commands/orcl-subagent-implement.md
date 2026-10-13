# /orcl/subagent/implement-ticket — Subagent Implémentation

## Usage (appelé par agent principal via Task tool)
```
Task: "subagent implement-ticket"
Input: JSON (voir ci-dessous)
```

## Input JSON
```json
{
  "ticket": {
    "id": "T-1",
    "title": "Auth login email/password",
    "acceptance_criteria": [
      "Given user has account, When valid credentials, Then login succeeds with JWT",
      "Given user has account, When invalid credentials, Then error message shown"
    ],
    "story_points": 3,
    "dependencies": []
  },
  "shared_context": {
    "architecture": "_orcl/output/architecture/architecture.md",
    "patterns": "_orcl/output/patterns/",
    "types": "_orcl/output/shared-types/",
    "conventions": "conventions.md"
  },
  "output_dir": "_orcl/output/parallel-execution/T-1/",
  "mode": "implement-only"
}
```

## Workflow exécuté (5 steps)
1. **load** — Lire ticket + contextes partagés (scan seulement, ~2k tokens)
2. **implement** — Code feature-first, Clean Code, SOLID, Security (~5k tokens)
3. **test** — Tests unitaires + intégration mapping critères (~3k tokens)
4. **auto-review** — Checklist rapide (Clean Code, SOLID, Security, Tests, Git)
5. **commit-report** — Commit atomique + implementation-report.json

## Output : implementation-report.json
```json
{
  "ticket_id": "T-1",
  "status": "done|blocked",
  "branch": "feature/T-1-auth-login",
  "commit_sha": "abc123def",
  "files_changed": ["src/features/auth/...", "tests/..."],
  "tests": {"unit": "pass", "integration": "pass", "coverage": "87%"},
  "criteria_mapping": [
    {"criterion": "User peut se logger...", "test": "should_login_when_valid_credentials"}
  ],
  "token_cost": 8200,
  "duration_ms": 180000,
  "notes": "Utilisé pattern Repository existant"
}
```

## Contraintes
- **PAS d'accès au codebase global** — seulement diff/refs fournis
- **PAS de prose** — output JSON structuré uniquement
- **Timeout** : 10 min max
- **Token budget** : ~10-15k par ticket
- **Branche** : `feature/T-{id}-{slug}` (Conventional Commits)

## Règles non-négociables
- Clean Code : fonctions <20 lignes, noms explicites, pas magic numbers
- SOLID : SRP, OCP, LSP, ISP, DIP
- Security : validation TOUTES entrées, pas secrets, AuthZ, XSS prevention
- Tests : AAA, couverture ≥80%, mapping critères↔tests
- Commit : `feat(scope): description` + Closes #T-{id}