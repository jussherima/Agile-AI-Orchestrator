<step order="1" name="scope">
  <objective>Définir ce qu'on audite.</objective>

  <process>
    - Si des fichiers/dossiers sont spécifiés → les scanner
    - Sinon → scanner tout le projet (`src/`, `lib/`, `app/`)
    - Détecter la stack, le framework, la structure
    - Identifier : nombre de fichiers, lignes de code, dépendances
    - Vérifier : linter configuré ? tests existants ? CI en place ?
  </process>

  <output>
    "Projet [stack] : [N] fichiers, [M] lignes. Audit en cours..."
  </output>

  <next>Passer à step-02-qualite.md</next>
</step>
