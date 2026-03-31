<step order="8" name="scaffold">
  <objective>Scaffolder la structure du projet.</objective>

  <process>
    **1. Initialiser le projet selon la stack :**
    - Flutter : `flutter create --org [org] [nom]`
    - React/Next.js : `npx create-next-app@latest [nom]`
    - Node/Express : `npm init -y` + structure manuelle
    - Autre : initialiser selon les conventions du framework

    **2. Configurer la structure feature-first :**
    ```
    src/ (ou lib/)
      core/           ← Shared: config, constants, utils, theme
      features/       ← Feature-first
        auth/
        home/
        [feature]/
          data/       ← Repository, models, data sources
          domain/     ← Entities, use cases
          presentation/ ← UI, controllers, state
      shared/         ← Composants partagés
    ```

    **3. Configurer les outils de qualité :**
    - Linter (ESLint, flutter_lints, pylint)
    - Formatter (Prettier, dart format, black)
    - `.gitignore` adapté à la stack
    - `.env.example` avec les variables nécessaires

    **4. Setup initial :**
    - Thème/design system de base (couleurs, typo, spacing depuis les patterns UI)
    - Navigation de base
    - Structure de dossiers pour chaque feature du backlog

    **5. Commit initial :**
    ```
    chore: scaffold project structure
    ```

    Annoncer : "✓ Projet scaffoldé. Implémentation des [N] tickets..."
  </process>

  <next>Passer à step-09-implement.md</next>
</step>
