<step order="2" name="correctness">
  <objective>Vérifier que le code fait ce qu'il doit faire.</objective>

  <process>
    Pour chaque fichier modifié :

    **Logique :**
    - [ ] Le code fait ce que le ticket/contexte demande
    - [ ] Les cas limites sont gérés (null, vide, listes vides, overflow)
    - [ ] Les erreurs sont correctement gérées (try/catch, Result, Option)
    - [ ] Les conditions de bord sont testées
    - [ ] Pas de off-by-one, pas de boucles infinies

    **Tests :**
    - [ ] Des tests existent pour le nouveau code
    - [ ] Les tests couvrent le happy path ET les cas d'erreur
    - [ ] Les tests sont indépendants entre eux
    - [ ] Les noms de tests sont descriptifs

    Pour chaque problème trouvé, noter :
    - Fichier + ligne
    - Description du problème
    - Sévérité : bloquant / suggestion
    - Proposition de correction
  </process>

  <next>Passer à step-03-quality.md</next>
</step>
