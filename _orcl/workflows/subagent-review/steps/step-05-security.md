<step order="5" name="security">
  <objective>Review sécurité : input validation, authZ, secrets, XSS, rate limiting.</objective>

  <process>
    **Vérifier sur CHAQUE endpoint/entrée utilisateur :**

    **Input Validation (obligatoire)**
    - Schema Zod/Yup sur TOUS inputs (body, query, params, headers)
    - Validation stricte : types, formats, longueurs, enum values
    - Pas de `any` dans schemas → issue blocker
    - Sanitization strings (trim, escape) → vérifié

    **Authorization (AuthZ)**
    - Middleware auth sur TOUTES routes mutantes (POST/PUT/DELETE/PATCH)
    - Vérification ownership/resource access (user ne modifie que ses ressources)
    - Role-based access si applicable (admin vs user)
    - Pas de logique AuthZ dans composants → issue major

    **Secrets Management**
    - AUCUN secret en dur (API keys, DB passwords, JWT secrets)
    - Tous via `process.env` + validation startup
    - `.env.example` à jour → vérifié

    **XSS Prevention**
    - Outputs HTML : sanitization (DOMPurify ou framework auto-escape)
    - `dangerouslySetInnerHTML` → absent ou justifié + sanitized
    - CSP headers configurés → vérifié

    **Rate Limiting / DoS**
    - Endpoints publics (auth, register, password reset) → rate limited
    - Endpoints coûteux (search, export, upload) → rate limited + pagination
    - Pas de boucles non bornées sur input utilisateur

    **Autres**
    - SQL injection : ORM/parameterized queries seulement
    - Path traversal : validation paths upload
    - CSRF : SameSite cookies + CSRF tokens si forms

    **Format issues :** même format, severity = blocker pour validation/authZ manquants
  </process>

  <output>Liste issues sécurité</output>

  <next>step-06-tests.md</next>
</step>