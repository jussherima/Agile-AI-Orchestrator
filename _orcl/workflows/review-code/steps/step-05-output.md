<step order="5" name="output">
  <objective>Produire le rapport de code review.</objective>

  <process>
    Présenter le rapport structuré :

    **Résumé :**
    - Verdict : APPROVED / CHANGES REQUESTED / BLOCKED
    - Nombre de problèmes par catégorie (bloquant, suggestion)

    **Problèmes bloquants (à corriger avant merge) :**
    Pour chaque problème :
    ```
    [fichier:ligne] — [catégorie]
    Problème : [description]
    Suggestion : [correction proposée]
    ```

    **Suggestions (non bloquantes) :**
    Préfixer par "Nit:" ou "Suggestion:"

    **Points positifs :**
    Souligner les bonnes pratiques observées.
  </process>

  <self-check>
    - Chaque problème a un fichier, une ligne, une description et une suggestion
    - Les bloquants sont clairement distingués des suggestions
    - La sécurité a été vérifiée
    - Le verdict est cohérent avec les problèmes trouvés
  </self-check>
</step>
