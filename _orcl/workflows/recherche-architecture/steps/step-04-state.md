<step order="4" name="state">
  <objective>Définir le state management et l'error handling.</objective>

  <process>
    **State management :**
    Selon la stack documentée, définir :
    - **Server state** (données de l'API) : React Query, SWR, Riverpod AsyncValue
    - **Client state** (UI state) : Zustand, Jotai, Riverpod StateNotifier
    - **Form state** : react-hook-form + zod, reactive_forms

    Règle : séparer server state et client state. Ne jamais mettre les données API dans un store global.

    **Error handling architecture :**

    1. **Couche données** : catcher les erreurs techniques, les transformer en erreurs métier
    ```
    // Result pattern
    type Result<T> = { success: true, data: T } | { success: false, error: AppError }
    ```

    2. **Couche présentation** : afficher l'erreur à l'utilisateur
    - Error boundaries (React) ou error handlers (Flutter)
    - Messages user-friendly (pas de stack traces)
    - Actions de récupération (retry, retour, contact support)

    3. **Error reporting** :
    - Sentry pour le tracking
    - Logs structurés pour le debugging
    - Ne jamais logger de données sensibles

    **Types d'erreurs :**
    ```
    NetworkError      → "Connexion impossible. Vérifie ta connexion."
    AuthError         → Redirect vers login
    ValidationError   → Afficher inline sur le formulaire
    NotFoundError     → Page 404
    ServerError       → "Une erreur est survenue. Réessaye."
    ```
  </process>

  <next>Passer à step-05-api.md</next>
</step>
