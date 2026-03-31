<step order="1" name="analyser">
  <objective>Analyser le projet pour comprendre les besoins UI.</objective>

  <process>
    - Charger le CDC validé (`_orcl/output/CDC-validated.md`) ou le backlog
    - Si un rapport de standards existe (`_orcl/output/ux/standards-*.md`) → le charger
    - Identifier :
      - **Écrans/pages** nécessaires (lister toutes les vues)
      - **Rôles utilisateurs** (admin, utilisateur, visiteur...)
      - **Actions principales** par rôle
      - **Type de contenu** : formulaires, listes, dashboards, media, etc.
      - **Plateforme** : mobile, web, desktop, responsive
  </process>

  <output>
    Présenter la liste des écrans et actions identifiés. Confirmer avec l'utilisateur.
  </output>

  <next>Passer à step-02-navigation.md</next>
</step>
