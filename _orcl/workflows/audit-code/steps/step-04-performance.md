<step order="4" name="performance">
  <objective>Identifier les problèmes de performance.</objective>

  <process>
    **Base de données :**
    - [ ] Pas de requêtes N+1 (boucle qui fait une requête par itération)
    - [ ] Index sur les colonnes filtrées/triées/jointes
    - [ ] Pas de `SELECT *` quand un subset suffit
    - [ ] Pagination sur les listes

    **API / Réseau :**
    - [ ] Pas d'appels API dans des boucles
    - [ ] Caching implémenté pour les données stables
    - [ ] Compression activée (gzip/brotli)

    **Frontend (si applicable) :**
    - [ ] Lazy loading des images et composants
    - [ ] Code splitting par route
    - [ ] Pas de re-renders inutiles (React: useMemo, useCallback)
    - [ ] Bundle size raisonnable

    **Mobile (si applicable) :**
    - [ ] Pas de memory leaks (listeners/subscriptions non dispose)
    - [ ] Pas de rebuild excessifs (Flutter: const, keys)
    - [ ] Images optimisées (taille, format)
    - [ ] Offline-first si pertinent

    **Général :**
    - [ ] Pas d'opérations O(n²) évitables
    - [ ] Ressources fermées après usage (connexions, streams, fichiers)
    - [ ] Pas de synchronous I/O sur le thread principal
  </process>

  <next>Passer à step-05-output.md</next>
</step>
