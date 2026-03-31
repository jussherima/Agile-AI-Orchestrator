<workflow>
  <metadata>
    <name>Recherche des standards UX applicables</name>
    <command>/orcl/ux/recherche-standard</command>
    <input>CDC validé ou description du projet</input>
    <output>_orcl/output/ux/standards-[nom-projet].md</output>
  </metadata>

  <steps>
    <step file="steps/step-01-contexte.md">Comprendre le contexte du projet</step>
    <step file="steps/step-02-identifier.md">Identifier les standards applicables</step>
    <step file="steps/step-03-adapter.md">Adapter les standards au contexte</step>
    <step file="steps/step-04-output.md">Produire le rapport de standards</step>
  </steps>
</workflow>
