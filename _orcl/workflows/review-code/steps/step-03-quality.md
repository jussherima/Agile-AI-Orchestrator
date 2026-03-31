<step order="3" name="quality">
  <objective>Évaluer la qualité et la maintenabilité du code.</objective>

  <process>
    **Clean Code :**
    - [ ] Noms révélateurs d'intention
    - [ ] Fonctions courtes (≤ 20 lignes)
    - [ ] Max 2-3 paramètres par fonction
    - [ ] Un seul niveau d'abstraction par fonction
    - [ ] Pas d'effets de bord

    **SOLID :**
    - [ ] Single Responsibility respecté
    - [ ] Pas de God Class
    - [ ] Dépendances injectées (pas de `new` en dur)

    **Code Smells :**
    - [ ] Pas de code dupliqué
    - [ ] Pas de dead code
    - [ ] Pas de primitive obsession
    - [ ] Pas de message chains (Loi de Demeter)
    - [ ] Pas de feature envy

    **Architecture :**
    - [ ] Le code est au bon endroit (feature-first respecté)
    - [ ] Les couches sont respectées (pas de logique métier dans le controller)
    - [ ] Les patterns du projet sont suivis
  </process>

  <next>Passer à step-04-security.md</next>
</step>
