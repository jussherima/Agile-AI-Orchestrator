<workflow>
  <metadata>
    <name>Code Review structuré</name>
    <command>/orcl/dev/review-code</command>
    <input>Fichiers, dossier ou PR à reviewer</input>
    <output>Rapport de review avec problèmes classés par sévérité</output>
  </metadata>

  <steps>
    <step file="steps/step-01-scope.md">Définir le scope de la review</step>
    <step file="steps/step-02-correctness.md">Vérifier la correctitude et la logique</step>
    <step file="steps/step-03-quality.md">Évaluer la qualité du code</step>
    <step file="steps/step-04-security.md">Vérifier la sécurité</step>
    <step file="steps/step-05-output.md">Rapport de review</step>
  </steps>
</workflow>
