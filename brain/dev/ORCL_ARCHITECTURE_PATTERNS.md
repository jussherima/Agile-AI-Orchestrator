# Patterns d'Architecture Technique - Referentiel 2025

> Base de connaissances pour l'agent Orchestral. Ce document sert de reference
> pour les decisions et la documentation d'architecture technique d'un projet.

---

## Table des matieres

1. [Clean Architecture adaptee au Frontend](#1-clean-architecture-adaptee-au-frontend)
2. [API Design Patterns](#2-api-design-patterns)
3. [Database Patterns](#3-database-patterns)
4. [Auth Architecture](#4-auth-architecture)
5. [Error Handling Architecture](#5-error-handling-architecture)
6. [Caching Strategies](#6-caching-strategies)
7. [Monorepo Architecture](#7-monorepo-architecture)

---

## 1. Clean Architecture adaptee au Frontend

### 1.1 Principe fondamental

La regle d'or : **les couches internes ne dependent jamais des couches externes**. La logique metier ne doit pas savoir si les donnees viennent de Firebase, SQLite ou d'une API REST.

Le flux de donnees est **unidirectionnel** : les donnees remontent de la couche Data vers la Presentation via le Domain, tandis que les evenements utilisateur descendent en sens inverse.

### 1.2 Les trois couches

#### Data Layer (Couche Donnees)

**Responsabilite** : Acces aux sources de donnees, transformation des donnees brutes en modeles du domaine.

**Composants** :
- **Models / DTOs** : Classes specifiquement concues pour la deserialisation/serialisation (JSON, protobuf). Connaissent le format de transport, PAS la logique metier.
- **Data Sources** :
  - `RemoteDataSource` : Appels HTTP, WebSocket, GraphQL
  - `LocalDataSource` : SQLite, SharedPreferences, Hive, IndexedDB, localStorage
- **Repositories (implementation)** : Source de verite pour les donnees du modele. Responsables de :
  - Interroger les data sources
  - Transformer les DTOs en entites du domaine (via des mappers)
  - Gerer la strategie de cache (local-first, remote-first, stale-while-revalidate)

```
data/
  models/          # DTOs / modeles de serialisation
  datasources/
    remote/        # Appels API
    local/         # Base locale, cache
  repositories/    # Implementation des interfaces du domain
  mappers/         # DTO <-> Entity
```

#### Domain Layer (Couche Metier)

**Responsabilite** : Regles metier pures, aucune dependance framework.

**Composants** :
- **Entities** : Objets metier purs. Pas d'annotations framework, pas de serialisation. Representent les concepts fondamentaux du domaine.
- **Use Cases (Interactors)** : Encapsulent UNE action metier specifique. Orchestrent les appels aux repositories. Un use case = une intention utilisateur.
- **Repository Interfaces** : Contrats abstraits que la couche Data doit implementer (Dependency Inversion).

```
domain/
  entities/            # Objets metier purs
  usecases/            # Un fichier par use case
  repositories/        # Interfaces (abstractions)
  value_objects/       # Types valeur immutables (Email, Price...)
```

**Regle stricte** : Le domain layer ne doit importer AUCUN package UI, HTTP ou librairie externe. C'est du Dart/TypeScript pur.

#### Presentation Layer (Couche Presentation)

**Responsabilite** : UI, gestion d'etat, controleurs.

**Composants** :
- **UI / Widgets / Components** : Affichage pur, le moins de logique possible
- **State Management / ViewModel** : Logique d'UI (pas metier), transformation des donnees pour l'affichage
- **Controllers** : Orchestrent les use cases depuis les interactions UI

**Pattern MVVM recommande** :
- **Model** = Entites du domaine
- **ViewModel** = Logique d'UI, etat reactif
- **View** = Composants visuels purs

```
presentation/
  pages/          # Ecrans / routes
  widgets/        # Composants reutilisables
  controllers/    # ou viewmodels/
  state/          # Gestion d'etat
```

### 1.3 Adaptation par framework

#### Next.js (React)

```
src/
  app/                    # App Router (entry points, routes)
  presentation/
    components/           # React components
    hooks/                # Custom hooks (state, UI logic)
  domain/
    entities/
    usecases/
    repositories/         # Interfaces
  infrastructure/
    api/                  # HTTP clients, fetch wrappers
    repositories/         # Implementation des interfaces
    storage/              # localStorage, cookies
```

- Les **Server Components** jouent le role de controleurs : ils appellent les use cases et passent les donnees aux composants presentationnels.
- Les **Client Components** gerent les interactions et l'etat local.
- **Dependency Injection** : Utiliser un pattern d'injection (contexte React, ou librairies comme `tsyringe`, `inversify`) pour connecter UseCase et Repository via interfaces.

#### Flutter

```
lib/
  core/                   # Utils partages, erreurs, constantes
  features/
    auth/
      data/
        models/
        datasources/
        repositories/
      domain/
        entities/
        usecases/
        repositories/
      presentation/
        pages/
        widgets/
        bloc/             # ou riverpod/
```

- **BLoC** : Separation forte event -> state, predictible, ideal pour les gros projets.
- **Riverpod** : Moderne, compile-safe, pas de dependance BuildContext, recommande en 2025 pour les nouveaux projets.
- Le decoupage par **feature** est prefere au decoupage par couche technique pour les projets de taille moyenne a grande.

#### React (SPA classique)

Meme structure que Next.js mais sans la couche `app/`. Les hooks custom servent de ViewModel. React Query ou SWR gerent le cache et l'etat serveur, decouplant la presentation de la couche data.

### 1.4 Benefices mesurables

| Benefice | Impact |
|---|---|
| Changement de provider API | Ne touche que l'infrastructure layer |
| Changement de state management | Ne touche que la presentation |
| Tests unitaires metier | Testables sans framework, sans mock HTTP |
| Onboarding developpeur | Structure previsible et documentee |

---

## 2. API Design Patterns

### 2.1 REST - Bonnes pratiques

#### Nommage des ressources
- Utiliser des **noms** au pluriel : `/users`, `/orders`, `/products`
- Hierarchie pour les relations : `/users/{id}/orders`
- Pas de verbes dans l'URL (le verbe HTTP suffit)
- kebab-case pour les segments : `/order-items`

#### Verbes HTTP
| Verbe | Usage | Idempotent |
|---|---|---|
| GET | Lecture | Oui |
| POST | Creation | Non |
| PUT | Remplacement complet | Oui |
| PATCH | Mise a jour partielle | Non |
| DELETE | Suppression | Oui |

#### Versioning
- **URL path** (recommande pour la simplicite) : `/api/v1/users`
- **Header** (plus propre semantiquement) : `Accept: application/vnd.api+json;version=1`
- Strategie : maintenir max 2 versions simultanees, deprecier explicitement.

#### Pagination
```
GET /users?page=2&limit=20
GET /users?cursor=abc123&limit=20   # cursor-based (recommande pour les gros volumes)
```
Reponse standardisee :
```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "hasNext": true
  }
}
```

#### Filtrage et tri
```
GET /products?category=electronics&price_min=10&price_max=100
GET /products?sort=-created_at,name    # - pour descendant
GET /products?fields=id,name,price     # sparse fieldsets
```

#### Codes de reponse standardises
| Code | Usage |
|---|---|
| 200 | Succes (GET, PUT, PATCH) |
| 201 | Cree (POST) |
| 204 | Succes sans contenu (DELETE) |
| 400 | Requete invalide |
| 401 | Non authentifie |
| 403 | Non autorise |
| 404 | Ressource non trouvee |
| 409 | Conflit |
| 422 | Entite non traitable (validation) |
| 429 | Trop de requetes |
| 500 | Erreur serveur |

### 2.2 GraphQL - Quand preferer a REST

#### Cas d'utilisation ideaux
- **UI complexes avec des besoins de donnees variables** : Dashboards, interfaces riches ou chaque composant demande des donnees differentes
- **Aggregation de donnees multi-sources** : Un seul endpoint pour combiner des donnees de plusieurs services
- **Applications mobiles** : Minimiser les allers-retours reseau (un seul appel au lieu de 5)
- **Equipes frontend/backend desynchronisees** : Le frontend evolue son schema de requete sans modifier le backend

#### Quand NE PAS utiliser GraphQL
- CRUD simple avec des entites bien definies (REST suffit)
- API publique pour des tiers (REST est mieux documente, plus adopte)
- Equipe sans experience GraphQL (courbe d'apprentissage)
- **Attention au probleme N+1** : Sur 50 users avec leurs posts et commentaires, un resolver naif peut declencher 500+ requetes SQL. Solutions : DataLoader, joins explicites.

### 2.3 tRPC - Quand l'utiliser

#### Contexte ideal
- **Monorepo fullstack TypeScript** (Next.js, Remix, SvelteKit)
- Le client et le serveur partagent le meme depot de code
- Besoin de **type-safety end-to-end** sans generation de code
- L'equipe est 100% TypeScript

#### Avantages
- Zero schema a maintenir (les types sont inferes du backend)
- Autocompletion et verification de types instantanees
- Bundle tres leger (~negligeable)
- Adoption en forte croissance : 15% des offres fullstack JS en 2026, tendance haussiere

#### Quand NE PAS utiliser tRPC
- API consommee par des clients non-TypeScript (mobile natif, services Python...)
- API publique pour des tiers
- Equipe polyglotte (backend Go/Python, frontend React)

### 2.4 Server Actions (Next.js) - Quand remplacent-elles une API

#### Ce que c'est
Des fonctions serveur appelables directement depuis les composants React. Pas de route API, pas de fetch manuel.

#### Quand les utiliser
- **Mutations liees a un formulaire** : Soumission, validation, creation
- **Actions simples liees a un seul composant** : Like, bookmark, toggle
- **Progressive enhancement** : Fonctionne meme sans JavaScript cote client

#### Quand preferer une API classique (tRPC, REST)
- **Mutations reutilisees** dans plusieurs composants ou contextes
- **Logique complexe** necessitant une orchestration
- **Appels depuis du code client** hors soumission de formulaire
- **Besoin de consommer l'API depuis d'autres clients** (mobile, services tiers)

### 2.5 Arbre de decision API

```
Le client est-il TypeScript dans le meme monorepo ?
  OUI -> tRPC (+ Server Actions pour les forms simples)
  NON ->
    Les besoins de donnees sont-ils tres variables par ecran ?
      OUI -> GraphQL
      NON -> REST
    L'API est-elle publique ?
      OUI -> REST (+ OpenAPI/Swagger)
```

---

## 3. Database Patterns

### 3.1 ORM Patterns

#### Active Record

L'entite elle-meme contient les methodes de persistence (`save()`, `find()`, `delete()`).

```typescript
// Active Record (TypeORM)
const user = new User();
user.name = "Alice";
await user.save();
const found = await User.findOneBy({ id: 1 });
```

**Avantages** : Simple, rapide pour le prototypage, peu de boilerplate.
**Inconvenients** : Melange responsabilites metier et persistence, testabilite reduite, couplage fort.
**Quand l'utiliser** : CRUD simple, prototypes, petits projets.

#### Data Mapper

L'entite est un objet pur. Un repository separe gere la persistence.

```typescript
// Data Mapper (Prisma, MikroORM)
const user = { name: "Alice" }; // objet pur
await userRepository.save(user);
const found = await userRepository.findById(1);
```

**Avantages** : Separation des responsabilites, testable, compatible Clean Architecture.
**Inconvenients** : Plus de boilerplate, courbe d'apprentissage.
**Quand l'utiliser** : Projets avec logique metier complexe, besoin de tests, Clean Architecture.

### 3.2 Comparatif ORM Node.js (2025)

| Critere | Prisma | Drizzle | TypeORM |
|---|---|---|---|
| **Approche** | Schema-first (.prisma) | Code-first (TypeScript) | Decorators/Classes |
| **Pattern** | Data Mapper | Data Mapper | Active Record + Data Mapper |
| **Type Safety** | Excellente (client genere) | Excellente (schema TS natif) | Correcte (decorators) |
| **Performance** | Bonne (Prisma 7 : moteur Rust supprime, natif Node) | Excellente (leger, zero dep binaire, ~7kb) | Moyenne |
| **Bundle size** | Moyen (client genere) | Minimal (~7kb min+gzip) | Lourd |
| **Migrations** | `prisma migrate` (auto depuis schema) | Generation SQL depuis schema TS | CLI migrations |
| **Edge/Serverless** | Prisma 7 ameliore | Ideal (zero cold start) | Non recommande |
| **Ecosysteme** | Tres riche (Prisma Studio, Accelerate) | Croissant | Mature mais vieillissant |
| **Courbe apprent.** | Facile | Moyenne (proche SQL) | Moyenne |

#### Recommandations par contexte

| Contexte | ORM recommande |
|---|---|
| MVP / startup early-stage | **Prisma** (velocite, DX, migrations simples) |
| Edge / Serverless / Lambda | **Drizzle** (zero cold start, bundle minimal) |
| Gros projet, DDD, logique metier riche | **MikroORM** (Data Mapper, Unit of Work) |
| Projet legacy / migration | **TypeORM** (si deja en place) |
| Besoin de SQL fin et performant | **Drizzle** (proche du SQL, controle total) |

### 3.3 Comparatif bases locales Flutter (2025)

| Critere | Drift | Isar |
|---|---|---|
| **Type** | ORM SQLite (relationnel) | NoSQL natif |
| **Type Safety** | Compile-time (SQL type-safe) | Oui |
| **Performance** | Bonne, stable en production | Tres rapide sur gros volumes |
| **API reactive** | Oui (streams) | Oui (watchers) |
| **Migrations** | Supportees nativement | Schema auto-migre |
| **Maintenance** | Active, sponsorise par Stream | Pas de mise a jour depuis 2+ ans (version communautaire existe) |
| **Full-text search** | Via FTS5 SQLite | Natif |

**Recommandation 2025** : **Drift** comme choix par defaut (maintenance active, stabilite, documentation riche). Isar uniquement pour des workloads NoSQL specifiques avec de gros volumes indexes.

### 3.4 Migration Strategies

#### Principes
1. **Toujours versionner les migrations** dans le depot Git
2. **Jamais de modification d'une migration deja executee** en production
3. **Migrations reversibles** quand possible (up + down)
4. **Migrations atomiques** : une migration = un changement logique
5. **Tests de migration** sur une copie de la base de production

#### Workflow type
```
1. Modifier le schema (Prisma schema ou code Drizzle)
2. Generer la migration : prisma migrate dev / drizzle-kit generate
3. Review de la migration SQL generee
4. Appliquer en dev : prisma migrate dev / drizzle-kit push
5. Tester
6. Appliquer en prod : prisma migrate deploy (CI/CD)
```

### 3.5 Seeding

#### Principes
- **Seed deterministe** : meme resultat a chaque execution (idempotent)
- **Separer** seed de dev (donnees riches) et seed de prod (donnees de reference)
- **Utiliser des factories** pour generer des donnees realistes (faker)

```typescript
// Prisma seed example (prisma/seed.ts)
async function main() {
  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', permissions: ['*'] },
  });
  // Dev-only seeds
  if (process.env.NODE_ENV !== 'production') {
    await createFakeUsers(50);
  }
}
```

---

## 4. Auth Architecture

### 4.1 Session-based vs Token-based

| Critere | Session-based | Token-based (JWT) |
|---|---|---|
| **Stockage** | Serveur (DB/Redis) | Client (cookie/localStorage) |
| **Scalabilite** | Requiert session store partage | Stateless, scale horizontalement |
| **Revocation** | Facile (supprimer la session) | Complexe (necessite blacklist) |
| **Performance** | Lookup DB a chaque requete | Verification signature locale |
| **CSRF** | Vulnerable (necesssite token CSRF) | Immunise si dans header Auth |
| **XSS** | Protege si cookie httpOnly | Vulnerable si localStorage |

#### Quand utiliser quoi

| Contexte | Recommandation |
|---|---|
| App web classique (SSR) | **Session-based** (plus simple, revocation facile) |
| SPA + API | **JWT** (stateless, adapte aux microservices) |
| Mobile natif | **JWT** (pas de cookies natifs) |
| Microservices | **JWT** (verification sans appel central) |
| Besoin de revocation immediate | **Session-based** ou JWT + blacklist Redis |

### 4.2 JWT + Refresh Token - Flow complet

```
1. LOGIN
   Client -> POST /auth/login { email, password }
   Serveur -> Verifie credentials
           -> Genere access_token (JWT, expire 15min)
           -> Genere refresh_token (opaque, expire 7j, stocke en DB)
           -> Retourne { access_token } + Set-Cookie: refresh_token (httpOnly, secure, sameSite)

2. REQUETE AUTHENTIFIEE
   Client -> GET /api/resource
             Header: Authorization: Bearer <access_token>
   Serveur -> Verifie signature JWT
           -> Verifie expiration
           -> Extrait claims (userId, roles)
           -> Traite la requete

3. TOKEN EXPIRE
   Client -> Recoit 401
          -> POST /auth/refresh (cookie refresh_token envoye automatiquement)
   Serveur -> Verifie refresh_token en DB
           -> Verifie qu'il n'est pas revoque
           -> ROTATION : Genere nouveau access_token + nouveau refresh_token
           -> Revoque l'ancien refresh_token
           -> Retourne nouveau access_token + Set-Cookie nouveau refresh_token

4. LOGOUT
   Client -> POST /auth/logout
   Serveur -> Revoque le refresh_token en DB
           -> Clear le cookie
```

#### Securite critique
- **Access token** : Courte duree (15 min), en memoire JS (pas localStorage)
- **Refresh token** : Longue duree, cookie httpOnly + Secure + SameSite=Strict
- **Rotation des refresh tokens** : A chaque utilisation, revoquer l'ancien et emettre un nouveau
- **Detection de reutilisation** : Si un refresh token revoque est presente, revoquer TOUTE la famille de tokens (compromission probable)

### 4.3 OAuth2 / OpenID Connect

#### Les standards
- **OAuth 2.0** : Framework d'autorisation ("qu'est-ce que tu peux faire ?")
- **OpenID Connect (OIDC)** : Couche d'authentification au-dessus d'OAuth 2.0 ("qui es-tu ?")
- **JWT** : Format de token utilise pour representer identite et acces

#### Flow recommande : Authorization Code + PKCE

```
1. Client genere code_verifier (random) + code_challenge (SHA256)
2. Client -> Redirect vers Authorization Server
   /authorize?response_type=code&client_id=X&redirect_uri=Y&code_challenge=Z&scope=openid profile
3. Utilisateur s'authentifie aupres du provider (Google, Auth0, etc.)
4. Authorization Server -> Redirect vers client avec ?code=ABC
5. Client -> POST /token { code=ABC, code_verifier=original }
6. Authorization Server -> Verifie code_verifier vs code_challenge
   -> Retourne { access_token, id_token, refresh_token }
```

**PKCE est obligatoire** pour les SPA et apps mobiles (pas de client_secret cote client).

#### Quand utiliser OAuth2/OIDC
- Connexion via providers externes (Google, GitHub, Microsoft)
- SSO d'entreprise
- Delegation d'acces a des APIs tierces
- Architecture microservices avec un Identity Provider centralise

### 4.4 RBAC (Role-Based Access Control)

#### Modele de donnees

```
User (1) --- (*) UserRole (*) --- (1) Role (1) --- (*) RolePermission (*) --- (1) Permission
```

```typescript
// Entites
interface Permission {
  id: string;
  resource: string;    // "article", "user", "order"
  action: string;      // "create", "read", "update", "delete"
}
interface Role {
  id: string;
  name: string;        // "admin", "editor", "viewer"
  permissions: Permission[];
}
```

#### Pattern Middleware / Guard

**Next.js Middleware** (route-level) :
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const user = verifyToken(token);

  const requiredRole = getRequiredRole(request.nextUrl.pathname);
  if (requiredRole && !user.roles.includes(requiredRole)) {
    return NextResponse.redirect('/unauthorized');
  }
}
export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
```

**NestJS Guard** (controller-level) :
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const user = context.switchToHttp().getRequest().user;
    return requiredRoles.some(role => user.roles.includes(role));
  }
}

// Usage
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
deleteUser() { ... }
```

#### Principes RBAC
1. **Default Deny** : Bloquer par defaut si aucune regle ne correspond
2. **Centraliser** la logique RBAC en un seul endroit
3. **Audit logs** : Tracer les tentatives non autorisees
4. **Heritage de roles** : Un admin herite des permissions d'editeur qui herite de lecteur

---

## 5. Error Handling Architecture

### 5.1 Error Boundaries (React)

Les Error Boundaries sont des composants React (obligatoirement des class components) qui interceptent les erreurs JavaScript dans leur arbre de composants enfants.

```typescript
// Utilisation avec react-error-boundary (recommande)
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Quelque chose s'est mal passe :</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Reessayer</button>
    </div>
  );
}

// Strategie : Error Boundaries granulaires
<ErrorBoundary FallbackComponent={ErrorFallback}>       {/* App-level */}
  <Layout>
    <ErrorBoundary FallbackComponent={SectionError}>    {/* Section-level */}
      <Dashboard />
    </ErrorBoundary>
  </Layout>
</ErrorBoundary>
```

**Limitations** : Les Error Boundaries ne capturent PAS les erreurs dans :
- Les event handlers (utiliser try/catch classique)
- Le code asynchrone (promises non rattrapees)
- Le Server-Side Rendering

### 5.2 Result / Either Pattern (Fonctionnel)

Pattern inspire de Rust et Haskell. Au lieu de `throw`, retourner un objet qui represente explicitement le succes ou l'echec.

```typescript
// Avec la librairie neverthrow
import { ok, err, Result } from 'neverthrow';

type CreateUserError = 'EMAIL_EXISTS' | 'INVALID_EMAIL' | 'WEAK_PASSWORD';

function createUser(data: CreateUserDTO): Result<User, CreateUserError> {
  if (!isValidEmail(data.email)) return err('INVALID_EMAIL');
  if (await emailExists(data.email)) return err('EMAIL_EXISTS');
  const user = new User(data);
  return ok(user);
}

// Usage - le compilateur FORCE la gestion de l'erreur
const result = createUser(dto);
result.match(
  (user) => console.log(`Utilisateur cree : ${user.id}`),
  (error) => {
    switch (error) {
      case 'EMAIL_EXISTS': return res.status(409).json({ message: 'Email deja utilise' });
      case 'INVALID_EMAIL': return res.status(422).json({ message: 'Email invalide' });
    }
  }
);
```

**Avantages** :
- **Type-safe** : Le compilateur force la gestion de chaque cas d'erreur
- **Explicite** : La signature de la fonction documente les erreurs possibles
- **Composable** : Chainable avec `.map()`, `.andThen()`, `.orElse()`

**Librairies TypeScript** : `neverthrow` (recommande pour debuter), `Effect` (plus complet, plus complexe), `ts-results`

**Quand l'utiliser** : Couche Domain et Use Cases. Ne pas forcement l'appliquer partout (les event handlers et le code UI peuvent rester en try/catch).

### 5.3 Global Error Handler

#### Backend (Express/NestJS)
```typescript
// Middleware global d'erreur (Express)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // 1. Logger l'erreur technique
  logger.error({ err, requestId: req.id, path: req.path });

  // 2. Reporter a Sentry
  Sentry.captureException(err);

  // 3. Retourner un message user-friendly
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  res.status(statusCode).json({
    error: {
      message: err instanceof AppError ? err.userMessage : 'Erreur interne',
      code: err instanceof AppError ? err.code : 'INTERNAL_ERROR',
      requestId: req.id, // Pour le support
    }
  });
});
```

#### Frontend (Global)
```typescript
// Erreurs non rattrapees
window.addEventListener('unhandledrejection', (event) => {
  Sentry.captureException(event.reason);
});
window.addEventListener('error', (event) => {
  Sentry.captureException(event.error);
});
```

### 5.4 Integration Sentry

```typescript
// Initialisation
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  integrations: [
    // React : ErrorBoundary integration
    Sentry.reactRouterV6BrowserTracingIntegration({ ... }),
  ],
});

// Error Boundary Sentry (React)
import * as Sentry from '@sentry/react';
<Sentry.ErrorBoundary
  fallback={<ErrorFallback />}
  beforeCapture={(scope) => {
    scope.setTag('component', 'Dashboard');
  }}
>
  <Dashboard />
</Sentry.ErrorBoundary>
```

### 5.5 Separation messages user-facing vs logs techniques

| Niveau | User-facing | Log technique |
|---|---|---|
| Validation | "L'email est invalide" | `ValidationError: email field failed regex` |
| Auth | "Identifiants incorrects" | `AuthError: password hash mismatch for user_id=123` |
| Permission | "Vous n'avez pas acces a cette ressource" | `ForbiddenError: role=viewer attempted DELETE on /admin/users/5` |
| Serveur | "Erreur temporaire, reessayez" | `DatabaseError: connection pool exhausted at 14:32:01` |

**Regle** : JAMAIS exposer de stack trace, nom de table, requete SQL ou chemin de fichier au client.

---

## 6. Caching Strategies

### 6.1 Client-side

#### React Query / TanStack Query
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['users', filters],
  queryFn: () => fetchUsers(filters),
  staleTime: 5 * 60 * 1000,       // Donnees fraiches pendant 5min
  gcTime: 30 * 60 * 1000,          // Garder en cache 30min
  refetchOnWindowFocus: true,       // Rafraichir au retour sur l'onglet
});

// Invalidation ciblee apres mutation
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

#### SWR (Stale-While-Revalidate)
- Affiche les donnees en cache immediatement
- Fetche les nouvelles donnees en arriere-plan
- Met a jour l'UI quand les nouvelles donnees arrivent
- Plus simple que React Query, ideal pour les cas basiques

#### Quand choisir quoi
| Critere | React Query | SWR |
|---|---|---|
| Mutations complexes | Oui (optimistic updates, rollback) | Basique |
| DevTools | Riche | Basique |
| Pagination/Infinite | Excellent | Correct |
| Bundle size | Plus lourd | Plus leger |
| Cas d'usage | Apps complexes | Apps simples, blogs |

### 6.2 Server-side

#### Redis
- **Cache applicatif** : Resultats de requetes couteuses, sessions, rate limiting
- **TTL adaptatif** : Donnees statiques (24h), donnees dynamiques (5min), donnees temps reel (30s)
- **Strategies d'eviction** : `allkeys-lru` (recommande par defaut)
- **Invalidation event-based** : Publier un evenement lors d'une maj DB pour invalider le cache distribue

#### CDN
- Assets statiques (images, JS, CSS) : TTL long (1 an) + fingerprinting des noms de fichiers
- Pages statiques : TTL moyen (1h-24h)
- API responses : Cache-Control headers (`max-age`, `s-maxage`, `stale-while-revalidate`)

#### ISR (Incremental Static Regeneration) - Next.js
```typescript
// Page regeneree en arriere-plan toutes les 60 secondes
export const revalidate = 60;

// Ou revalidation on-demand
import { revalidatePath, revalidateTag } from 'next/cache';
revalidatePath('/blog');
revalidateTag('articles');
```

**Combinaison recommandee** : ISR pour le premier rendu statique + React Query/SWR cote client pour rafraichir apres le chargement initial.

### 6.3 Mobile (Flutter)

- **Base locale (Drift/Isar)** : Cache offline-first, synchronisation en arriere-plan
- **SharedPreferences** : Donnees simples (preferences, tokens, flags)
- **Strategie offline-first** :
  1. Lire depuis le cache local (instantane)
  2. Fetcher depuis l'API en arriere-plan
  3. Mettre a jour le cache local et l'UI

### 6.4 Patterns d'invalidation de cache

| Pattern | Description | Usage |
|---|---|---|
| **TTL (Time-To-Live)** | Expire apres un delai fixe | Donnees peu changeantes |
| **Event-based** | Invalide sur evenement (webhook, pub/sub) | Donnees critiques, temps reel |
| **Write-through** | Ecrit en cache ET en DB simultanement | Coherence forte |
| **Write-behind** | Ecrit en cache, persiste en DB en batch | Performance d'ecriture |
| **Cache-aside** | L'app gere le cache explicitement (read: cache miss -> DB -> cache) | Pattern le plus courant |

**Regle d'or** : "Il n'y a que deux choses difficiles en informatique : l'invalidation de cache et nommer les choses." -- Toujours preferer un TTL raisonnable plutot qu'une invalidation complexe.

---

## 7. Monorepo Architecture

### 7.1 Turborepo (JavaScript/TypeScript)

**Ideal pour** : Projets fullstack JS/TS, equipes de taille moyenne, projets Vercel.

#### Caracteristiques
- Ecrit en Rust (Go a l'origine), tres rapide
- Configuration minimaliste (`turbo.json`)
- Cache local + **Remote Caching** (Vercel ou auto-heberge)
- Execution parallele des taches avec graphe de dependances
- Integration triviale : ajout en <10 minutes sur un monorepo existant

#### Structure type
```
my-monorepo/
  apps/
    web/              # Next.js frontend
    mobile/           # React Native
    api/              # NestJS backend
  packages/
    ui/               # Composants partages
    config-eslint/    # Config ESLint partagee
    config-ts/        # tsconfig partagee
    database/         # Schema Prisma + client
    utils/            # Fonctions utilitaires partagees
    types/            # Types TypeScript partages
  turbo.json
  package.json        # Workspaces root
```

#### Configuration
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "test": { "dependsOn": ["build"] }
  }
}
```

### 7.2 Nx

**Ideal pour** : Grandes equipes, plateformes produit, besoin de scaffolding et de conventions strictes.

#### Caracteristiques
- Ecosysteme complet (generateurs, plugins, graph de deps visuel)
- Migration vers Rust du core en cours (2025)
- `nx affected` : execute les taches uniquement sur les packages modifies
- Plugins officiels pour React, Angular, Next.js, NestJS, etc.
- Propriete de code (CODEOWNERS) et contraintes de dependances

#### Quand Turborepo vs Nx

| Critere | Turborepo | Nx |
|---|---|---|
| Complexite setup | Minimale | Moyenne |
| Scaffolding / Generators | Non | Oui (riche) |
| Plugins framework | Non | Oui (Angular, React, NestJS...) |
| Graph de deps visuel | Non | Oui |
| Affected commands | Basique | Avance |
| Ideal pour | Equipes moyennes, Vercel | Grandes orgas, conventions strictes |
| CI/CD | Remote caching Vercel | Nx Cloud |

### 7.3 Melos (Flutter/Dart)

**Ideal pour** : Projets Flutter multi-packages, apps avec modules partages.

#### Caracteristiques
- Gestion des dependances inter-packages via **Pub Workspaces** (Dart >= 3.10, Flutter >= 3.38)
- Execution de scripts sur tous les packages ou un sous-ensemble
- CI/CD optimise : ne tester que les packages modifies
- Versioning et publication automatises pour les packages publics

#### Structure type
```
my_flutter_monorepo/
  apps/
    mobile_app/
    admin_panel/
  packages/
    core/             # Entities, utils partages
    auth/             # Module auth reutilisable
    api_client/       # Client API type-safe
    design_system/    # Composants UI partages
    analytics/        # Tracking
  melos.yaml
  pubspec.yaml        # Workspace root
```

#### Configuration
```yaml
# pubspec.yaml (root)
name: my_workspace
environment:
  sdk: ^3.10.0
workspace:
  - apps/mobile_app
  - apps/admin_panel
  - packages/*

# melos.yaml
name: my_workspace
packages:
  - apps/*
  - packages/*
scripts:
  analyze:
    exec: dart analyze .
  test:
    exec: flutter test
    select-package:
      dir-exists: test
  build:runner:
    exec: dart run build_runner build --delete-conflicting-outputs
```

### 7.4 Shared Packages Pattern

#### Types de packages partages

| Type | Contenu | Exemple |
|---|---|---|
| **Types/Models** | Types TypeScript ou Dart partages | `packages/types` |
| **UI Kit** | Composants visuels, design system | `packages/ui` |
| **Config** | ESLint, TSConfig, lint rules | `packages/config-*` |
| **Utils** | Fonctions pures reutilisables | `packages/utils` |
| **Database** | Schema, client, migrations | `packages/database` |
| **API Client** | Client type-safe (tRPC, OpenAPI) | `packages/api-client` |
| **Auth** | Logique auth partagee | `packages/auth` |

#### Bonnes pratiques
1. **Un package = une responsabilite** claire
2. **Versionner independamment** les packages publics, versions lockstep pour les internes
3. **Contraintes de dependances** : Un package `ui` ne doit pas dependre de `database`
4. **Tests par package** : Chaque package a ses propres tests
5. **CI incremental** : Ne build/test que les packages affectes par un changement

---

## Resume - Arbre de decision global

### Choix Architecture Frontend
```
Projet simple, peu de logique metier ?
  -> Structure par page/composant classique
Projet moyen a grand, logique metier significative ?
  -> Clean Architecture (3 couches)
  -> Decoupage par feature (pas par couche technique)
```

### Choix API
```
Monorepo fullstack TS ? -> tRPC + Server Actions
UI complexe, donnees variables ? -> GraphQL
API publique ou multi-clients ? -> REST + OpenAPI
```

### Choix ORM (Node.js)
```
MVP rapide ? -> Prisma
Edge/Serverless ? -> Drizzle
DDD complexe ? -> MikroORM
```

### Choix Auth
```
Web SSR classique ? -> Sessions
SPA / Mobile / Microservices ? -> JWT + Refresh Token
SSO / Providers externes ? -> OAuth2 + OIDC (Authorization Code + PKCE)
```

### Choix Cache
```
Client React ? -> React Query (complexe) ou SWR (simple)
Serveur ? -> Redis (applicatif) + CDN (statique) + ISR (Next.js)
Mobile ? -> Base locale offline-first
```

### Choix Monorepo
```
JS/TS, equipe moyenne, Vercel ? -> Turborepo
Grande orga, conventions strictes ? -> Nx
Flutter multi-packages ? -> Melos + Pub Workspaces
```

---

> **Sources de cette recherche** : Recherches web mars 2026 couvrant la documentation officielle (Flutter, Next.js, Prisma, Drizzle), articles DEV Community, Medium, comparatifs techniques, et repositories GitHub de reference.
