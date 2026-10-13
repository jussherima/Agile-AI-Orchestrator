<step order="2" name="implement">
  <objective>Implémenter le code respectant Clean Code, SOLID, sécurité, architecture feature-first.</objective>

  <process>
    **1. Créer branche** `feature/T-{id}-{slug-titre}`
    ```bash
    git checkout -b feature/T-1-auth-login
    ```

    **2. Implémenter selon architecture feature-first**
    ```
    src/features/auth/
      ├── components/      # UI components
      ├── hooks/           # React hooks / business logic
      ├── services/        # API calls, external services
      ├── types/           # Types locaux (réutiliser shared-types)
      ├── utils/           # Helpers purs
      └── index.ts         # Public API
    ```

    **3. Règles Clean Code (non négociables)**
    - Fonctions < 20 lignes, 1 responsabilité
    - Noms explicites : `getUserById` pas `getUser`
    - Pas de magic numbers → constants nommées
    - Early returns, éviter nesting > 2 niveaux
    - DRY : extraire logique commune dans utils/hooks

    **4. Règles SOLID**
    - SRP : 1 classe/fonction = 1 raison de changer
    - OCP : ouvert extension, fermé modification (interfaces)
    - LSP : sous-types substituables
    - ISP : interfaces spécifiques > interfaces grosses
    - DIP : dépendre d'abstractions, pas implémentations

    **5. Sécurité (obligatoire)**
    - Input validation Zod/Yup sur TOUTES entrées (API, forms, params)
    - Pas de secrets en dur → env vars
    - Sanitization XSS sur outputs HTML
    - AuthZ checks sur chaque endpoint mutant
    - Rate limiting sur endpoints publics

    **6. Token optimization**
    - Écrire code direct, pas de commentaires explicatifs
    - Types TypeScript stricts (inférence quand possible)
    - Réutiliser patterns existants (copier-adapter depuis patterns/)
  </process>

  <output>Code implémenté sur branche feature</output>

  <next>step-03-test.md</next>
</step>