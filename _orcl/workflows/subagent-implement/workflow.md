<workflow>
  <metadata>
    <name>Subagent — Implémentation Ticket Unique</name>
    <command>/orcl/subagent/implement-ticket</command>
    <input>Ticket + contextes partagés (architecture, patterns, types)</input>
    <output>Code implémenté, testé, commité + rapport JSON</output>
    <description>
      Subagent dédié à UN seul ticket. Ne fait QUE l'implémentation.
      Input minimal, output structuré. Token-efficient.
    </description>
    <mode>subagent</mode>
  </metadata>

  <steps>
    <step file="steps/step-01-load.md">Charger ticket et contextes partagés</step>
    <step file="steps/step-02-implement.md">Implémenter le code (Clean Code, SOLID, sécurité)</step>
    <step file="steps/step-03-test.md">Écrire et exécuter tests (unitaires + intégration)</step>
    <step file="steps/step-04-auto-review.md">Auto-review rapide (checklist)</step>
    <step file="steps/step-05-commit-report.md">Commit atomique + rapport JSON</step>
  </steps>
</workflow>