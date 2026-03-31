<step order="5" name="executer">
  <objective>Exécuter les tests et vérifier la couverture.</objective>

  <process>
    - Exécuter tous les tests : `npm test` / `flutter test` / `pytest` / etc.
    - Vérifier que TOUS les tests passent (nouveaux ET existants)
    - Mesurer la couverture si le framework le supporte
    - Vérifier : couverture ≥ 80% sur le code modifié/ajouté

    **Si des tests échouent :**
    - Analyser la cause (bug dans le test ou bug dans le code ?)
    - Corriger et réexécuter

    **Rapport :**
    - Nombre de tests créés
    - Couverture avant → après
    - Tests unitaires vs intégration
    - Cas couverts (happy path, limites, erreurs)
  </process>

  <self-check>
    - Tous les tests passent
    - Chaque fonction publique a au moins un test
    - Les cas limites sont couverts
    - Les mocks sont utilisés correctement
    - La couverture est ≥ 80% sur le nouveau code
  </self-check>
</step>
