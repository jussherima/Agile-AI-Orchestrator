<step order="5" name="project">
  <objective>Créer et configurer le GitHub Project (board Kanban).</objective>

  <process>
    - Créer le project : `gh project create --owner OWNER --title "NOM"`
    - Configurer les colonnes (champ Status) :
      1. Backlog
      2. Ready
      3. In Progress
      4. Code Review
      5. QA/Testing
      6. Done
    - Ajouter les champs personnalisés :
      - **Priority** (single select) : Critical, High, Medium, Low
      - **Type** (single select) : Bug, Feature, Technical, Docs
      - **Story Points** (number)
      - **Sprint** (iteration, 2 semaines par défaut)
    - Lier le project au repository
  </process>

  <constraints>
    <do-not>Ne jamais créer un project en doublon. Vérifier d'abord.</do-not>
  </constraints>

  <next>Passer à step-06-output.md</next>
</step>
