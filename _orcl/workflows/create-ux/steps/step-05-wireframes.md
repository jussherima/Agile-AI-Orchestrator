<step order="5" name="wireframes">
  <objective>Produire les wireframes textuels pour chaque écran clé.</objective>

  <process>
    Pour chaque écran identifié dans le sitemap, produire un wireframe textuel (ASCII/markdown) :

    **Format wireframe textuel :**
    ```
    ┌─────────────────────────────┐
    │ [App Bar: Titre + actions]  │
    ├─────────────────────────────┤
    │                             │
    │ [Section héro / Header]     │
    │                             │
    │ ┌─────┐ ┌─────┐ ┌─────┐   │
    │ │Card │ │Card │ │Card │   │
    │ │  1  │ │  2  │ │  3  │   │
    │ └─────┘ └─────┘ └─────┘   │
    │                             │
    │ [Liste / Contenu]           │
    │                             │
    ├─────────────────────────────┤
    │ [Bottom Nav: Tab1 Tab2 ...] │
    └─────────────────────────────┘
    ```

    **Pour chaque écran, documenter :**
    - Layout (disposition des éléments)
    - Hiérarchie visuelle (qu'est-ce qui est le plus important ?)
    - Composants utilisés (référencer le rapport patterns-ui)
    - Actions disponibles
    - États : default, vide, chargement, erreur

    **Écrans obligatoires :**
    - Splash / Onboarding
    - Écran principal (dashboard / home)
    - Chaque section de navigation
    - Formulaires clés
    - Écrans de succès et d'erreur
  </process>

  <next>Passer à step-06-specs.md</next>
</step>
