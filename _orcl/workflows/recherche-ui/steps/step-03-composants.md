<step order="3" name="composants">
  <objective>Identifier tous les composants UI nécessaires au projet.</objective>

  <process>
    Pour chaque écran identifié, lister les composants nécessaires :

    **Par catégorie** :
    - **Entrée** : boutons, champs texte, selects, checkboxes, radios, switches, sliders, date pickers, file upload
    - **Navigation** : app bar, tabs, bottom nav, drawer, breadcrumbs
    - **Affichage** : cards, listes, tableaux, badges, avatars, tooltips, progress bars, skeleton loaders, empty states
    - **Feedback** : toasts, snackbars, modals, alertes, spinners
    - **Overlay** : modals, drawers, popovers, bottom sheets

    **Pour chaque composant retenu** :
    - Variantes nécessaires (tailles, styles)
    - États requis (default, hover, focus, active, disabled, loading, error, success)
    - Justification par rapport aux écrans

    **Ne pas oublier** :
    - Empty states pour chaque liste/tableau
    - Loading states (skeleton)
    - Error states avec messages clairs
    - Onboarding / first-use states
  </process>

  <next>Passer à step-04-design-system.md</next>
</step>
