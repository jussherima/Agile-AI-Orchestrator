<step order="1" name="prerequis">
  <objective>Vérifier tous les prérequis avant de toucher GitHub.</objective>

  <checks>
    - Un backlog doit exister dans `_orcl/_orcl/output/backlogs/`. Sinon → "Lance `/orcl/workflow/create-tickets`."
    - `gh auth status` doit être OK. Sinon → "Lance `gh auth login`."
    - Un repo GitHub cible doit être identifié. Sinon → demander lequel.
    - Le scope `project` doit être disponible. Sinon → "Lance `gh auth refresh -s read:project -s project`."
    - Vérifier que chaque story a passé la validation (INVEST + critères d'acceptation)
  </checks>

  <constraints>
    <do-not>Ne jamais créer d'issues sans avoir vérifié tous les prérequis.</do-not>
  </constraints>

  <next>Passer à step-02-labels.md</next>
</step>
