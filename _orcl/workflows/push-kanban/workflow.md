<workflow>
  <metadata>
    <name>Push vers le Kanban GitHub</name>
    <command>/orcl/workflow/push-kanban</command>
    <input>_orcl/output/backlogs/</input>
    <output>GitHub Issues + GitHub Project</output>
    <prerequisite>Backlog validé dans _orcl/output/backlogs/ + gh authentifié</prerequisite>
  </metadata>

  <steps>
    <step file="steps/step-01-prerequis.md">Vérifier les prérequis</step>
    <step file="steps/step-02-labels.md">Créer les labels GitHub</step>
    <step file="steps/step-03-issues.md">Créer les issues GitHub</step>
    <step file="steps/step-04-project.md">Configurer le Project et distribuer</step>
    <step file="steps/step-05-output.md">Rapport final</step>
  </steps>

  <brain>brain/gestion-projet/ORCL_KANBAN.md</brain>
</workflow>
