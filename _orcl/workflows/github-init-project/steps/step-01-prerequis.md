<step order="1" name="prerequis">
  <objective>Vérifier que tout est en place avant de créer quoi que ce soit sur GitHub.</objective>

  <checks>
    - `gh auth status` doit être OK. Sinon → "Lance `gh auth login`."
    - Vérifier les scopes disponibles. Si `project` manque → "Lance `gh auth refresh -s read:project -s project`."
    - Vérifier que l'utilisateur ou l'organisation cible est accessible
  </checks>

  <constraints>
    <do-not>Ne jamais continuer si l'authentification échoue.</do-not>
  </constraints>

  <next>Passer à step-02-collecte.md</next>
</step>
