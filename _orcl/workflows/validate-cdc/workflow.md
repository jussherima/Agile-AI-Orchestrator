<workflow>
  <metadata>
    <name>Validation du Cahier des Charges</name>
    <command>/orcl/workflow/validate-cdc</command>
    <input>_orcl/client/specs/ ou _orcl/client/APK/</input>
    <output>_orcl/output/verifications/ + _orcl/output/CDC-validated.md</output>
    <next-workflow>/orcl/workflow/create-tickets</next-workflow>
  </metadata>

  <steps>
    <step file="steps/step-01-localiser.md">Localiser le CDC</step>
    <step file="steps/step-02-analyser.md">Analyser point par point</step>
    <step file="steps/step-03-verdict.md">Produire le verdict et les questions</step>
    <step file="steps/step-04-output.md">Sauvegarder les artefacts</step>
  </steps>

  <gate type="human-validation">
    Avant de passer à /orcl/workflow/create-tickets, l'utilisateur doit confirmer que le CDC est validé.
  </gate>

  <brain>brain/gestion-projet/CDC-standart.md</brain>
</workflow>
