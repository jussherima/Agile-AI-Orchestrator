<step order="1" name="scope">
  <objective>Définir ce qu'on review.</objective>

  <process>
    - Si des fichiers/dossiers sont spécifiés → les lire
    - Si une PR est spécifiée → lire le diff (`git diff main...HEAD`)
    - Sinon → demander quoi reviewer
    - Identifier la stack et les conventions du projet
    - Compter les lignes modifiées (si > 400, signaler que la PR est trop grosse)
  </process>

  <output>
    "[N] fichiers, [M] lignes modifiées. Review en cours..."
  </output>

  <next>Passer à step-02-correctness.md</next>
</step>
