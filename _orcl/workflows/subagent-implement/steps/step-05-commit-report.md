<step order="5" name="commit-report">
  <objective>Commit atomique + génération rapport JSON structuré pour l'agent principal.</objective>

  <process>
    **1. Commit atomique**
    ```bash
    git add -A
    git commit -m "feat(auth): implement login with email/password

    - Add AuthService with login/register methods
    - Add useAuth hook for state management
    - Add login form component with validation
    - Add unit + integration tests (85% coverage)

    Closes #T-1"
    ```

    **Format commit : Conventional Commits**
    - `feat(scope): description` pour features
    - `fix(scope): description` pour bugs
    - `refactor(scope): description` pour refactoring
    - Scope = feature name (auth, payment, user, etc.)

    **2. Push branche** (optionnel, pour review subagent)
    ```bash
    git push origin feature/T-1-auth-login
    ```

    **3. Générer rapport JSON** dans `output_dir/implementation-report.json`
    ```json
    {
      "ticket_id": "T-1",
      "status": "done",
      "branch": "feature/T-1-auth-login",
      "commit_sha": "abc123def",
      "files_changed": [
        "src/features/auth/services/auth.service.ts",
        "src/features/auth/hooks/useAuth.ts",
        "src/features/auth/components/LoginForm.tsx",
        "tests/unit/auth.service.test.ts",
        "tests/integration/auth.login.test.ts"
      ],
      "tests": {
        "unit": "pass",
        "integration": "pass",
        "coverage": "87%"
      },
      "criteria_mapping": [
        {"criterion": "User peut se logger avec email/mdp", "test": "should_login_when_valid_credentials"},
        {"criterion": "Erreur si identifiants invalides", "test": "should_show_error_when_invalid_credentials"}
      ],
      "token_cost": 8200,
      "duration_ms": 180000,
      "notes": "Utilisé pattern Repository existant pour AuthService"
    }
    ```

    **4. Token accounting**
    - Reporter tokens utilisés dans le rapport
    - Agent principal cumule pour budget global
  </process>

  <output>Commit done, rapport JSON généré</output>
</step>