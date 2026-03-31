<step order="4" name="structure">
  <objective>Définir la structure de projet recommandée pour cette stack.</objective>

  <process>
    Produire l'arborescence complète adaptée au framework ET au projet :

    **Principes :**
    - Feature-first (pas layer-first)
    - Clean Architecture adapté au framework
    - Colocation (fichiers liés = même dossier)
    - Conventions du framework respectées

    **Structure type (adapter selon le framework) :**
    ```
    src/ (ou app/ ou lib/)
    ├── core/                  ← Config, constants, theme, utils partagés
    │   ├── config/
    │   ├── constants/
    │   ├── theme/
    │   ├── utils/
    │   └── errors/
    ├── features/              ← Feature-first
    │   ├── auth/
    │   │   ├── data/          ← Repository impl, models, API calls
    │   │   ├── domain/        ← Entities, use cases, repository interface
    │   │   └── presentation/  ← UI, components, state/controller
    │   ├── home/
    │   └── [feature]/
    ├── shared/                ← Composants UI réutilisables
    │   ├── components/
    │   ├── hooks/ (ou widgets/)
    │   └── layouts/
    └── [framework-specific]/  ← Ex: app/ pour Next.js, routes/ etc.
    ```

    **Adapter pour chaque framework :**
    - Next.js App Router : `app/` pour le routing, `src/features/` pour le code
    - Flutter : `lib/features/`, `lib/core/`, `lib/shared/`
    - Express/NestJS : `src/modules/` feature-first
  </process>

  <next>Passer à step-05-conventions.md</next>
</step>
