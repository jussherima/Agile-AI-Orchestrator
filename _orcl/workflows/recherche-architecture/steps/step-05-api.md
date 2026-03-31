<step order="5" name="api">
  <objective>Définir l'architecture API.</objective>

  <process>
    **Choix de l'approche :**
    - **Server Actions** (Next.js fullstack) : mutations simples, même repo
    - **REST API** : séparation front/back, multi-clients
    - **tRPC** : monorepo fullstack TypeScript, type-safe
    - **GraphQL** : données relationnelles complexes, multi-clients avec besoins différents

    **Si REST API :**
    - Versioning : `/api/v1/`
    - Naming : pluriel, kebab-case (`/api/v1/users`, `/api/v1/user-profiles`)
    - Méthodes : GET (lire), POST (créer), PUT/PATCH (modifier), DELETE (supprimer)
    - Pagination : `?page=1&limit=20` ou cursor-based
    - Filtering : `?status=active&role=admin`
    - Réponses standardisées :
    ```json
    { "data": {...}, "meta": { "page": 1, "total": 42 } }
    { "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
    ```

    **Si Server Actions (Next.js) :**
    - Un fichier actions.ts par feature
    - Validation avec Zod
    - Revalidation avec `revalidatePath()` / `revalidateTag()`

    **Lister les endpoints/actions :**
    Depuis le backlog, lister toutes les opérations CRUD par feature :
    | Feature | Opération | Méthode | Route / Action |
    |---------|-----------|---------|----------------|
    | Auth | Register | POST | /api/v1/auth/register |
    | Auth | Login | POST | /api/v1/auth/login |
    | Users | List | GET | /api/v1/users |
    | ... | ... | ... | ... |
  </process>

  <next>Passer à step-06-output.md</next>
</step>
