<step order="4" name="architecture">
  <objective>Review architecture : isolation feature, coupling, patterns, shared-types usage.</objective>

  <process>
    **Vérifier :**

    **Isolation feature-first**
    - Tout code feature dans `src/features/{feature}/` → OK
    - Pas de code feature hors dossier → issue major
    - Pas d'import `../features/autre-feature/` → issue blocker (cross-coupling)

    **Shared-types usage**
    - Types réutilisés depuis `_orcl/output/shared-types/` → OK
    - Types dupliqués localement au lieu de shared → issue major
    - Types partagés modifiés sans impact analysis → issue major

    **Patterns respectés**
    - Pattern Repository pour data access → vérifier
    - Pattern Factory pour création objets complexes → vérifier
    - Pattern Observer/Event pour decoupling → vérifier
    - Pattern Strategy pour algorithmes interchangeables → vérifier
    - Si pattern non respecté sans justification → issue major

    **Layer boundaries**
    - UI (components) n'appelle PAS services directement → utilise hooks
    - Hooks n'appellent PAS DB → utilisent services
    - Services n'importent PAS UI → issue blocker

    **Barrel exports**
    - `index.ts` expose API publique clean → OK
    - Pas d'export de types/internes privés → issue minor

    **Format issues :** même format step-03
  </process>

  <output>Liste issues architecture</output>

  <next>step-05-security.md</next>
</step>