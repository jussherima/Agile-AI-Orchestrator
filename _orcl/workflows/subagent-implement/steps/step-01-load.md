<step order="1" name="load">
  <objective>Charger le ticket et les contextes partagés (architecture, patterns, types, conventions).</objective>

  <process>
    **Input reçu (JSON) :**
    ```json
    {
      "ticket": {"id": "T-1", "title": "...", "acceptance_criteria": [...], "story_points": 3},
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

    **Actions :**
    1. Créer dossier output_dir
    2. Lire ticket : comprendre critères d'acceptation (format Gherkin: Given/When/Then)
    3. Lire architecture.md : comprendre structure, layers, boundaries
    4. Scanner patterns/ : identifier patterns applicables (repository, factory, etc.)
    5. Lire shared-types/ : types partagés à réutiliser (pas de duplication)
    6. Lire conventions.md : naming, formatting, git conventions

    **Token budget : ~2000 tokens pour lecture contextes**
    - Ne pas relire tout en détail, scanner pour références
    - Noter chemins fichiers clés pour step-02
  </process>

  <output>Contexte chargé, fichiers clés identifiés</output>

  <next>step-02-implement.md</next>
</step>