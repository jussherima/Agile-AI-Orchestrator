<step order="3" name="accessibilite">
  <objective>Vérifier la conformité WCAG AA.</objective>

  <process>
    **Checklist WCAG AA :**

    Perceptible :
    - [ ] Alt-text prévu pour toutes les images informatives
    - [ ] Contraste texte/fond ≥ 4.5:1 (texte normal) et ≥ 3:1 (grand texte)
    - [ ] Pas d'information transmise par la couleur seule
    - [ ] Sous-titres prévus pour le contenu audio/vidéo

    Utilisable :
    - [ ] Navigation clavier complète prévue
    - [ ] Focus visible défini
    - [ ] Ordre de tabulation logique documenté
    - [ ] Cibles tactiles ≥ 24×24 CSS px (WCAG 2.2 AA)
    - [ ] Pas de piège clavier
    - [ ] Délais suffisants ou ajustables

    Compréhensible :
    - [ ] Langage clair (pas de jargon)
    - [ ] Labels de formulaires explicites
    - [ ] Messages d'erreur clairs avec solution proposée
    - [ ] Comportement prévisible (pas de changement de contexte inattendu)

    Robuste :
    - [ ] Structure sémantique (headings H1-H6, landmarks)
    - [ ] Rôles ARIA documentés pour les composants custom
    - [ ] Compatible lecteur d'écran

    Pour chaque non-conformité, noter la sévérité (0-4).
  </process>

  <next>Passer à step-04-etats.md</next>
</step>
