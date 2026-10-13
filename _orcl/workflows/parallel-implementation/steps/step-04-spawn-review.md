<step order="4" name="spawn-review">
  <objective>Lancer les subagents de review pour la vague courante en parallèle.</objective>

  <process>
    **Pour CHAQUE ticket implémenté de la vague (en PARALLÈLE) :**

    **Lancer subagent `review-ticket` avec input :**
    ```json
    {
      "ticket": { "id": "T-1", "title": "...", "acceptance_criteria": [...] },
      "implementation_report": "_orcl/output/parallel-execution/T-1/implementation-report.json",
      "changed_files": ["src/...", "tests/..."],
      "shared_context": { "architecture": "...", "patterns": "..." },
      "output_dir": "_orcl/output/parallel-execution/T-1/",
      "mode": "review-only"
    }
    ```

    **Subagent review fait :**
    1. Lit ticket + critères acceptation
    2. Lit code changé (diff depuis branche)
    3. Vérifie CHAQUE critère d'acceptation (testable)
    4. Vérifie : Clean Code, SOLID, sécurité, tests, architecture
    5. Exécute tests locaux du ticket
    6. Écrit verdict : `_orcl/output/parallel-execution/T-1/review-report.json`
       ```json
       {
         "verdict": "approved|changes-requested|rejected",
         "criteria_check": [{"criterion": "...", "pass": true, "evidence": "..."}],
         "issues": [{"severity": "blocker|major|minor", "file": "...", "line": 42, "message": "..."}],
         "token_cost": 1200
       }
       ```

    **Agent principal : ATTEND tous les reviews**
    - Collecte tous les verdicts
    - Si TOUS `approved` → vague validée, passer vague suivante
    - Si DES `changes-requested` → relancer subagent implémentation SUR CE TICKET seulement (boucle)
    - Si DES `rejected` → STOP, escalader à l'humain

    **Boucle implémentation → review (max 3 itérations par ticket)**
    - Itération 1 : implémentation initiale + review
    - Itération 2 : corrections + review
    - Itération 3 : corrections finales + review → si encore rejected → STOP
  </process>

  <output>Verdicts review pour tous tickets de la vague</output>

  <next>step-05-iterate-waves.md</next>
</step>