<step order="2" name="strategie">
  <objective>Définir ce qu'on teste et comment.</objective>

  <process>
    **Pyramide des tests :**
    - Unitaires (~70%) : logique métier, validations, transformations
    - Intégration (~20%) : interactions DB, API, entre services
    - E2E (~10%) : seulement les parcours critiques (pas dans ce workflow)

    **Pour chaque fonction, définir :**
    - Tests à écrire (titre descriptif)
    - Type : unitaire ou intégration
    - Mocks nécessaires
    - Données de test (fixtures)

    **Prioriser :**
    1. Code critique métier (calculs, règles, validations)
    2. Code avec des conditions complexes
    3. Code qui gère des erreurs
    4. Code d'intégration (API, DB)
  </process>

  <next>Passer à step-03-unitaires.md</next>
</step>
