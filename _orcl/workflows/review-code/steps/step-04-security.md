<step order="4" name="security">
  <objective>Vérifier la sécurité du code (OWASP).</objective>

  <process>
    **Input/Output :**
    - [ ] Toutes les entrées utilisateur sont validées côté serveur
    - [ ] Les requêtes DB utilisent des requêtes paramétrées / ORM
    - [ ] Les outputs sont encodés selon le contexte (HTML, JS, URL)
    - [ ] Pas de `eval()`, `innerHTML` sans sanitisation, `dangerouslySetInnerHTML`

    **Auth & Access :**
    - [ ] Chaque endpoint a un contrôle d'accès
    - [ ] Les rôles/permissions sont vérifiés côté serveur
    - [ ] Les tokens ont une durée de vie limitée

    **Secrets :**
    - [ ] Pas de clés API, mots de passe, tokens en dur dans le code
    - [ ] Les secrets utilisent des variables d'environnement
    - [ ] `.env` est dans `.gitignore`

    **Données :**
    - [ ] Les données sensibles (PII) sont traitées avec précaution
    - [ ] Les mots de passe sont hashés (Argon2id ou bcrypt)
    - [ ] Pas de données sensibles dans les logs

    **Headers :**
    - [ ] CORS configuré de manière restrictive
    - [ ] Headers de sécurité présents (CSP, HSTS, X-Frame-Options)
  </process>

  <next>Passer à step-05-output.md</next>
</step>
