<workflow>
  <metadata>
    <name>Audit et validation UX</name>
    <command>/orcl/ux/verify-ux</command>
    <input>Livrables UX dans _orcl/output/ux/</input>
    <output>_orcl/output/ux/audit-ux-[nom-projet].md</output>
    <prerequisite>Livrables UX créés dans _orcl/output/ux/</prerequisite>
  </metadata>

  <steps>
    <step file="steps/step-01-charger.md">Charger les livrables UX</step>
    <step file="steps/step-02-heuristique.md">Évaluation heuristique (Nielsen)</step>
    <step file="steps/step-03-accessibilite.md">Vérification accessibilité (WCAG)</step>
    <step file="steps/step-04-etats.md">Vérification des états et cas limites</step>
    <step file="steps/step-05-verdict.md">Verdict et priorisation</step>
    <step file="steps/step-06-output.md">Rapport d'audit</step>
  </steps>
</workflow>
