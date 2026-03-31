<step order="3" name="packages">
  <objective>Identifier les packages essentiels pour le projet.</objective>

  <process>
    Pour chaque besoin du projet, recommander LE package standard 2025 :

    | Besoin | Package à recommander |
    |--------|----------------------|
    | UI Components | [selon stack : Shadcn, Material, etc.] |
    | Styling | [Tailwind, styled-components, etc.] |
    | Forms | [react-hook-form+zod, reactive_forms, etc.] |
    | State | [Zustand, Riverpod, Redux, etc.] |
    | HTTP/API | [fetch, Dio, axios, etc.] |
    | ORM/DB | [Prisma, Drizzle, Drift, etc.] |
    | Auth | [Auth.js, firebase_auth, etc.] |
    | Validation | [Zod, class-validator, freezed, etc.] |
    | Testing | [Vitest, Jest, flutter_test, etc.] |
    | Linting | [ESLint, flutter_lints, etc.] |
    | Formatting | [Prettier, dart format, etc.] |
    | Navigation | [built-in, GoRouter, etc.] |
    | Icons | [Lucide, Material Icons, etc.] |
    | Images | [next/image, cached_network_image, etc.] |

    **Pour chaque package :**
    - Nom + version recommandée
    - Pourquoi celui-là (et pas les alternatives)
    - Configuration minimale nécessaire

    **Ne pas recommander :**
    - Packages non maintenus (vérifier dernière mise à jour)
    - Packages avec peu de downloads
    - Packages qui font doublon avec le framework
  </process>

  <next>Passer à step-04-structure.md</next>
</step>
