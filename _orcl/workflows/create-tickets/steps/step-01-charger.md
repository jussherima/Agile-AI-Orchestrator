<step order="1" name="charger">
  <objective>Charger le CDC validé et vérifier les prérequis.</objective>

  <process>
    - Vérifier que `_orcl/_orcl/output/CDC-validated.md` existe. Sinon → "Lance d'abord `/orcl/workflow/validate-cdc`."
    - Lire le CDC validé
    - Identifier : nom du projet, type d'application, rôles utilisateurs, fonctionnalités principales
  </process>

  <output>Annoncer : "CDC chargé : [nom]. Découpage en cours..."</output>

  <next>Passer à step-02-themes.md</next>
</step>
