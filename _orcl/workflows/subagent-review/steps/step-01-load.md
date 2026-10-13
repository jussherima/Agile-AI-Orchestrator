<step order="1" name="load">
  <objective>Charger ticket, rapport implémentation, diff des fichiers, contextes partagés.</objective>

  <process>
    **Input reçu (JSON) :**
    ```json
    {
      "ticket": {"id": "T-1", "title": "...", "acceptance_criteria": [...], "story_points": 3},
      "implementation_report": "_orcl/output/parallel-execution/T-1/implementation-report.json",
      "changed_files": ["src/features/auth/...", "tests/..."],
      "shared_context": {"architecture": "...", "patterns": "..."},
      "output_dir": "_orcl/output/parallel-execution/T-1/",
      "mode": "review-only"
    }
    ```

    **Actions :**
    1. Lire ticket + critères acceptation (format Gherkin)
    2. Lire implementation-report.json : branch, commit, files_changed, criteria_mapping
    3. Faire `git diff main...feature/T-1-auth-login` pour voir VRAI diff
    4. Lire fichiers changés critiques (services, hooks, components)
    5. Scanner architecture.md + patterns/ pour références

    **Token budget : ~2500 tokens**
    - Diff seulement, pas tout le codebase
    - Focus sur fichiers modifiés
  </process>

  <output>Contexte review chargé, diff analysé</output>

  <next>step-02-criteria-check.md</next>
</step>