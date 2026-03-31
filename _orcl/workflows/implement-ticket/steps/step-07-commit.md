<step order="7" name="commit">
  <objective>Commiter proprement et préparer la PR.</objective>

  <process>
    **Commits atomiques (Conventional Commits) :**
    - Un commit = un changement logique
    - Format : `<type>(<scope>): <description>`
    - Types : feat, fix, refactor, test, docs, chore
    - Description : impérative, < 72 caractères

    Exemples :
    ```
    feat(auth): add JWT token generation
    test(auth): add unit tests for token service
    ```

    **Push et PR :**
    - Push la branche : `git push -u origin <branche>`
    - Créer la PR avec :
      - Titre : conventional commit
      - Description : pourquoi, quoi, comment tester
      - Lien vers le ticket
      - Screenshots si UI

    **PR template :**
    ```
    ## Résumé
    [Ce que fait cette PR et pourquoi]

    ## Ticket
    [Lien vers le ticket]

    ## Changements
    - [Liste des changements]

    ## Tests
    - [Comment tester]

    ## Checklist
    - [ ] Tests ajoutés/mis à jour
    - [ ] Linter passe
    - [ ] Build réussi
    ```
  </process>

  <self-check>
    Avant de terminer :
    - Tous les critères d'acceptation sont satisfaits
    - Les tests passent
    - Le linter est OK
    - Les commits sont propres et atomiques
    - La PR est descriptive
  </self-check>
</step>
