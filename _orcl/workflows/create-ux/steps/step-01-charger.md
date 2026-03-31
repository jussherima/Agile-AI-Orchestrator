<step order="1" name="charger">
  <objective>Charger tout le contexte disponible.</objective>

  <process>
    Chercher et charger dans cet ordre :
    1. `_orcl/output/CDC-validated.md` — le cahier des charges validé
    2. `_orcl/output/ux/standards-*.md` — les standards identifiés
    3. `_orcl/output/ux/patterns-ui-*.md` — les patterns UI recommandés
    4. `_orcl/output/backlogs/` — le backlog si existant

    Si aucun de ces fichiers n'existe :
    - Demander à l'utilisateur de fournir le contexte du projet
    - Minimum requis : type d'app, audience, fonctionnalités principales

    Résumer ce qui est disponible et ce qui manque.
  </process>

  <output>
    "Contexte chargé. [X] documents trouvés. Création des livrables UX en cours..."
  </output>

  <next>Passer à step-02-personas.md</next>
</step>
