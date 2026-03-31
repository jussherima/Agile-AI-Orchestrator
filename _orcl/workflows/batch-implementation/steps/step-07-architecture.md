<step order="7" name="architecture">
  <objective>Définir l'architecture technique complète du projet.</objective>

  <process>
    Exécuter le workflow `recherche-architecture` en mode inline :

    **1. Couche données :**
    - Choisir la base de données (PostgreSQL, SQLite, etc.)
    - Choisir l'ORM (Prisma, Drizzle, Drift, etc.)
    - Définir les entités et relations (depuis le CDC/backlog)
    - Définir le Repository pattern
    - Stratégie de caching

    **2. Authentification (si nécessaire) :**
    - Méthode : email/password, OAuth, etc.
    - Solution : Auth.js, Firebase Auth, JWT custom
    - Rôles et permissions (RBAC)
    - Flow complet (register → login → refresh → protected routes)

    **3. State management :**
    - Server state : React Query, SWR, Riverpod
    - Client state : Zustand, Jotai, Riverpod
    - Form state : react-hook-form + zod

    **4. Error handling :**
    - Result/Either pattern
    - Error boundaries
    - Messages user-friendly par type d'erreur
    - Sentry integration

    **5. Architecture API :**
    - Approche : Server Actions, REST, tRPC
    - Liste des endpoints par feature
    - Format de réponse standardisé

    **6. Sauvegarder :**
    `_orcl/output/dev/architecture-[nom].md` avec ADR (Architecture Decision Records)

    Annoncer : "✓ Architecture définie. Scaffolding..."
  </process>

  <next>Passer à step-08-scaffold.md</next>
</step>
