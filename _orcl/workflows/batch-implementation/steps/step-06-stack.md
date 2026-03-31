<step order="6" name="stack">
  <objective>Rechercher les best practices et packages pour la stack technique.</objective>

  <process>
    Exécuter le workflow `recherche-stack` en mode inline :

    **1. Identifier le framework** (depuis le step 01 intake)

    **2. Charger la référence interne :**
    - Vérifier `brain/stacks/` pour un document existant (ex: ORCL_NEXTJS.md, ORCL_FLUTTER.md)
    - Si existe → l'utiliser comme base de connaissances
    - Si n'existe pas → recherche web des best practices 2025

    **3. Documenter :**
    - Rendering / Data fetching patterns du framework
    - State management recommandé
    - Routing et navigation
    - Conventions spécifiques (naming, fichiers, patterns idiomatiques)
    - Performance spécifique au framework

    **4. Packages essentiels :**
    Sélectionner les packages pour chaque besoin du projet :
    UI, styling, forms, state, HTTP/API, ORM/DB, auth, validation, testing, linting

    **5. Structure de projet :**
    Feature-first + Clean Architecture adapté au framework

    **6. Générer les outputs :**
    - Sauvegarder dans `_orcl/output/dev/stack-[framework].md`
    - Créer `.claude/rules/stack-[framework].md` (rule dynamique qui guide tout le code)

    Annoncer : "✓ Stack [framework] documentée + rule créée. Architecture technique..."
  </process>

  <next>Passer à step-07-architecture.md</next>
</step>
