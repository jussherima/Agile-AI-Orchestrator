<step order="4" name="stories">
  <objective>Découper chaque Epic en User Stories.</objective>

  <format>
    "En tant que [rôle], je veux [action] afin de [bénéfice]"
  </format>

  <splitting-techniques>
    Utiliser la technique la plus adaptée :
    - Par workflow (processus multi-étapes)
    - Par règles métier (logique complexe)
    - Par CRUD (entité avec opérations)
    - Par rôle (multi-utilisateurs)
    - Par plateforme (multi-support)
    - Par happy path vs edge cases
    - Par variation de données
    - Par complexité d'interface
    - Par qualité non-fonctionnelle
  </splitting-techniques>

  <rule priority="critical">
    Découpe VERTICALE obligatoire : chaque story traverse UI + API + BDD.
    Jamais de story "front seul" ou "back seul".
  </rule>

  <constraints>
    <do-not>Ne jamais créer de story purement technique sans valeur utilisateur.</do-not>
    <do-not>Ne jamais découper horizontalement (par couche technique).</do-not>
  </constraints>

  <next>Passer à step-05-invest.md</next>
</step>
