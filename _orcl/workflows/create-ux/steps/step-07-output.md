<step order="7" name="output">
  <objective>Sauvegarder tous les livrables et présenter le résumé.</objective>

  <process>
    Créer dans `_orcl/output/ux/[nom-projet]/` :
    - `personas.md` — Les personas du projet
    - `user-flows.md` — Les parcours utilisateurs
    - `sitemap.md` — L'architecture de l'information
    - `wireframes.md` — Les wireframes textuels
    - `interaction-specs.md` — Les spécifications d'interaction et accessibilité
  </process>

  <announce>
    Présenter un tableau récapitulatif :
    - Nombre de personas
    - Nombre de flows documentés
    - Nombre d'écrans wireframés
    - Nombre de composants identifiés

    "Livrables UX créés. Lance `/orcl/ux/verify-ux` pour auditer et valider le design."
  </announce>

  <self-check>
    Avant de terminer :
    - Chaque persona est distinct et a un objectif clair
    - Chaque parcours critique a un user flow
    - Le sitemap couvre toutes les fonctionnalités du CDC
    - Chaque écran clé a un wireframe avec tous les états
    - Les spécifications d'accessibilité sont présentes
    - Tous les fichiers sont sauvegardés dans _orcl/output/ux/
  </self-check>
</step>
