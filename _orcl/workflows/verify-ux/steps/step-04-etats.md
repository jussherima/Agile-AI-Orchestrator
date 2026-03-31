<step order="4" name="etats">
  <objective>Vérifier que tous les états et cas limites sont couverts.</objective>

  <process>
    **Pour chaque écran, vérifier les états :**

    - [ ] **Default** — État normal, avec données
    - [ ] **Empty state** — Aucune donnée, avec guidance (quoi faire)
    - [ ] **Loading** — Skeleton loader ou spinner
    - [ ] **Error** — Message clair + action de récupération
    - [ ] **First use** — Onboarding ou guidance initiale
    - [ ] **Partial data** — Données incomplètes (profil pas rempli, etc.)
    - [ ] **Offline** — Comportement sans connexion (si applicable)

    **Pour chaque formulaire, vérifier :**
    - [ ] Validation inline au blur
    - [ ] Messages d'erreur sous chaque champ
    - [ ] État de soumission (loading dans le bouton)
    - [ ] Feedback de succès
    - [ ] Cas : texte très long, champs vides, données invalides

    **Pour chaque liste/tableau :**
    - [ ] Empty state
    - [ ] 1 élément
    - [ ] Beaucoup d'éléments (performance, pagination)
    - [ ] Recherche sans résultat

    **Red flags à signaler immédiatement :**
    - État vide manquant
    - Pas de feedback après action
    - Action irréversible sans confirmation
    - Message d'erreur générique
  </process>

  <next>Passer à step-05-verdict.md</next>
</step>
