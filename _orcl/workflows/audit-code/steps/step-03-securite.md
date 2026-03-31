<step order="3" name="securite">
  <objective>Audit sécurité basé sur OWASP Top 10.</objective>

  <process>
    **A01 — Broken Access Control :**
    - [ ] Chaque route/endpoint a un contrôle d'accès
    - [ ] Pas d'IDOR (accès direct à des ressources par ID sans vérification)
    - [ ] CORS restrictif

    **A02 — Cryptographic Failures :**
    - [ ] HTTPS/TLS utilisé
    - [ ] Pas de données sensibles en clair dans le code/logs
    - [ ] Mots de passe hashés (Argon2id/bcrypt)

    **A03 — Injection :**
    - [ ] Requêtes paramétrées / ORM (pas de concaténation SQL)
    - [ ] Pas de `eval()`, `exec()`, `system()`
    - [ ] Output encoding pour prévenir XSS

    **A05 — Security Misconfiguration :**
    - [ ] Pas de config par défaut en prod (debug=true, etc.)
    - [ ] Headers de sécurité configurés

    **A06 — Vulnerable Components :**
    - Exécuter `npm audit` / `pip audit` / etc.
    - Vérifier les dépendances obsolètes

    **A07 — Auth Failures :**
    - [ ] Rate limiting sur login
    - [ ] Tokens avec durée de vie limitée
    - [ ] Pas de credentials en dur

    **Secrets :**
    - Scanner le code pour : API keys, passwords, tokens, private keys
    - Vérifier que `.env` est dans `.gitignore`
    - Vérifier l'historique git pour des secrets commités accidentellement

    Sévérité : 4 = critique (secret exposé, injection), 3 = majeur, 2 = mineur, 1 = cosmétique.
  </process>

  <next>Passer à step-04-performance.md</next>
</step>
