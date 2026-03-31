<step order="4" name="architecture">
  <objective>Structurer l'architecture de l'information (sitemap).</objective>

  <process>
    **Créer le sitemap** :
    ```
    App
    ├── Accueil / Dashboard
    ├── Section 1
    │   ├── Sous-section 1.1
    │   └── Sous-section 1.2
    ├── Section 2
    │   └── ...
    ├── Profil / Paramètres
    └── Connexion / Inscription
    ```

    **Règles :**
    - Maximum 3 niveaux de profondeur (au-delà, les utilisateurs se perdent)
    - 3 à 5 sections principales en navigation (Hick : limiter les choix)
    - Nommer les sections avec le langage des utilisateurs, pas le jargon technique (Nielsen #2)
    - Regrouper par proximité fonctionnelle (Gestalt : proximité)

    **Vérifier :**
    - Chaque fonctionnalité du CDC a un emplacement dans le sitemap
    - Les parcours critiques (step précédent) sont réalisables dans cette architecture
    - Aucun contenu orphelin
  </process>

  <next>Passer à step-05-wireframes.md</next>
</step>
