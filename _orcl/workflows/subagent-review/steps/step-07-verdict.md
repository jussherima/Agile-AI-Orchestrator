<step order="7" name="verdict">
  <objective>Décision finale : approved | changes-requested | rejected + rapport JSON.</objective>

  <process>
    **Règles de décision :**

    **APPROVED** (tout OK) :
    - Tous critères d'acceptation validés (step-02)
    - ZERO issues blocker
    - ZERO issues major non justifiés
    - Tests tous passent + couverture ≥ 80%
    - Security clean

    **CHANGES-REQUESTED** (corrections mineures/majeures) :
    - Issues major présentes (code quality, architecture, coverage)
    - PAS de blocker
    - Critères d'acceptation tous validés
    - → Subagent implémentation relancé sur CE ticket seulement

    **REJECTED** (problèmes fondamentaux) :
    - AU MOINS 1 issue blocker (security, authZ manquant, test critique échoué, cross-coupling)
    - OU critères d'acceptation NON validés (gaps step-02)
    - OU architecture fondamentalement violée
    - → STOP, escalade à l'humain (agent principal)

    **Générer rapport JSON** dans `output_dir/review-report.json` :
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
      "reviewer_notes": "Bon usage du pattern Repository. Attention: fonction login() trop longue (45 lignes)."
    }
    ```
  </process>

  <output>Verdict final + rapport JSON structuré</output>
</step>