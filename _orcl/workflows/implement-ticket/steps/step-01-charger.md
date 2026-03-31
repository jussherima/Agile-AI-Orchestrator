<step order="1" name="charger">
  <objective>Comprendre le ticket avant de coder.</objective>

  <process>
    - Si un ticket est spécifié en argument → le lire
    - Sinon → chercher dans `_orcl/output/backlogs/` et proposer les tickets disponibles
    - Pour le ticket choisi, identifier :
      - **Quoi** : user story ou description
      - **Pourquoi** : contexte/problème résolu
      - **Critères d'acceptation** : conditions de "done"
      - **Dépendances** : autres tickets ou modules nécessaires
    - Si quelque chose est flou → STOP : poser la question AVANT de coder
  </process>

  <constraints>
    <do-not>Ne jamais commencer à coder sans avoir compris les critères d'acceptation.</do-not>
  </constraints>

  <next>Passer à step-02-planifier.md</next>
</step>
