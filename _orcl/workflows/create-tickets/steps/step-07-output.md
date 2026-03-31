<step order="7" name="output">
  <objective>Sauvegarder le backlog et présenter le résultat.</objective>

  <process>
    - Sauvegarder dans `_orcl/_orcl/output/backlogs/[nom-projet]-backlog.md`
    - Présenter : nombre de thèmes, epics, stories créés
    - Tableau récapitulatif
  </process>

  <announce>
    "Tickets créés. Lance `/orcl/workflow/validate-tickets` pour vérifier la qualité."
  </announce>

  <self-check>
    Avant de terminer, vérifier :
    - Tous les tickets ont un titre, une user story, des critères d'acceptation
    - Tous passent INVEST
    - Aucun ticket n'est découpé horizontalement
    - Le backlog est sauvegardé dans _orcl/output/backlogs/
    - Les priorités sont assignées
  </self-check>
</step>
