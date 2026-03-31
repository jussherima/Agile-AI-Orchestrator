<step order="6" name="review">
  <objective>Auto-review avant de commiter.</objective>

  <process>
    **Checklist de review :**
    - [ ] Le code fait ce que le ticket demande (critères d'acceptation)
    - [ ] Noms clairs et révélateurs d'intention
    - [ ] Fonctions courtes, une seule responsabilité
    - [ ] Pas de code dupliqué
    - [ ] Cas limites gérés (null, vide, erreurs)
    - [ ] Pas d'injection SQL/XSS, pas de secrets en dur
    - [ ] Input validation sur chaque entrée utilisateur
    - [ ] Tests présents et pertinents (≥ 80% couverture)
    - [ ] Pas de `console.log` / `print` de debug restants
    - [ ] Pas de TODO non documentés
    - [ ] Linter passe sans erreur

    **Exécuter :**
    - Linter : `npm run lint` / `flutter analyze` / etc.
    - Formatter : `npm run format` / `dart format .` / etc.
    - Build : vérifier que le projet compile

    **Si des problèmes sont trouvés → corriger avant de continuer.**
  </process>

  <next>Passer à step-07-commit.md</next>
</step>
