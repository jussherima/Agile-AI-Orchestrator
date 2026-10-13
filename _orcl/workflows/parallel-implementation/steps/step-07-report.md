<step order="7" name="report">
  <objective>Générer le rapport final de synthèse pour l'humain.</objective>

  <process>
    **1. Collecter toutes métriques**
    - Temps total, tokens totaux, tickets traités
    - Par ticket : temps, tokens, itérations review, verdict final
    - Vagues : parallélisme effectif, goulots

    **2. Rapport final** `_orcl/output/parallel-execution/FINAL_REPORT.md`
    ```markdown
    # Rapport Implémentation Parallèle — [Projet]

    ## Résumé
    - **Tickets totaux** : 12
    - **Réussis** : 11 | **Échoués** : 1 | **Bloqués** : 0
    - **Temps total** : 47 min
    - **Tokens totaux** : 127,000 (budget 150,000 → 85%)
    - **Vagues exécutées** : 4
    - **Parallélisme max** : 3 subagents

    ## Par ticket
    | Ticket | Titre | Vague | Itérations | Tokens | Temps | Verdict |
    |--------|-------|-------|------------|--------|-------|---------|
    | T-1 | Auth login | 1 | 1 | 8,200 | 3m | ✓ Approved |
    | T-2 | User profile | 1 | 2 | 12,500 | 8m | ✓ Approved |
    | T-3 | Payment | 2 | 1 | 15,000 | 12m | ✓ Approved |
    | T-4 | Admin dashboard | 3 | 3 | 22,000 | 18m | ✗ Rejected |

    ## Détails ticket échoué (T-4)
    - Critères non validés : "Export PDF", "Filtres avancés"
    - Problèmes : Architecture coupling, tests manquants
    - Recommandation : Re-designer en 2 tickets, relancer

    ## Métriques efficacité
    - **Tokens/ticket moyen** : 10,500
    - **Gain vs séquentiel** : ~3.2x plus rapide (4 vagues vs 12 séquentiel)
    - **Taux approval 1er passage** : 75%
    - **Subagents lancés** : 23 (12 impl + 11 review)

    ## Leçons apprises
    - Tickets > 8 SP → splitter avant lancement
    - Dépendances implicites détectées tard → améliorer step-01
    - Review subagent efficace pour catch Clean Code/SOLID
    ```

    **3. Nettoyage**
    - Archiver branches features merged
    - Nettoyer dossiers temporaires `_orcl/output/parallel-execution/` (garder rapports)
    - Mettre à jour backlog : tickets done → archivés
  </process>

  <output>Rapport final markdown + métriques JSON</output>
</step>