<workflow>
  <metadata>
    <name>Initialisation du projet GitHub</name>
    <command>/orcl/github/init-project</command>
    <input>Nom du projet + description (fournis par l'utilisateur)</input>
    <output>Repository GitHub + GitHub Project (board Kanban)</output>
    <prerequisite>gh authentifié avec les scopes repo et project</prerequisite>
  </metadata>

  <steps>
    <step file="steps/step-01-prerequis.md">Vérifier les prérequis</step>
    <step file="steps/step-02-collecte.md">Collecter les informations du projet</step>
    <step file="steps/step-03-repo.md">Créer le repository GitHub</step>
    <step file="steps/step-04-labels.md">Configurer les labels</step>
    <step file="steps/step-05-project.md">Créer le GitHub Project</step>
    <step file="steps/step-06-output.md">Rapport final</step>
  </steps>
</workflow>
