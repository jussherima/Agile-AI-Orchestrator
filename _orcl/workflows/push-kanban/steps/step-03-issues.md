<step order="3" name="issues">
  <objective>Créer les issues GitHub pour chaque ticket du backlog.</objective>

  <process>
    Pour chaque ticket :
    - Titre = titre du ticket
    - Body = user story + critères d'acceptation + contexte
    - Labels = type + priorité + taille
    - Assignee = si applicable
  </process>

  <constraints>
    <do-not>Ne jamais créer d'issue en doublon. Vérifier si elle existe déjà.</do-not>
  </constraints>

  <next>Passer à step-04-project.md</next>
</step>
