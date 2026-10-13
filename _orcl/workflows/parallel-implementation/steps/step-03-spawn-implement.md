<step order="3" name="spawn-implement">
  <objective>Lancer les subagents d'implémentation pour la vague courante en parallèle.</objective>

  <process>
    **Pour CHAQUE ticket de la vague courante (en PARALLÈLE) :**

    **Lancer subagent `implement-ticket` avec input minimal :**
    ```json
    {
      "ticket": { "id": "T-1", "title": "...", "acceptance_criteria": [...], "story_points": 3 },
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

    **Subagent implémentation fait :**
    1. Lit ticket + critères acceptation
    2. Lit contextes partagés (architecture, patterns, types)
    3. Implémente code (Clean Code, SOLID, sécurité)
    4. Écrit tests unitaires + intégration
    5. Auto-review rapide (checklist)
    6. Commit atomique sur branche `feature/T-1-description`
    7. Écrit rapport : `_orcl/output/parallel-execution/T-1/implementation-report.json`
       ```json
       {"status": "done|blocked", "files_changed": [...], "tests": "pass|fail", "notes": "..."}
       ```

    **Agent principal : ATTEND que TOUS subagents de la vague finissent**
    - Polling status toutes les 30s
    - Timeout par ticket = 10 min (configurable)
    - Si bloqué → marquer, continuer autres, reporter en fin

    **Token optimization :**
    - Subagents ne reçoivent PAS l'historique complet
    - Seulement leur ticket + références fichiers partagés
    - Output structuré JSON (pas de prose)
  </process>

  <output>Rapports d'implémentation pour tous tickets de la vague</output>

  <next>step-04-spawn-review.md</next>
</step>