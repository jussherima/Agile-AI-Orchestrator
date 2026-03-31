<step order="5" name="verdict">
  <objective>Produire le verdict final et prioriser les corrections.</objective>

  <process>
    **Synthèse des problèmes :**
    - Compter par sévérité : combien de 4, 3, 2, 1
    - Lister les problèmes critiques (sévérité 3-4) en priorité

    **Verdict :**
    - **VALIDÉ** : aucun problème sévérité 3 ou 4, WCAG AA respecté, tous les états couverts
    - **VALIDÉ AVEC RÉSERVES** : pas de sévérité 4, quelques sévérité 3 mineures, plan de correction défini
    - **NON VALIDÉ** : présence de sévérité 4, WCAG AA non respecté, ou états critiques manquants

    **Plan de correction (si non validé) :**
    Classer par matrice Impact/Effort :
    1. **Quick wins** — Impact fort, effort faible → corriger immédiatement
    2. **Projets majeurs** — Impact fort, effort élevé → planifier
    3. **Améliorations** — Impact faible, effort faible → si le temps le permet
    4. **Reporter** — Impact faible, effort élevé → backlog
  </process>

  <next>Passer à step-06-output.md</next>
</step>
