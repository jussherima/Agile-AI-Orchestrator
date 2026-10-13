<step order="3" name="test">
  <objective>Écrire et exécuter tests unitaires + intégration couvrant CHAQUE critère d'acceptation.</objective>

  <process>
    **1. Mapping critères → tests**
    Pour CHAQUE critère d'acceptation (Given/When/Then) :
    - Créer test unitaire pour la logique métier (hook/service/util)
    - Créer test d'intégration pour le flux complet (API + DB + UI si applicable)

    **2. Structure tests**
    ```
    tests/
      ├── unit/
      │   ├── auth.service.test.ts      # Logique pure
      │   └── useAuth.test.ts           # Hook behavior
      └── integration/
          └── auth.login.test.ts        # Flux complet login
    ```

    **3. Standards tests**
    - AAA : Arrange, Act, Assert
    - Couverture ≥ 80% sur code nouveau
    - Noms : `should_{expectedBehavior}_when_{condition}`
    - Mocks minimaux : préférer vrais implémentations (DB test, MSW pour API)
    - Données de test : factories (pas de fixtures statiques)

    **4. Exécution**
    ```bash
    # Tests unitaires seulement (rapide)
    npm test -- --testPathPattern="unit" --coverage
    
    # Tests intégration (si config dispo)
    npm test -- --testPathPattern="integration"
    ```

    **5. Vérification critères**
    - Chaque critère d'acceptation a au moins 1 test qui le valide
    - Documenter mapping : `critère "User peut se logger" → test "should_login_when_valid_credentials"`

    **Token budget : ~3000 tokens**
    - Tests concis, pas de duplication
    - Réutiliser helpers de test existants
  </process>

  <output>Tests écrits, exécutés, couverture vérifiée, mapping critères↔tests</output>

  <next>step-04-auto-review.md</next>
</step>