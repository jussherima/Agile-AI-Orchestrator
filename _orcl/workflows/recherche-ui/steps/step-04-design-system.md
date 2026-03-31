<step order="4" name="design-system">
  <objective>Recommander un design system et les fondations visuelles.</objective>

  <process>
    **Choix du design system de base** :
    - Flutter → Material Design 3 (natif)
    - React Native → Material ou Custom
    - React Web → Shadcn/UI, Ant Design, ou MUI selon le contexte
    - iOS natif → Apple HIG
    - Android natif → Material Design 3

    **Fondations à définir** :
    - **Couleurs** : primaire, secondaire, neutres, sémantiques (success, error, warning, info)
    - **Typographie** : échelle (Display → Label), familles, ratios
    - **Spacing** : grille 8px (4, 8, 16, 24, 32, 48, 64, 80)
    - **Breakpoints** : mobile (375), tablette (768), desktop (1024), large (1440)
    - **Elevation** : niveaux d'ombre (0-5)
    - **Border radius** : cohérent (ex: 4, 8, 12, 16, full)
    - **Iconographie** : bibliothèque recommandée

    **Critères de choix** :
    - Couverture des composants nécessaires
    - Accessibilité intégrée
    - Qualité de la documentation
    - Communauté et maintenance
    - Compatibilité avec la stack technique
  </process>

  <next>Passer à step-05-output.md</next>
</step>
