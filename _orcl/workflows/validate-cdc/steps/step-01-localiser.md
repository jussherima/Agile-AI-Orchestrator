<step order="1" name="localiser">
  <objective>Trouver et charger le CDC à analyser.</objective>

  <process>
    - Si un fichier est spécifié en argument → le lire directement
    - Sinon → scanner `_orcl/client/specs/` et `_orcl/client/APK/`
    - Proposer les fichiers trouvés à l'utilisateur
    - Si aucun fichier → STOP : "Dépose ton cahier des charges dans `_orcl/client/specs/`"
  </process>

  <output>
    Annoncer : "CDC chargé : [nom]. Analyse en cours..."
  </output>

  <next>Passer à step-02-analyser.md</next>
</step>
