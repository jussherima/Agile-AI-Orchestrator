<step order="4" name="auto-review">
  <objective>Auto-review rapide via checklist avant commit.</objective>

  <process>
    **Checklist (tous doivent passer) :**

    **Code Quality**
    - [ ] Pas de `any` TypeScript (sauf justification documentée)
    - [ ] Pas de `console.log` / `debugger` en prod
    - [ ] Imports triés (externes → internes → relatifs)
    - [ ] Pas de code mort / commenté
    - [ ] Nommage cohérent avec conventions.md

    **Architecture**
    - [ ] Feature isolée dans `src/features/{feature}/`
    - [ ] Pas d'import cross-feature (sauf via shared-types)
    - [ ] Interfaces définies pour services externes
    - [ ] Pas de logique métier dans composants UI

    **Sécurité**
    - [ ] Input validation sur tous endpoints/entrées
    - [ ] Pas de secrets en dur
    - [ ] AuthZ vérifié sur mutations
    - [ ] Sanitization outputs utilisateur

    **Tests**
    - [ ] Tous tests passent
    - [ ] Couverture ≥ 80% sur nouveaux fichiers
    - [ ] Chaque critère d'acceptation couvert par test

    **Git**
    - [ ] Build passe (`npm run build`)
    - [ ] Linter passe (`npm run lint`)
    - [ ] Typecheck passe (`npm run typecheck`)

    **Si ÉCHEC → corriger avant de continuer**
  </process>

  <output>Checklist validée, prêt pour commit</output>

  <next>step-05-commit-report.md</next>
</step>