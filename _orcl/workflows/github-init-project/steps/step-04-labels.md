<step order="4" name="labels">
  <objective>Configurer les labels du repo pour le workflow Orchestral.</objective>

  <labels>
    Types :
    - `bug` (#d73a4a) — Anomalie identifiée
    - `feature` (#0075ca) — Nouvelle fonctionnalité
    - `technical` (#5319e7) — Dette technique / refactoring
    - `docs` (#0e8a16) — Documentation

    Priorités :
    - `critical` (#b60205) — Bloquant
    - `high` (#d93f0b) — Urgent
    - `medium` (#fbca04) — Normal
    - `low` (#c5def5) — Faible

    Tailles :
    - `size/S` (#bfdadc) — Petit (< 1 jour)
    - `size/M` (#c2e0c6) — Moyen (1-2 jours)
    - `size/L` (#fef2c0) — Grand (3-5 jours)
    - `size/XL` (#f9d0c4) — Très grand (à redécouper)
  </labels>

  <process>
    - Supprimer les labels par défaut de GitHub (bug, documentation, enhancement, etc.) pour éviter la confusion
    - Créer les labels Orchestral listés ci-dessus
    - Vérifier qu'aucun label n'est en doublon
  </process>

  <next>Passer à step-05-project.md</next>
</step>
