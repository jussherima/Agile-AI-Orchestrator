<workflow>
  <metadata>
    <name>Validation des tickets</name>
    <command>/orcl/workflow/validate-tickets</command>
    <input>_orcl/output/backlogs/</input>
    <output>_orcl/output/backlogs/ (corrigé)</output>
    <prerequisite>Backlog dans _orcl/output/backlogs/</prerequisite>
    <next-workflow>/orcl/workflow/push-kanban</next-workflow>
  </metadata>

  <steps>
    <step file="steps/step-01-charger.md">Charger le backlog</step>
    <step file="steps/step-02-verifier.md">Vérifier chaque ticket</step>
    <step file="steps/step-03-corriger.md">Corriger les tickets défaillants</step>
    <step file="steps/step-04-output.md">Rapport et sauvegarde</step>
  </steps>

  <brain>brain/gestion-projet/ORCL-Rediget-Ticket.md</brain>
</workflow>
