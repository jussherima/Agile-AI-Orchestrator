<workflow>
  <metadata>
    <name>Découpage du CDC en tickets</name>
    <command>/orcl/workflow/create-tickets</command>
    <input>_orcl/output/CDC-validated.md</input>
    <output>_orcl/output/backlogs/[nom-projet]-backlog.md</output>
    <prerequisite>CDC validé dans _orcl/output/CDC-validated.md</prerequisite>
    <next-workflow>/orcl/workflow/validate-tickets</next-workflow>
  </metadata>

  <steps>
    <step file="steps/step-01-charger.md">Charger le CDC validé</step>
    <step file="steps/step-02-themes.md">Identifier les thèmes fonctionnels</step>
    <step file="steps/step-03-epics.md">Extraire les Epics</step>
    <step file="steps/step-04-stories.md">Découper en User Stories</step>
    <step file="steps/step-05-invest.md">Vérifier INVEST et redécouper</step>
    <step file="steps/step-06-rediger.md">Rédiger chaque ticket</step>
    <step file="steps/step-07-output.md">Sauvegarder et présenter</step>
  </steps>

  <gate type="human-validation">
    Avant de passer à /orcl/workflow/validate-tickets, l'utilisateur revoit le backlog.
  </gate>

  <brain>brain/gestion-projet/ORCL_TICKET_SLICE.md</brain>
</workflow>
