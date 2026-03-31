<step order="5" name="output">
  <objective>Produire le rapport d'audit.</objective>

  <process>
    Créer `_orcl/output/dev/audit-[nom-projet].md` avec :

    **Score global :** X/10

    **Résumé par catégorie :**
    | Catégorie | Score | Problèmes critiques | Problèmes majeurs |
    |-----------|-------|--------------------|--------------------|
    | Qualité | X/10 | N | N |
    | Sécurité | X/10 | N | N |
    | Performance | X/10 | N | N |
    | Tests | X/10 | N | N |

    **Problèmes critiques (sévérité 4) :** corriger immédiatement
    **Problèmes majeurs (sévérité 3) :** corriger avant prochaine release
    **Problèmes mineurs (sévérité 2) :** planifier
    **Suggestions (sévérité 1) :** amélioration continue

    **Plan d'action priorisé :**
    1. Quick wins (impact fort, effort faible)
    2. Projets (impact fort, effort élevé)
    3. Améliorations (impact faible, effort faible)
  </process>

  <self-check>
    - Chaque problème a un fichier, une description et une sévérité
    - La sécurité OWASP a été vérifiée
    - Les métriques de performance sont évaluées
    - Le plan d'action est priorisé
    - Le rapport est sauvegardé dans _orcl/output/dev/
  </self-check>
</step>
