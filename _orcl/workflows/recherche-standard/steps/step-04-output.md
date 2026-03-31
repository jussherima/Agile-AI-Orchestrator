<step order="4" name="output">
  <objective>Sauvegarder le rapport de standards et annoncer la suite.</objective>

  <process>
    - Créer `_orcl/output/ux/standards-[nom-projet].md` avec :
      - Contexte du projet
      - Standards applicables (avec justification)
      - Checklist de règles concrètes
      - Métriques de vérification
      - Outils recommandés
  </process>

  <announce>
    "Standards identifiés. Prochaine étape : `/orcl/ux/recherche-ui` pour trouver les patterns UI adaptés, ou `/orcl/ux/create-ux` pour créer les livrables."
  </announce>

  <self-check>
    Avant de terminer :
    - Chaque standard est justifié par le contexte du projet
    - Les règles sont concrètes et mesurables (pas vagues)
    - L'accessibilité WCAG AA est toujours incluse
    - Le rapport est sauvegardé dans _orcl/output/ux/
  </self-check>
</step>
