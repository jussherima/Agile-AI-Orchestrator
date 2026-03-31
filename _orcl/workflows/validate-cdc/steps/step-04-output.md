<step order="4" name="output">
  <objective>Sauvegarder les artefacts et annoncer la suite.</objective>

  <process>
    - Sauvegarder le rapport dans `_orcl/_orcl/output/verifications/[nom-projet]-verification.md`
    - Si CDC valide : créer/mettre à jour `_orcl/_orcl/output/CDC-validated.md` avec le CDC nettoyé
  </process>

  <announce>
    - Si valide : "CDC validé. Lance `/orcl/workflow/create-tickets` pour le découpage."
    - Si invalide : "CDC non valide. Voici les questions à poser au client. Une fois les réponses obtenues, relance `/orcl/workflow/validate-cdc`."
  </announce>

  <self-check>
    Avant de terminer, vérifier :
    - Le rapport est bien sauvegardé dans _orcl/output/verifications/
    - Toutes les questions sont listées si le CDC est invalide
    - Le CDC-validated.md est créé si le CDC est valide
    - Le score est cohérent avec les verdicts individuels
  </self-check>
</step>
