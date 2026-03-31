<workflow>
  <metadata>
    <name>Recherche et définition de l'architecture technique</name>
    <command>/orcl/dev/recherche-architecture</command>
    <input>Stack documentée + besoins du projet</input>
    <output>_orcl/output/dev/architecture-[nom-projet].md</output>
    <prerequisite>Stack identifiée (idéalement après /orcl/dev/recherche-stack)</prerequisite>
  </metadata>

  <steps>
    <step file="steps/step-01-contexte.md">Charger le contexte projet et stack</step>
    <step file="steps/step-02-data-layer.md">Définir la couche données</step>
    <step file="steps/step-03-auth.md">Définir la stratégie d'authentification</step>
    <step file="steps/step-04-state.md">Définir le state management et l'error handling</step>
    <step file="steps/step-05-api.md">Définir l'architecture API</step>
    <step file="steps/step-06-output.md">Documenter l'architecture</step>
  </steps>
</workflow>
