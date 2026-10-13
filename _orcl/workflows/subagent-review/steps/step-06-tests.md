<step order="6" name="tests">
  <objective>Exécuter et vérifier tous les tests du ticket.</objective>

  <process>
    **1. Exécuter tests unitaires du ticket**
    ```bash
    npm test -- --testPathPattern="tests/unit.*auth" --coverage
    ```
    - Tous passent ? → OK
    - Échecs → issue blocker par test échoué
    - Couverture < 80% sur nouveaux fichiers → issue major

    **2. Exécuter tests d'intégration du ticket**
    ```bash
    npm test -- --testPathPattern="tests/integration.*auth"
    ```
    - Tous passent ? → OK
    - Échecs → issue blocker
    - Si pas de config integration → note (pas bloquant si unitaires OK)

    **3. Vérifier mapping critères ↔ tests (depuis step-02)**
    - Chaque critère a test passant → OK
    - Critères sans test → gap critique (déjà détecté step-02)

    **4. Qualité tests**
    - Tests non flaky (pas de timing, pas de random)
    - Mocks appropriés (pas de sur-mocking)
    - Noms descriptifs (AAA pattern)
    - Données de test via factories

    **5. Regression check rapide**
    - Exécuter tests existants liés (si feature touche code existant)
    - `npm test -- --testPathPattern="auth"` (tous tests auth)

    **Format issues :** severity blocker pour tests échoués, major pour couverture faible
  </process>

  <output>Résultats tests, couverture, mapping validé</output>

  <next>step-07-verdict.md</next>
</step>