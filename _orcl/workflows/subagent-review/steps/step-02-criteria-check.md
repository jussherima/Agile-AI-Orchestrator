<step order="2" name="criteria-check">
  <objective>Vérifier CHAQUE critère d'acceptation est implémenté ET testé.</objective>

  <process>
    **Pour CHAQUE critère d'acceptation (format Given/When/Then) :**

    1. **Identifier le test correspondant** via `criteria_mapping` du rapport implémentation
    2. **Lire le test** → comprendre ce qu'il valide exactement
    3. **Exécuter le test spécifique** :
       ```bash
       npm test -- --testNamePattern="should_login_when_valid_credentials"
       ```
    4. **Vérifier** : test passe ET couvre bien le critère (pas de faux positif)

    **Résultat par critère :**
    ```json
    {
      "criterion": "User peut se logger avec email/mdp",
      "test": "should_login_when_valid_credentials",
      "pass": true,
      "evidence": "Test passe, valide email + password + JWT retour",
      "gap": null
    }
    ```

    **Si critère SANS test mappé → GAP critique**
    - Marquer `pass: false`, `gap: "Aucun test ne valide ce critère"`
    - Verdict final ne peut pas être `approved`

    **Si test ÉCHOUÉ → GAP critique**
    - Marquer `pass: false`, `gap: "Test échoue: ..."`
    - Verdict final ne peut pas être `approved`
  </process>

  <output>Tableau vérification critères : tous pass ou gaps identifiés</output>

  <next>step-03-code-quality.md</next>
</step>