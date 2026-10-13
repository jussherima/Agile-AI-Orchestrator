# Sécurité & Performance — Référence Orchestral

## 1. OWASP Top 10

| # | Risque | Prévention |
|---|--------|------------|
| A01 | Broken Access Control | Contrôles serveur, deny by default, RBAC |
| A02 | Cryptographic Failures | TLS partout, algos modernes, pas de secrets en clair |
| A03 | Injection (SQL, XSS) | Requêtes paramétrées, ORM, validation input, encodage output |
| A04 | Insecure Design | Threat modeling, patterns sécurisés |
| A05 | Security Misconfiguration | Hardening, pas de config par défaut en prod |
| A06 | Vulnerable Components | Dépendances à jour, `npm audit`, Dependabot |
| A07 | Auth Failures | MFA, rate limiting, politique mots de passe |
| A08 | Integrity Failures | Signatures, vérification intégrité, CI/CD sécurisé |
| A09 | Logging & Monitoring | Logs structurés, alerting, audit trail |
| A10 | SSRF | Whitelist URLs, segmentation réseau |

## 2. Sécurité par design

### Input validation
- Allowlist > Blocklist
- Valider côté serveur TOUJOURS (client = bonus)
- Utiliser Zod, Pydantic, class-validator

### Authentication
- **JWT** : durée courte (15min access, 7j refresh), algorithme explicite, pas de données sensibles dans le payload
- **OAuth2** : PKCE obligatoire, redirect URI exacte
- **Mots de passe** : Argon2id (recommandé) ou bcrypt (min 10 rounds)

### Headers de sécurité
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (HSTS)

### Secrets
- JAMAIS dans le code ou le repo
- Variables d'environnement ou vault (HashiCorp Vault, AWS Secrets Manager)
- `.env` dans `.gitignore`

## 3. RGPD / Privacy by Design

- Minimisation des données
- Consentement explicite
- Droit à l'effacement
- Chiffrement au repos (AES-256) et en transit (TLS 1.3)
- Pseudonymisation des PII

## 4. Performance Web — Core Web Vitals

| Métrique | Bon | Mauvais |
|----------|-----|---------|
| **LCP** (Largest Contentful Paint) | < 2.5s | > 4s |
| **INP** (Interaction to Next Paint) | < 200ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | > 0.25 |

### Optimisations
- **Lazy loading** : images, composants below-the-fold
- **Code splitting** : par route, par feature
- **Cache** : browser (Cache-Control), CDN, API (Redis)
- **Images** : AVIF/WebP, responsive (`srcset`), compression
- **Bundle** : < 170 KB initial JS
- **DB** : éviter N+1, indexer les colonnes filtrées/triées/jointes

## 5. Performance mobile

- **Démarrage** : < 2s cold start
- **Mémoire** : éviter les leaks (listeners, subscriptions non dispose)
- **Batterie** : batching réseau, push > poll
- **Offline-first** : cache local, sync quand connecté
- **Réseau** : retry avec backoff, circuit breaker

## 6. Monitoring & Observabilité

### Logging
- Structuré (JSON)
- Niveaux : DEBUG, INFO, WARN, ERROR, FATAL
- Jamais de données sensibles dans les logs

### Error tracking
- Sentry (web/mobile), Crashlytics (mobile)
- Stack traces, breadcrumbs, user context

### Health checks
- **Liveness** : l'app est-elle vivante ? (`/health/live`)
- **Readiness** : l'app est-elle prête à recevoir du trafic ? (`/health/ready`)

### Alerting
- Basé sur les SLO (Service Level Objectives)
- Escalade progressive : Slack → PagerDuty → téléphone
