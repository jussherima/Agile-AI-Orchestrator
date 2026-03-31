<step order="1" name="charger">
  <objective>Charger le backlog existant.</objective>

  <process>
    - Vérifier qu'un backlog existe dans `_orcl/_orcl/output/backlogs/`
    - Si non → "Lance d'abord `/orcl/workflow/create-tickets`."
    - Charger le backlog, compter le nombre de tickets
  </process>

  <output>Annoncer : "Backlog chargé : [X] tickets. Validation en cours..."</output>

  <next>Passer à step-02-verifier.md</next>
</step>
