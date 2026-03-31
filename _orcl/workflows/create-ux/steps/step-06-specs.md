<step order="6" name="specs">
  <objective>Rédiger les spécifications d'interaction et d'accessibilité.</objective>

  <process>
    **Spécifications d'interaction :**
    Pour chaque composant interactif, documenter :
    - Trigger (tap, swipe, long press, hover)
    - Comportement (que se passe-t-il ?)
    - Feedback (visuel, haptic, sonore)
    - Durée d'animation (recommandé : 200-300ms pour les transitions UI)
    - État résultant

    **Spécifications d'accessibilité :**
    - Ordre de tabulation pour chaque écran
    - Labels ARIA / semantic pour chaque composant
    - Alt-text pour les images et icônes
    - Comportement lecteur d'écran (ce qui est annoncé)
    - Navigation clavier (Tab, Enter, Escape, flèches)

    **Micro-interactions clés :**
    - Pull-to-refresh
    - Swipe to delete/archive
    - Loading → Content (skeleton → real data)
    - Success feedback (checkmark animation)
    - Error shake
  </process>

  <next>Passer à step-07-output.md</next>
</step>
