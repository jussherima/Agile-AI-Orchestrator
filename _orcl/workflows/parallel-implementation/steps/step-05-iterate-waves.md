<step order="5" name="iterate-waves">
  <objective>Itérer sur les vagues suivantes jusqu'à completion de tous les tickets.</objective>

  <process>
    **Boucle principale (agent principal) :**
    ```
    vague = 1
    TANT QUE tickets_restants NON VIDE :
      
      SI vague > 1 :
        // Attendre que dépendances soient merged
        VÉRIFIER que tous tickets vagues précédentes sont merged sur main
        REBASE branches courantes sur main
      
      // Phase implémentation
      LANCER subagents implémentation pour vague (step-03)
      
      // Phase review + boucles corrections
      RÉPÉTER max 3 fois :
        LANCER subagents review pour vague (step-04)
        SI tous approved : BREAK
        SINON relancer implémentation SEULEMENT sur tickets changes-requested
      
      // Vérification vague
      SI tickets rejected : STOP + escalade
      
      vague++
      tickets_restants = tickets_restants - tickets_vague_validee
    ```

    **Gestion état persistant** dans `_orcl/output/parallel-execution/state.json` :
    ```json
    {
      "current_wave": 2,
      "completed_tickets": ["T-1", "T-2"],
      "in_progress": {"T-3": "review-iteration-2"},
      "blocked": [],
      "failed": [],
      "total_tokens_used": 45000,
      "started_at": "2026-10-13T10:00:00Z"
    }
    ```

    **Token tracking global :**
    - Cumuler tokens de tous subagents
    - Alerte si > 80% budget
    - Arrêt si > budget (sauf override)

    **Parallélisme adaptatif :**
    - Si vague précédente rapide → augmenter MAX_PARALLEL
    - Si timeouts/erreurs → diminuer MAX_PARALLEL
  </process>

  <output>Tous tickets implémentés, revus, approuvés</output>

  <next>step-06-verify-all.md</next>
</step>