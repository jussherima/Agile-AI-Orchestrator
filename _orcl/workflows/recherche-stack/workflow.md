<workflow>
  <metadata>
    <name>Recherche et documentation de la stack technique</name>
    <command>/orcl/dev/recherche-stack</command>
    <input>Framework/stack choisi (ex: Next.js, Flutter, Django)</input>
    <output>_orcl/output/dev/stack-[framework].md + rule dynamique</output>
    <description>
      Recherche les best practices, conventions, packages essentiels et structure
      recommandée pour le framework choisi. Génère un document de référence ET une
      rule Claude Code qui guidera tout le code produit ensuite.
    </description>
  </metadata>

  <steps>
    <step file="steps/step-01-identifier.md">Identifier la stack et le contexte</step>
    <step file="steps/step-02-rechercher.md">Rechercher les best practices du framework</step>
    <step file="steps/step-03-packages.md">Identifier les packages essentiels</step>
    <step file="steps/step-04-structure.md">Définir la structure de projet</step>
    <step file="steps/step-05-conventions.md">Documenter les conventions spécifiques</step>
    <step file="steps/step-06-output.md">Générer le document de stack + rule</step>
  </steps>
</workflow>
