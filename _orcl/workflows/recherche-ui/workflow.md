<workflow>
  <metadata>
    <name>Recherche de patterns UI</name>
    <command>/orcl/ux/recherche-ui</command>
    <input>Contexte projet + standards identifiés</input>
    <output>_orcl/output/ux/patterns-ui-[nom-projet].md</output>
  </metadata>

  <steps>
    <step file="steps/step-01-analyser.md">Analyser les besoins UI du projet</step>
    <step file="steps/step-02-navigation.md">Rechercher les patterns de navigation</step>
    <step file="steps/step-03-composants.md">Identifier les composants nécessaires</step>
    <step file="steps/step-04-design-system.md">Recommander un design system</step>
    <step file="steps/step-05-output.md">Produire le rapport de patterns UI</step>
  </steps>
</workflow>
