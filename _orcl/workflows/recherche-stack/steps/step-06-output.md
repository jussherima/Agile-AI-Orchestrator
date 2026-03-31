<step order="6" name="output">
  <objective>Générer le document de stack ET la rule Claude Code.</objective>

  <process>
    **1. Document de stack :**
    Sauvegarder dans `_orcl/output/dev/stack-[framework].md` :
    - Résumé de la stack
    - Best practices du framework
    - Packages avec versions
    - Structure de projet
    - Conventions
    - Anti-patterns à éviter

    **2. Rule dynamique :**
    Créer `.claude/rules/stack-[framework].md` avec les conventions qui doivent
    guider TOUT le code produit par l'agent. Format :

    ```markdown
    # Conventions [Framework]

    ## Structure
    [arborescence]

    ## Conventions de code
    [naming, imports, patterns]

    ## Packages obligatoires
    [liste avec versions]

    ## Patterns à suivre
    [patterns spécifiques au framework]

    ## Anti-patterns interdits
    [ce qu'il ne faut JAMAIS faire]
    ```

    Cette rule sera automatiquement chargée par Claude Code et guidera
    tout le code produit dans le projet.
  </process>

  <announce>
    "Stack [framework] documentée. Rule `.claude/rules/stack-[framework].md` créée.
    Tout le code produit suivra désormais ces conventions.
    Prochaine étape : `/orcl/dev/recherche-architecture` ou `/orcl/dev/implement-ticket`."
  </announce>

  <self-check>
    - Le document de stack est complet et sauvegardé
    - La rule est créée dans .claude/rules/
    - Les packages ont des versions spécifiées
    - La structure est adaptée au framework ET au projet
    - Les anti-patterns sont listés
  </self-check>
</step>
