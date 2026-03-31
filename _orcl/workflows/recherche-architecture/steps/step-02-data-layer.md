<step order="2" name="data-layer">
  <objective>Définir la couche données du projet.</objective>

  <process>
    **Base de données :**
    - Type : PostgreSQL (relationnel, défaut), MongoDB (document), SQLite (mobile/embarqué)
    - ORM/Query builder selon la stack :
      - Next.js/Node : Prisma (recommandé) ou Drizzle (léger)
      - Flutter : Drift (SQL) ou Isar (NoSQL local)
      - Python : SQLAlchemy ou Django ORM
    - Migrations : stratégie et outils

    **Repository pattern :**
    ```
    // Interface (domain layer)
    interface UserRepository {
      findById(id: string): Promise<User | null>
      create(data: CreateUserDTO): Promise<User>
    }

    // Implémentation (data layer)
    class PrismaUserRepository implements UserRepository {
      // ...
    }
    ```

    **Modèles de données :**
    - Lister les entités principales (depuis le CDC/backlog)
    - Relations entre entités
    - Schéma préliminaire de la base de données

    **Caching :**
    - Client : React Query / SWR (web) ou cache local (mobile)
    - Serveur : Redis si nécessaire
    - Stratégie d'invalidation
  </process>

  <next>Passer à step-03-auth.md</next>
</step>
