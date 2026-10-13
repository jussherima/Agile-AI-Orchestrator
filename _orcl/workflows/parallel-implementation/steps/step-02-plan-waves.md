<step order="2" name="plan-waves">
  <objective>Planifier les vagues d'exécution parallèle optimales pour minimiser le temps total.</objective>

  <process>
    **1. Regrouper par niveau topologique**
    - Tous les tickets niveau 0 = vague 1 (pas de dépendances)
    - Niveau 1 = vague 2, etc.

    **2. Optimiser par vague (token-efficient)**
    - Limiter vague à MAX_PARALLEL = 3-4 subagents simultanés
    - Si vague > MAX_PARALLEL : sous-diviser par criticité décroissante
    - Prioriser tickets avec le plus de dépendants (débloquent plus de travail)

    **3. Estimer tokens par ticket**
    - Complexité ≈ story_points × facteur_stack
    - Réserver budget tokens par vague
    - Si budget dépassé → reporter tickets moins critiques

    **4. Créer plan d'exécution** dans `_orcl/output/parallel-execution/plan.json`
    ```json
    {
      "waves": [
        {"id": 1, "tickets": ["T-1", "T-2"], "parallel": true, "estimated_tokens": 15000},
        {"id": 2, "tickets": ["T-3"], "parallel": false, "estimated_tokens": 8000}
      ],
      "total_estimated_tokens": 23000,
      "max_parallel": 3
    }
    ```

    **5. Préparer contextes partagés** (économiser tokens)
    - Architecture decisions → fichier partagé lu par tous subagents
    - Patterns code, conventions, types → référence unique
    - Subagents reçoivent SEULEMENT leur ticket + références partagées
  </process>

  <output>Plan d'exécution optimisé, contextes partagés préparés</output>

  <next>step-03-spawn-implement.md</next>
</step>