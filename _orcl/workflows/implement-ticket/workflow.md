<workflow>
  <metadata>
    <name>Implémentation d'un ticket</name>
    <command>/orcl/dev/implement-ticket</command>
    <input>Ticket du backlog ou description de feature</input>
    <output>Code implémenté, testé, commité</output>
    <prerequisite>Projet initialisé + ticket défini</prerequisite>
  </metadata>

  <steps>
    <step file="steps/step-01-charger.md">Charger et comprendre le ticket</step>
    <step file="steps/step-02-planifier.md">Planifier l'implémentation</step>
    <step file="steps/step-03-branch.md">Créer la branche et préparer</step>
    <step file="steps/step-04-implementer.md">Implémenter le code</step>
    <step file="steps/step-05-tester.md">Écrire et exécuter les tests</step>
    <step file="steps/step-06-review.md">Auto-review et nettoyage</step>
    <step file="steps/step-07-commit.md">Commit et PR</step>
  </steps>
</workflow>
