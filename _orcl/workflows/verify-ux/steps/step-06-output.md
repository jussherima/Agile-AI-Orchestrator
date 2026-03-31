<step order="6" name="output">
  <objective>Produire et sauvegarder le rapport d'audit UX.</objective>

  <process>
    Créer `_orcl/output/ux/audit-ux-[nom-projet].md` avec :
    - **Score global** : X/10
    - **Verdict** : VALIDÉ / VALIDÉ AVEC RÉSERVES / NON VALIDÉ
    - **Résumé** : nombre de problèmes par sévérité
    - **Évaluation heuristique** : tableau par écran
    - **Conformité WCAG** : checklist avec résultat
    - **Couverture des états** : checklist par écran
    - **Plan de correction priorisé** (si applicable)
  </process>

  <announce>
    - Si VALIDÉ : "UX validé. Design prêt pour le handoff dev."
    - Si AVEC RÉSERVES : "UX validé avec réserves. [N] corrections mineures à planifier."
    - Si NON VALIDÉ : "UX non validé. [N] problèmes critiques à corriger. Relance `/orcl/ux/create-ux` après corrections."
  </announce>

  <self-check>
    Avant de terminer :
    - Chaque problème a une sévérité attribuée
    - Les problèmes critiques sont clairement identifiés
    - Le plan de correction est priorisé
    - Le rapport est sauvegardé dans _orcl/output/ux/
    - Le verdict est cohérent avec les problèmes trouvés
  </self-check>
</step>
