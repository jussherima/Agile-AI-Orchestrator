<workflow>
  <metadata>
    <name>Création des livrables UX</name>
    <command>/orcl/ux/create-ux</command>
    <input>CDC validé + standards + patterns UI identifiés</input>
    <output>_orcl/output/ux/[nom-projet]/ (personas, flows, wireframes, etc.)</output>
    <prerequisite>CDC validé ou contexte projet fourni</prerequisite>
    <next-workflow>/orcl/ux/verify-ux</next-workflow>
  </metadata>

  <steps>
    <step file="steps/step-01-charger.md">Charger le contexte et les prérequis</step>
    <step file="steps/step-02-personas.md">Créer les personas</step>
    <step file="steps/step-03-flows.md">Définir les user flows</step>
    <step file="steps/step-04-architecture.md">Structurer l'architecture de l'information</step>
    <step file="steps/step-05-wireframes.md">Produire les wireframes</step>
    <step file="steps/step-06-specs.md">Rédiger les spécifications d'interaction</step>
    <step file="steps/step-07-output.md">Sauvegarder et présenter</step>
  </steps>

  <gate type="human-validation">
    Avant de passer à /orcl/ux/verify-ux, l'utilisateur revoit les livrables.
  </gate>
</workflow>
