<step order="3" name="auth">
  <objective>Définir la stratégie d'authentification et d'autorisation.</objective>

  <process>
    **Si pas d'auth nécessaire → passer au step suivant.**

    **Authentication :**
    - Méthode : email/password, OAuth (Google, GitHub), magic link
    - Solution selon la stack :
      - Next.js : Auth.js (NextAuth v5)
      - Flutter : Firebase Auth ou JWT custom
      - API : JWT (access + refresh token)
    - Stockage du token : httpOnly cookie (web) ou secure storage (mobile)

    **Authorization :**
    - Modèle : RBAC (Role-Based Access Control)
    - Rôles identifiés depuis le CDC (admin, user, guest, etc.)
    - Matrice de permissions : quel rôle accède à quoi
    - Implémentation :
      - Web : middleware Next.js / route guards
      - Mobile : navigation guards
      - API : middleware/decorator par route

    **Flow complet :**
    ```
    Register → Verify Email → Login → Access Token (15min) + Refresh Token (7j)
    → Protected Route → Check Token → If expired → Refresh → If invalid → Logout
    ```

    **Sécurité :**
    - Rate limiting sur login (5 tentatives/15min)
    - Password policy (min 8 chars, complexité)
    - CSRF protection (web)
    - Secure storage (mobile)
  </process>

  <next>Passer à step-04-state.md</next>
</step>
