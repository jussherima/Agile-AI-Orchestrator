<step order="2" name="collecte">
  <objective>Collecter les informations nécessaires pour créer le repo et le project.</objective>

  <process>
    Si des arguments sont fournis, les utiliser. Sinon, demander :
    - **Nom du repo** : nom court, kebab-case (ex: `gestion-scolaire`)
    - **Description** : une phrase décrivant le projet
    - **Visibilité** : public ou private (défaut: private)
    - **Owner** : utilisateur personnel ou organisation (défaut: utilisateur connecté)
    - **Nom du Project** : nom affiché sur le board (défaut: même que le repo)
  </process>

  <constraints>
    <do-not>Ne jamais deviner le nom ou l'organisation. Toujours confirmer avec l'utilisateur.</do-not>
  </constraints>

  <output>
    Récapituler les choix et demander confirmation avant de continuer.
  </output>

  <next>Passer à step-03-repo.md</next>
</step>
