<workflow>
  <metadata>
    <name>Subagent — Review Ticket Unique</name>
    <command>/orcl/subagent/review-ticket</command>
    <input>Ticket + rapport implémentation + fichiers changés + contextes partagés</input>
    <output>Verdict JSON (approved|changes-requested|rejected) + issues détaillés</output>
    <description>
      Subagent dédié à la review d'UN seul ticket. Vérifie critères d'acceptation,
      qualité code, architecture, sécurité, tests. Verdict structuré.
    </description>
    <mode>subagent</mode>
  </metadata>

  <steps>
    <step file="steps/step-01-load.md">Charger ticket, implémentation, contextes</step>
    <step file="steps/step-02-criteria-check.md">Vérifier CHAQUE critère d'acceptation</step>
    <step file="steps/step-03-code-quality.md">Review qualité code (Clean Code, SOLID, conventions)</step>
    <step file="steps/step-04-architecture.md">Review architecture (isolation, coupling, patterns)</step>
    <step file="steps/step-05-security.md">Review sécurité (validation, authZ, secrets, XSS)</step>
    <step file="steps/step-06-tests.md">Exécuter et vérifier tests</step>
    <step file="steps/step-07-verdict.md">Verdict final + rapport JSON</step>
  </steps>
</workflow>