<step order="3" name="branch">
  <objective>Créer la branche et préparer l'environnement.</objective>

  <process>
    - Vérifier qu'on est sur `main` et à jour : `git pull origin main`
    - Créer la branche : `git checkout -b <type>/<ticket-id>-<description>`
      - Types : `feature/`, `fix/`, `refactor/`, `chore/`
      - Exemple : `feature/ORCL-42-add-user-authentication`
    - Vérifier que le projet compile/build sans erreur
    - Vérifier que les tests existants passent
  </process>

  <constraints>
    <do-not>Ne jamais travailler directement sur main.</do-not>
    <do-not>Ne jamais commencer sur une base cassée (tests en échec).</do-not>
  </constraints>

  <next>Passer à step-04-implementer.md</next>
</step>
