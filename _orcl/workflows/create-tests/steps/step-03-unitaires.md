<step order="3" name="unitaires">
  <objective>Écrire les tests unitaires.</objective>

  <process>
    **Structure AAA pour chaque test :**
    ```
    // ARRANGE — Préparer les données
    // ACT — Exécuter la fonction
    // ASSERT — Vérifier le résultat
    ```

    **Nommage :**
    `should_[résultat]_when_[condition]`

    **Pour chaque fonction :**
    1. Happy path — le cas normal qui fonctionne
    2. Cas limites — null, vide, valeurs extrêmes
    3. Cas d'erreur — inputs invalides, exceptions
    4. Branches — chaque condition a un test

    **Règles :**
    - Un test = un comportement
    - Tests indépendants entre eux (FIRST)
    - Pas de logique conditionnelle dans les tests
    - Mocker uniquement les dépendances externes, PAS le SUT
    - Assertions claires et spécifiques (pas `toBeTruthy()` quand on peut `toBe(42)`)
  </process>

  <next>Passer à step-04-integration.md</next>
</step>
