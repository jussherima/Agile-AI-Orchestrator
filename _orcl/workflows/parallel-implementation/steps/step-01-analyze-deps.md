<step order="1" name="analyze-deps">
  <objective>Charger le backlog, extraire dépendances, construire graphe DAG des tickets.</objective>

  <process>
    **1. Charger backlog** depuis `_orcl/output/backlogs/[nom]-backlog.md`
    - Parser tous les tickets avec : id, titre, priorité, dépendances, story points

    **2. Extraire dépendances explicites**
    - Champ `Depends on` ou `Dépendances` dans chaque ticket
    - Dépendances implicites : même epic, même composant technique

    **3. Construire graphe DAG**
    - Nœuds = tickets
    - Arêtes = dépendances (A → B signifie A avant B)
    - Détecter cycles → STOP si cycle

    **4. Calculer métriques par ticket**
    - Niveau topologique (profondeur dans le graphe)
    - Nombre de dépendants (combien de tickets attendent celui-ci)
    - Criticité = priorité × (1 + nb_dépendants)

    **5. Sauvegarder graphe** dans `_orcl/output/parallel-execution/graph.json`
    ```json
    {
      "tickets": [...],
      "edges": [{"from": "T-1", "to": "T-3"}],
      "levels": {"T-1": 0, "T-2": 0, "T-3": 1},
      "waves": [["T-1", "T-2"], ["T-3"]]
    }
    ```
  </process>

  <output>Graphe DAG validé, niveaux topologiques, vagues d'exécution identifiées</output>

  <next>step-02-plan-waves.md</next>
</step>