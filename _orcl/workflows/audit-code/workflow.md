<workflow>
  <metadata>
    <name>Audit qualité, sécurité et performance</name>
    <command>/orcl/dev/audit-code</command>
    <input>Projet ou fichiers à auditer</input>
    <output>_orcl/output/dev/audit-[nom-projet].md</output>
  </metadata>

  <steps>
    <step file="steps/step-01-scope.md">Définir le scope de l'audit</step>
    <step file="steps/step-02-qualite.md">Audit qualité du code</step>
    <step file="steps/step-03-securite.md">Audit sécurité (OWASP)</step>
    <step file="steps/step-04-performance.md">Audit performance</step>
    <step file="steps/step-05-output.md">Rapport d'audit</step>
  </steps>
</workflow>
