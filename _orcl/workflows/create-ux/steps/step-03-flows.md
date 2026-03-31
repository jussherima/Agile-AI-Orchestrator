<step order="3" name="flows">
  <objective>Définir les user flows pour chaque parcours clé.</objective>

  <process>
    Pour chaque persona, identifier les parcours critiques puis les documenter :

    **Format user flow (texte, compatible Mermaid) :**
    ```
    [Point d'entrée] → [Action 1] → [Décision ?]
      → Oui → [Action 2] → [Succès]
      → Non → [Action alternative] → [Retour]
    ```

    **Parcours obligatoires :**
    - Inscription / Connexion (onboarding)
    - Parcours principal (la raison d'être de l'app)
    - Gestion de profil
    - Gestion d'erreur (cas d'échec)

    **Pour chaque flow :**
    - Nombre d'étapes (viser le minimum — chaque étape est un risque d'abandon)
    - Points de décision
    - Cas d'erreur et de retour
    - États de chargement
  </process>

  <next>Passer à step-04-architecture.md</next>
</step>
