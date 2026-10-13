<step order="6" name="verify-all">
  <objective>Agent principal vérifie que CHAQUE feature est correctement implémentée end-to-end.</objective>

  <process>
    **1. Vérification globale automatisée**
    - Checkout main + merge toutes les branches features
    - Exécuter TOUS les tests (unitaires + intégration + e2e)
    - Build complet + linter + typecheck
    - Vérifier pas de régression (tests existants passent)

    **2. Vérification par feature (agent principal, pas subagent)**
    Pour CHAQUE ticket du backlog original :
    - Relire critères d'acceptation
    - Vérifier dans le code merged : chaque critère a son test
    - Exécuter test spécifique au critère
    - Confirmer : `✓ Critère "[...]" validé par test [nom_test]`

    **3. Vérification architecture**
    - Structure feature-first respectée
    - Pas de coupling non voulu entre features
    - Types partagés cohérents
    - Conventions respectées

    **4. Vérification sécurité/performance**
    - Audit dépendances (npm audit / cargo audit)
    - Pas de secrets en dur
    - Input validation sur toutes entrées
    - Pas de N+1 queries, boucles infinies

    **5. Générer rapport de vérification** `_orcl/output/parallel-execution/verification-report.json`
    ```json
    {
      "all_tests_pass": true,
      "build_pass": true,
      "lint_pass": true,
      "typecheck_pass": true,
      "features_verified": [
        {"ticket": "T-1", "criteria_all_pass": true, "evidence": "..."},
        {"ticket": "T-2", "criteria_all_pass": true, "evidence": "..."}
      ],
      "architecture_violations": [],
      "security_issues": [],
      "performance_concerns": []
    }
    ```

    **SI QUELQUE CHOSE ÉCHOUE → STOP, ne pas passer à l'étape suivante**
  </process>

  <output>Rapport de vérification complet, tout validé</output>

  <next>step-07-report.md</next>
</step>