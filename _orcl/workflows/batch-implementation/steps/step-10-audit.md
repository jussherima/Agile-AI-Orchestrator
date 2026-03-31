<step order="10" name="audit">
  <objective>Audit final du projet complet.</objective>

  <process>
    Exécuter le workflow `audit-code` en mode inline sur tout le projet :

    **1. Qualité :**
    - Clean Code respecté ? Fonctions courtes, noms clairs
    - SOLID respecté ? Pas de God Class
    - Code dupliqué ? Dead code ?
    - Couverture de tests globale

    **2. Sécurité (OWASP) :**
    - Input validation sur toutes les entrées
    - Pas d'injection possible
    - Pas de secrets en dur
    - Auth et access control corrects
    - Exécuter `npm audit` / équivalent

    **3. Performance :**
    - Pas de requêtes N+1
    - Lazy loading configuré
    - Images optimisées
    - Bundle size acceptable

    **Si problèmes critiques (sévérité 4) → corriger immédiatement avant de continuer.**
    Si problèmes majeurs (sévérité 3) → corriger les quick wins, documenter le reste.

    Sauvegarder dans `_orcl/output/dev/audit-[nom].md`.

    Annoncer : "✓ Audit terminé : [score]/10. Push sur GitHub..."
  </process>

  <next>Passer à step-11-push.md</next>
</step>
