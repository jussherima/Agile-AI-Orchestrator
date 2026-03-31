<step order="4" name="output">
  <objective>Rapport de validation et sauvegarde du backlog corrigé.</objective>

  <report>
    - Nombre de tickets validés / total
    - Liste des tickets corrigés avec les changements
    - Score global de qualité du backlog
  </report>

  <process>
    - Sauvegarder le backlog corrigé dans `_orcl/_orcl/output/backlogs/` (écraser l'ancien)
  </process>

  <announce>
    - Si tout OK : "Tous les tickets sont validés. Lance `/orcl/workflow/push-kanban`."
    - Si corrections : "X tickets corrigés. Lance `/orcl/workflow/push-kanban`."
  </announce>

  <self-check>
    Avant de terminer :
    - Tous les tickets passent la checklist
    - Le backlog corrigé est sauvegardé
    - Le rapport est présenté à l'utilisateur
  </self-check>
</step>
