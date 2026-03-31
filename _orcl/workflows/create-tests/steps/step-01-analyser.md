<step order="1" name="analyser">
  <objective>Comprendre le code avant d'écrire les tests.</objective>

  <process>
    - Lire les fichiers spécifiés ou scanner le projet
    - Identifier le framework de test utilisé (Jest, Vitest, pytest, flutter_test, etc.)
    - Pour chaque fichier/module, identifier :
      - **Fonctions/méthodes publiques** à tester
      - **Logique métier** (calculs, validations, transformations)
      - **Dépendances externes** à mocker (DB, API, filesystem)
      - **Cas limites** : null, vide, overflow, formats invalides
      - **Branches conditionnelles** : chaque if/else/switch
    - Calculer la couverture actuelle si possible
  </process>

  <output>
    Lister les fonctions à tester avec les cas identifiés.
  </output>

  <next>Passer à step-02-strategie.md</next>
</step>
