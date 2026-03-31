<step order="5" name="tester">
  <objective>Écrire et exécuter les tests.</objective>

  <process>
    **Tests unitaires (priorité) :**
    - Structure AAA (Arrange-Act-Assert)
    - Nommage : `should_[résultat]_when_[condition]`
    - Couvrir : happy path, cas limites, erreurs
    - Mocker uniquement les dépendances externes
    - Viser ≥ 80% de couverture sur le nouveau code

    **Tests d'intégration (si applicable) :**
    - Tester les interactions entre couches
    - API endpoints : status codes, body, headers
    - Base de données : CRUD, contraintes, transactions

    **Vérifications :**
    - Exécuter tous les tests : `npm test` / `flutter test` / etc.
    - Vérifier que les tests existants passent toujours
    - Vérifier la couverture
  </process>

  <constraints>
    <do-not>Ne jamais mocker le System Under Test.</do-not>
    <do-not>Ne jamais écrire des tests qui testent l'implémentation au lieu du comportement.</do-not>
    <do-not>Ne jamais avoir de logique conditionnelle dans les tests.</do-not>
  </constraints>

  <next>Passer à step-06-review.md</next>
</step>
