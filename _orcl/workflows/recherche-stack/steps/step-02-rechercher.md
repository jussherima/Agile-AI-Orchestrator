<step order="2" name="rechercher">
  <objective>Rechercher les best practices spécifiques au framework.</objective>

  <process>
    **Consulter d'abord `brain/stacks/` pour la référence interne.**
    Si un document existe (ex: `brain/stacks/ORCL_NEXTJS.md`) → le charger comme base.

    **Si pas de référence interne ou si elle est insuffisante → recherche web :**
    Rechercher les best practices 2025 pour le framework, incluant :

    1. **Rendering / Data fetching** :
       - Patterns recommandés (SSR, SSG, ISR, Server Components, etc.)
       - Quand utiliser quel pattern
       - Caching et revalidation

    2. **State management** :
       - Solution recommandée pour ce framework en 2025
       - Patterns (global vs local state)
       - Server state vs client state

    3. **Routing** :
       - Système de routing du framework
       - Protected routes / guards
       - Deep linking (mobile)

    4. **Conventions du framework** :
       - Naming conventions (fichiers, classes, variables)
       - File conventions (loading.tsx, error.tsx, layout.tsx pour Next.js)
       - Patterns idiomatiques

    5. **Performance spécifique** :
       - Optimisations propres au framework
       - Anti-patterns à éviter
       - Outils de profiling
  </process>

  <next>Passer à step-03-packages.md</next>
</step>
