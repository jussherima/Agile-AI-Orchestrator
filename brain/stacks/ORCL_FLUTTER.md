# Best Practices Flutter 2025 — Référence Orchestral

## 1. Structure feature-first + Clean Architecture

```
lib/
├── app/                          # Config app-wide
│   ├── app.dart                  # MaterialApp / ProviderScope
│   ├── router.dart               # GoRouter config
│   └── theme.dart                # ThemeData
├── core/                         # Utilitaires transversaux
│   ├── constants/
│   ├── errors/                   # Exceptions, Failures
│   ├── network/                  # Dio client, interceptors
│   ├── utils/                    # Helpers, extensions
│   └── theme/                    # Couleurs, typo, spacing
├── shared/                       # Composants réutilisables
│   ├── widgets/
│   ├── models/
│   └── services/
├── features/                     # Feature-first
│   └── [feature]/
│       ├── data/
│       │   ├── datasources/      # remote + local
│       │   ├── models/           # DTOs (freezed)
│       │   └── repositories/     # Impl
│       ├── domain/
│       │   ├── entities/         # Objets métier purs
│       │   ├── repositories/     # Interfaces abstraites
│       │   └── usecases/
│       └── presentation/
│           ├── providers/        # Riverpod providers
│           ├── pages/
│           └── widgets/
├── l10n/                         # i18n
└── main.dart
```

**Règle** : dépendances → vers l'intérieur. Domain ne connaît ni Flutter ni aucun package.

## 2. State Management — Riverpod 2.x (standard 2025)

```dart
// Avec code generation (recommandé)
@riverpod
Future<List<User>> users(UsersRef ref) async {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getUsers();
}

@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  AuthState build() => const AuthState.initial();

  Future<void> login(String email, String password) async {
    state = const AuthState.loading();
    try {
      final user = await ref.read(authRepositoryProvider).login(email, password);
      state = AuthState.authenticated(user);
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }
}
```

**Riverpod vs BLoC** : Riverpod pour nouveau projet / petite équipe. BLoC pour enterprise / grande équipe.

### State immutable avec Freezed
```dart
@freezed
class AuthState with _$AuthState {
  const factory AuthState.initial() = _Initial;
  const factory AuthState.loading() = _Loading;
  const factory AuthState.authenticated(User user) = _Authenticated;
  const factory AuthState.error(String message) = _Error;
}
```

## 3. Navigation — GoRouter

```dart
final goRouter = GoRouter(
  initialLocation: '/',
  redirect: (context, state) {
    final isLoggedIn = authNotifier.isAuthenticated;
    final isOnLogin = state.matchedLocation == '/login';
    if (!isLoggedIn && !isOnLogin) return '/login';
    if (isLoggedIn && isOnLogin) return '/';
    return null;
  },
  routes: [
    StatefulShellRoute.indexedStack(  // Bottom nav persistante
      builder: (context, state, navigationShell) =>
        ScaffoldWithNavBar(navigationShell: navigationShell),
      branches: [
        StatefulShellBranch(routes: [GoRoute(path: '/', builder: (_, __) => const HomePage())]),
        StatefulShellBranch(routes: [GoRoute(path: '/profile', builder: (_, __) => const ProfilePage())]),
      ],
    ),
    GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
  ],
);
```

## 4. Data Layer

### Dio + Retrofit
```dart
@RestApi(baseUrl: '')
abstract class UserApi {
  factory UserApi(Dio dio) = _UserApi;

  @GET('/users')
  Future<List<UserModel>> getUsers();

  @POST('/users')
  Future<UserModel> createUser(@Body() CreateUserRequest request);
}
```

### Stockage local
| Solution | Usage |
|----------|-------|
| shared_preferences | Paramètres simples (clé-valeur) |
| Isar | Données complexes, gros volumes (recommandé 2025) |
| Drift | Besoin SQL, relations complexes, migrations |

### Repository pattern
```dart
// Domain — interface
abstract class UserRepository {
  Future<List<User>> getUsers();
}

// Data — implémentation (remote + cache local)
class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource _remote;
  final UserLocalDataSource _local;
  // ...
}
```

## 5. DI — Riverpod comme DI (si déjà Riverpod)

```dart
@riverpod
Dio dio(DioRef ref) => Dio(BaseOptions(baseUrl: AppConstants.baseUrl));

@riverpod
UserRepository userRepository(UserRepositoryRef ref) =>
  UserRepositoryImpl(remote: ref.watch(userApiProvider), local: ref.watch(isarProvider));
```

Alternative : get_it + injectable.

## 6. Performance

### Const partout
```dart
const Text('Hello')           // Widget caché, pas de rebuild
const SizedBox(height: 16)
const EdgeInsets.all(16)
```

### ListView.builder (pas ListView)
```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (_, index) => ItemWidget(items[index]),
)
```

### Isoler les rebuilds
```dart
// Consumer local au lieu de ref.watch dans le build parent
Consumer(builder: (_, ref, __) {
  return Text('${ref.watch(counterProvider)}');
})
```

### Keys
- Liste dynamique réordonnée → `ValueKey(item.id)`
- Éviter `GlobalKey` sauf besoin absolu

### Images
```dart
CachedNetworkImage(
  imageUrl: url,
  placeholder: (_, __) => const Shimmer(),
  memCacheWidth: 300,
)
```

## 7. Testing

### Unit (mocktail)
```dart
test('should return users', () async {
  when(() => mockRepo.getUsers()).thenAnswer((_) async => [testUser]);
  final result = await useCase.execute();
  expect(result, [testUser]);
  verify(() => mockRepo.getUsers()).called(1);
});
```

### Widget
```dart
testWidgets('LoginPage shows error', (tester) async {
  await tester.pumpWidget(ProviderScope(
    overrides: [authProvider.overrideWith(() => MockAuthNotifier())],
    child: const MaterialApp(home: LoginPage()),
  ));
  await tester.tap(find.text('Login'));
  await tester.pumpAndSettle();
  expect(find.text('Invalid credentials'), findsOneWidget);
});
```

### Golden (alchemist)
```dart
goldenTest('ProfileCard', fileName: 'profile_card', builder: () {
  return GoldenTestGroup(children: [
    GoldenTestScenario(name: 'default', child: const ProfileCard(user: testUser)),
  ]);
});
```

## 8. Packages essentiels 2025

| Catégorie | Package |
|-----------|---------|
| State | flutter_riverpod + riverpod_annotation + riverpod_generator |
| Navigation | go_router |
| HTTP | dio + retrofit + retrofit_generator |
| DI | get_it + injectable (ou Riverpod) |
| Immutable | freezed + json_serializable |
| Build | build_runner |
| Forms | reactive_forms |
| UI | flutter_screenutil, shimmer, flutter_svg |
| Storage | shared_preferences, isar, drift |
| Auth | firebase_auth ou dart_jsonwebtoken |
| Network | connectivity_plus |
| Lint | very_good_analysis |
| Test | mocktail, alchemist |
| Functional | fpdart |

## 9. Conventions

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Fichiers | snake_case | user_repository.dart |
| Classes | PascalCase | UserRepository |
| Variables | camelCase | getUserById |
| Providers | camelCase + Provider | userRepositoryProvider |
| Pages | *_page.dart | login_page.dart |
| Widgets | *_widget.dart | avatar_widget.dart |
| Models | *_model.dart | user_model.dart |
| Entities | *_entity.dart | user_entity.dart |

### Lint strict
```yaml
include: package:very_good_analysis/analysis_options.yaml
linter:
  rules:
    - prefer_const_constructors
    - prefer_final_locals
    - avoid_print
    - unawaited_futures
```

## 10. Anti-patterns interdits

- `setState` dans un projet Riverpod/BLoC (utiliser les providers)
- `GlobalKey` pour communiquer entre widgets
- Logique métier dans les widgets
- `ListView` sans `.builder` pour les listes dynamiques
- Imports relatifs (utiliser `package:`)
- `print()` en production (utiliser un logger)
- Widgets > 100 lignes (extraire en sous-widgets)
- `dynamic` quand un type est connu
