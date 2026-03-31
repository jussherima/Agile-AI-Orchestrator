<step order="3" name="corriger">
  <objective>Corriger automatiquement les tickets défaillants.</objective>

  <process>
    Pour chaque ticket qui échoue :
    - Expliquer ce qui ne va pas
    - Proposer une correction concrète
    - Corriger automatiquement le ticket dans le backlog
  </process>

  <constraints>
    <do-not>Ne jamais supprimer un ticket. Le corriger uniquement.</do-not>
    <do-not>Ne jamais modifier le scope d'un ticket lors de la correction.</do-not>
  </constraints>

  <next>Passer à step-04-output.md</next>
</step>
