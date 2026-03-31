<step order="4" name="integration">
  <objective>Écrire les tests d'intégration si nécessaire.</objective>

  <process>
    **Quand écrire des tests d'intégration :**
    - Endpoints API (REST/GraphQL) : status codes, body, auth
    - Requêtes DB complexes (jointures, agrégations)
    - Interactions entre services/modules
    - Middleware (auth, validation, rate limiting)

    **Mocker vs vraie dépendance :**
    - Services tiers (Stripe, S3, email) → TOUJOURS mocker
    - Base de données → vraie DB de test si possible (Testcontainers)
    - APIs internes → dépend du contexte

    **Structure :**
    - Setup : préparer l'environnement (DB seed, auth token, etc.)
    - Test : exécuter le scénario
    - Teardown : nettoyer (truncate tables, etc.)

    Si aucune intégration n'est nécessaire pour le code analysé, passer directement au step suivant.
  </process>

  <next>Passer à step-05-executer.md</next>
</step>
