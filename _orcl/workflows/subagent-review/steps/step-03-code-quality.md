<step order="3" name="code-quality">
  <objective>Review qualité code : Clean Code, SOLID, conventions, TypeScript strict.</objective>

  <process>
    **Analyser diff + fichiers changés pour :**

    **Clean Code**
    - Fonctions > 20 lignes → issue major
    - Noms non explicites (`data`, `temp`, `handle`) → issue minor
    - Magic numbers/strings → issue minor
    - Nesting > 2 niveaux → issue major
    - Code dupliqué (3+ occurrences) → issue major
    - Commentaires explicatifs au lieu de code clair → issue minor

    **SOLID**
    - Classe/fonction avec multiples responsabilités → issue major
    - Modification code existant pour nouvelle feature (vs extension) → issue major
    - Héritage mal utilisé (LSP) → issue major
    - Interface trop large (ISP) → issue minor
    - Dépendance concrète au lieu abstraction (DIP) → issue major

    **TypeScript**
    - `any` explicite sans justification → issue blocker
    - Types `unknown` non narrowés → issue major
    - Props React non typées → issue major
    - Retour de fonction non typé (inférence insuffisante) → issue minor

    **Conventions**
    - Imports non triés → issue minor
    - Nommage incohérent vs conventions.md → issue minor
    - Fichier > 300 lignes → suggestion split

    **Format issues :**
    ```json
    {
      "severity": "blocker|major|minor",
      "file": "src/features/auth/services/auth.service.ts",
      "line": 42,
      "rule": "function-length",
      "message": "Fonction login() fait 45 lignes (max 20). Extraire validation + token generation.",
      "suggestion": "Créer validateCredentials() et generateTokens() privés"
    }
    ```
  </process>

  <output>Liste issues qualité code classifiées par sévérité</output>

  <next>step-04-architecture.md</next>
</step>