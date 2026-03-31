<workflow>
  <metadata>
    <name>Batch Implementation — Projet en one-shot</name>
    <command>/orcl/dev/batch-implementation</command>
    <input>CDC ou description du projet</input>
    <output>Projet complet : repo GitHub + tickets + UX + code implémenté</output>
    <description>
      Orchestrateur qui enchaîne automatiquement TOUT le pipeline Orchestral :
      GitHub init → CDC validation → Tickets → UX → Implémentation de chaque ticket.
      Pas de gates manuelles — tout est automatique sauf si un STOP est déclenché.
    </description>
  </metadata>

  <steps>
    <step file="steps/step-01-intake.md">Intake — Comprendre le projet</step>
    <step file="steps/step-02-github.md">Créer le repo GitHub + Project</step>
    <step file="steps/step-03-cdc.md">Valider le CDC</step>
    <step file="steps/step-04-tickets.md">Créer et valider les tickets</step>
    <step file="steps/step-05-ux.md">Recherche standards + patterns UI + livrables UX</step>
    <step file="steps/step-06-stack.md">Rechercher la stack technique + best practices</step>
    <step file="steps/step-07-architecture.md">Définir l'architecture technique</step>
    <step file="steps/step-08-scaffold.md">Scaffolder le projet</step>
    <step file="steps/step-09-implement.md">Implémenter tous les tickets</step>
    <step file="steps/step-10-audit.md">Audit final qualité/sécurité/performance</step>
    <step file="steps/step-11-push.md">Push tickets sur GitHub Projects</step>
    <step file="steps/step-12-output.md">Rapport final</step>
  </steps>

  <mode>
    Ce workflow fonctionne en mode BATCH — pas de gates manuelles entre les étapes.
    L'orchestrateur avance automatiquement sauf si :
    - Un STOP est déclenché (ambiguïté, donnée manquante)
    - Une erreur critique est détectée
    Dans ces cas, il s'arrête, pose la question, et reprend après réponse.
  </mode>
</workflow>
