<step order="12" name="output">
  <objective>Rapport final du batch implementation.</objective>

  <process>
    Créer `_orcl/output/dev/batch-report-[nom].md` et afficher le rapport :

    ```
    ══════════════════════════════════════════
    BATCH IMPLEMENTATION — [NOM DU PROJET]
    ══════════════════════════════════════════

    Repo     : [lien GitHub]
    Project  : [lien GitHub Project]
    Stack    : [framework + langage]

    ── PIPELINE ──────────────────────────────
    ✓ GitHub      Repo + Project + labels
    ✓ CDC         Validé ([score]/10)
    ✓ Tickets     [N] créés et validés
    ✓ UX          [N] personas, [M] écrans, [P] flows
    ✓ Scaffold    Structure feature-first
    ✓ Code        [N]/[T] tickets implémentés
    ✓ Tests       [N] tests, couverture [X]%
    ✓ Audit       Score [X]/10
    ✓ GitHub      [N] issues sur le Project board

    ── ARTEFACTS ─────────────────────────────
    _orcl/output/CDC-validated.md
    _orcl/output/backlogs/[nom]-backlog.md
    _orcl/output/ux/standards-[nom].md
    _orcl/output/ux/patterns-ui-[nom].md
    _orcl/output/ux/[nom]/personas.md
    _orcl/output/ux/[nom]/user-flows.md
    _orcl/output/ux/[nom]/sitemap.md
    _orcl/output/ux/[nom]/wireframes.md
    _orcl/output/dev/audit-[nom].md

    ── PROCHAINES ÉTAPES ─────────────────────
    - Revue du code par l'équipe
    - Tests manuels sur les parcours critiques
    - Déploiement staging
    - Tests utilisateurs
    ```
  </process>

  <self-check>
    Avant de terminer :
    - Le repo GitHub existe et contient le code
    - Le GitHub Project existe avec les issues
    - Tous les artefacts sont sauvegardés dans _orcl/output/
    - Le rapport est complet et sauvegardé
    - Les liens sont fonctionnels
  </self-check>
</step>
