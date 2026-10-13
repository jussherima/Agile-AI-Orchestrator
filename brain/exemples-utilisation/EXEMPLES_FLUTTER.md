# Claude Code — Exemples Complets pour Flutter

> Chaque fonctionnalité de Claude Code illustrée avec des exemples Flutter concrets.

---

## Table des matières

- [1. CLAUDE.md — Projet Flutter](#1-claudemd--projet-flutter)
- [2. Rules — Conventions par chemin](#2-rules--conventions-par-chemin)
- [3. Skill — Widget Builder (auto-chargé)](#3-skill--widget-builder-auto-chargé)
- [4. Skill fork — Analyse de dépendances](#4-skill-fork--analyse-de-dépendances)
- [5. Skill — Build release (toi seulement)](#5-skill--build-release-toi-seulement)
- [6. Skill invisible — Contexte Firebase](#6-skill-invisible--contexte-firebase)
- [7. Command — Générer un feature module](#7-command--générer-un-feature-module)
- [8. Agent — Testeur Flutter](#8-agent--testeur-flutter)
- [9. Hooks — Auto-format et protection](#9-hooks--auto-format-et-protection)
- [10. Hook prompt — Vérification analyse statique](#10-hook-prompt--vérification-analyse-statique)
- [11. MCP Servers — Firebase + GitHub + Figma](#11-mcp-servers--firebase--github--figma)
- [12. Agent Teams — Review parallèle](#12-agent-teams--review-parallèle)
- [13. Worktrees — Feature isolée](#13-worktrees--feature-isolée)
- [14. Extended Thinking — Architecture complexe](#14-extended-thinking--architecture-complexe)
- [15. Scheduled Tasks — Surveillance](#15-scheduled-tasks--surveillance)
- [16. CLI Pipe — Scripts Flutter](#16-cli-pipe--scripts-flutter)
- [17. Permissions Flutter](#17-permissions-flutter)
- [18. Plugin — Flutter Toolkit](#18-plugin--flutter-toolkit)
- [19. Keybindings Flutter](#19-keybindings-flutter)
- [20. Variables dynamiques — Rapport projet](#20-variables-dynamiques--rapport-projet)
- [21. Mode /btw — Questions rapides](#21-mode-btw--questions-rapides)

---

## 1. CLAUDE.md — Projet Flutter

```markdown
# MonApp Flutter

## Build & Run
flutter pub get
flutter run -d chrome          # Web
flutter run                    # Mobile connecté
flutter test                   # Tests
flutter analyze                # Linter

## Conventions
- Architecture : Clean Architecture (data / domain / presentation)
- State management : Riverpod
- Navigation : GoRouter
- Modèles : Freezed + json_serializable
- Tests : flutter_test + mockito + integration_test
- Langue du code : anglais, commits en français (Conventional Commits)

## Structure
lib/
├── core/           # Utils, constants, theme, extensions
├── data/           # Repositories impl, datasources, models
├── domain/         # Entities, repositories abstraits, usecases
├── presentation/   # Pages, widgets, providers
└── main.dart

@docs/architecture.md
```

---

## 2. Rules — Conventions par chemin

### Widgets (presentation/)

```yaml
# .claude/rules/widget-conventions.md
---
paths:
  - "lib/presentation/**/*.dart"
---

# Conventions Widgets

- Chaque widget dans son propre fichier
- Nom du fichier = snake_case du widget (LoginPage → login_page.dart)
- Extraire les sous-widgets dès que build() dépasse 80 lignes
- Pas de logique métier dans les widgets — tout dans les providers/controllers
- Utiliser const constructors partout où possible
- Clés (Key) sur les widgets dans les listes
```

### Data layer

```yaml
# .claude/rules/data-layer.md
---
paths:
  - "lib/data/**/*.dart"
---

# Conventions Data Layer

- Modèles avec @freezed pour l'immutabilité
- Toujours un fromJson/toJson via json_serializable
- Repositories : implémenter l'interface du domain/
- Datasources : jamais d'accès direct depuis presentation/
- Gestion d'erreurs avec Either<Failure, T> (dartz ou fpdart)
```

---

## 3. Skill — Widget Builder (auto-chargé)

```yaml
# .claude/skills/flutter-widget/SKILL.md
---
name: flutter-widget
description: Crée des widgets Flutter avec les bonnes pratiques. Utilisé quand on demande de créer un widget, une page, un écran, un composant UI Flutter.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Flutter Widget Builder

Quand tu crées un widget Flutter :

## Checklist
1. **const constructor** si pas de paramètre mutable
2. **Key** dans le constructeur : `const MyWidget({super.key})`
3. **Extraire** les sous-widgets en méthodes privées ou widgets séparés
4. **Responsive** : utiliser LayoutBuilder ou MediaQuery, jamais de valeurs fixes
5. **Accessibilité** : Semantics sur les éléments interactifs
6. **Theme** : utiliser `Theme.of(context)` pas de couleurs hardcodées

## Template StatelessWidget
```dart
import 'package:flutter/material.dart';

class $ARGUMENTS extends StatelessWidget {
  const $ARGUMENTS({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return const Placeholder();
  }
}
```

## Template avec Riverpod
```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class $ARGUMENTS extends ConsumerWidget {
  const $ARGUMENTS({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    return const Placeholder();
  }
}
```

**Utilisation** : `/flutter-widget ProfileCard` ou juste "crée un widget ProfileCard" (auto-chargé).
```

---

## 4. Skill fork — Analyse de dépendances

```yaml
# .claude/skills/analyze-deps/SKILL.md
---
name: analyze-deps
description: Analyse les dépendances Flutter, pubspec.yaml, versions obsolètes, conflits. Utilisé quand on parle de packages, dépendances, versions, pubspec.
context: fork
agent: Explore
model: haiku
allowed-tools: Read, Grep, Glob, Bash
---

Analyse les dépendances du projet Flutter :

1. Lire `pubspec.yaml` et `pubspec.lock`
2. Lister tous les packages et leurs versions
3. Exécuter `flutter pub outdated` pour les mises à jour
4. Identifier les packages dépréciés
5. Vérifier les conflits de versions
6. Rapport :

| Package | Actuelle | Dernière | Status |
|---------|----------|----------|--------|
| ... | ... | ... | ✅ / ⚠️ / 🔴 |
```

**Utilisation** : `/analyze-deps` — tourne en arrière-plan avec Haiku.

---

## 5. Skill — Build release (toi seulement)

```yaml
# .claude/skills/build-release/SKILL.md
---
name: build-release
description: Build release Flutter (APK, AAB, IPA, Web)
disable-model-invocation: true
allowed-tools: Bash, Read
argument-hint: "[android|ios|web|all]"
---

Build release pour : $1

## Android
flutter build appbundle --release
# → build/app/outputs/bundle/release/app-release.aab

## iOS
flutter build ipa --release
# → build/ios/ipa/*.ipa

## Web
flutter build web --release --web-renderer canvaskit
# → build/web/

Après le build :
1. Vérifie la taille du bundle
2. Liste les warnings
3. Confirme la version dans pubspec.yaml
```

**Utilisation** : `/build-release android` — Claude ne peut jamais le déclencher seul.

---

## 6. Skill invisible — Contexte Firebase

```yaml
# .claude/skills/firebase-context/SKILL.md
---
name: firebase-context
description: Configuration Firebase du projet. Utilisé quand on parle de Firebase, Firestore, Auth, Cloud Functions, FCM, analytics, crashlytics.
user-invocable: false
---

# Config Firebase du projet

- **Auth** : Email/password + Google Sign-In
- **Firestore** : base principale, rules dans firestore.rules
- **Storage** : images profil dans gs://monapp-bucket/avatars/
- **FCM** : notifications push, topic "general" pour broadcast
- **Crashlytics** : activé, dsym uploadé via CI
- **Flavors** : dev (monapp-dev) / prod (monapp-prod)

## Collections Firestore principales
- `users/{uid}` — profil utilisateur
- `users/{uid}/settings` — préférences
- `posts/{postId}` — publications
- `posts/{postId}/comments/{commentId}` — commentaires

## Règles de sécurité
- Lecture profil : authentifié
- Écriture profil : propriétaire seulement
- Posts : authentifié pour créer, public pour lire
```

**Effet** : invisible dans le menu, mais se charge automatiquement dès que tu parles de Firestore, Auth, etc.

---

## 7. Command — Générer un feature module

```markdown
# .claude/commands/create-feature.md

Crée un nouveau module feature Flutter en Clean Architecture.

Nom de la feature : $ARGUMENTS

Crée cette structure :

lib/presentation/$ARGUMENTS/
├── pages/${ARGUMENTS}_page.dart
├── widgets/
└── providers/${ARGUMENTS}_provider.dart

lib/domain/$ARGUMENTS/
├── entities/${ARGUMENTS}_entity.dart
├── repositories/${ARGUMENTS}_repository.dart
└── usecases/get_${ARGUMENTS}_usecase.dart

lib/data/$ARGUMENTS/
├── models/${ARGUMENTS}_model.dart
├── datasources/${ARGUMENTS}_remote_datasource.dart
└── repositories/${ARGUMENTS}_repository_impl.dart

Conventions :
- Entity avec Freezed
- Model avec fromJson/toJson
- Repository abstrait dans domain/, impl dans data/
- Provider Riverpod dans presentation/
```

**Utilisation** : `/create-feature authentication`

---

## 8. Agent — Testeur Flutter

```yaml
# .claude/agents/flutter-tester.md
---
name: Flutter Tester
description: Écrit et vérifie les tests Flutter — unit, widget, integration.
tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
maxTurns: 15
---

Tu es un testeur Flutter expert.

## Process

1. Lire le code source à tester
2. Identifier les cas (happy path, edge cases, erreurs)
3. Écrire les tests :

### Unit tests (domain/ et data/)
- Mocker avec mockito (@GenerateMocks)
- Tester chaque usecase et repository
- Tester les erreurs

### Widget tests (presentation/)
- pumpWidget avec MaterialApp wrapper
- Interactions (tap, scroll, input)
- États (loading, error, data)
- ProviderScope pour Riverpod

### Template
```dart
@GenerateMocks([MyRepository])
void main() {
  late MockMyRepository mockRepo;

  setUp(() {
    mockRepo = MockMyRepository();
  });

  group('MyFeature', () {
    test('should return data when successful', () async {
      when(mockRepo.getData()).thenAnswer((_) async => Right(testData));
      expect(result, equals(expected));
    });

    test('should return failure when fails', () async {
      when(mockRepo.getData()).thenAnswer((_) async => Left(ServerFailure()));
    });
  });
}
```

4. Lancer : `flutter test`
5. Couverture : `flutter test --coverage`
```

**Utilisation** : "teste le usecase GetUserProfile" → Claude délègue à cet agent.

---

## 9. Hooks — Auto-format et protection

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "dart format \"$CLAUDE_FILE_PATH\" 2>/dev/null; exit 0",
            "timeout": 10
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo '$CLAUDE_TOOL_INPUT' | grep -qE 'flutter clean|rm -rf build' && echo 'Commande destructrice détectée' >&2 && exit 2 || exit 0",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Effet** :
- Chaque `.dart` édité → auto-formatté avec `dart format`
- `flutter clean` ou `rm -rf build` → bloqué avec avertissement

---

## 10. Hook prompt — Vérification analyse statique

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "flutter analyze --no-pub 2>&1 | grep -c 'error' | xargs -I{} test {} -eq 0 || (echo 'flutter analyze a détecté des erreurs' >&2 && exit 2)",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**Effet** : à chaque fin de réponse Claude, `flutter analyze` vérifie automatiquement.

---

## 11. MCP Servers — Firebase + GitHub + Figma

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {"Authorization": "Bearer ${GITHUB_TOKEN}"}
    },
    "firebase": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "firebase-mcp-server"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "${HOME}/.config/firebase/credentials.json"
      }
    },
    "figma": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-figma"],
      "env": {"FIGMA_TOKEN": "${FIGMA_TOKEN}"}
    }
  }
}
```

**Effet** :
- "Crée une issue GitHub pour le bug du login" → MCP GitHub
- "Lis la collection users sur Firestore" → MCP Firebase
- "Regarde la maquette Figma du dashboard" → MCP Figma

---

## 12. Agent Teams — Review parallèle

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
claude
```

```
> Crée une équipe pour reviewer le module authentication/ :
  - Teammate 1 : vérifie la logique métier (domain/ et data/)
  - Teammate 2 : vérifie les widgets et l'UX (presentation/)
  - Teammate 3 : vérifie les tests et la couverture
  Consolide en un rapport unique.
```

---

## 13. Worktrees — Feature isolée

```bash
# Tester un refacto Riverpod → Bloc sans risque
claude -w migration-bloc

# Si ça marche → merge
# Si ça casse → supprime le worktree, rien n'est touché
```

---

## 14. Extended Thinking — Architecture complexe

```
> ultrathink: J'ai une app Flutter avec 50 écrans en Provider.
> Propose un plan de migration vers Riverpod 2.0 avec code generation,
> progressif et sans casser l'app.
```

---

## 15. Scheduled Tasks — Surveillance

```
/loop 10m lance flutter analyze et signale les nouveaux warnings

/loop 1h vérifie les issues GitHub ouvertes avec label "bug"

/loop 30m lance flutter test et signale les échecs
```

---

## 16. CLI Pipe — Scripts Flutter

```bash
# Analyser un crash log
cat crashlytics_export.txt | claude -p "analyse ce crash log Flutter"

# Générer un modèle Freezed depuis un JSON
cat api_response.json | claude -p "génère un modèle Freezed Dart pour ce JSON"

# Review avant commit
git diff --staged | claude -p "review ces changements Flutter" --max-turns 3
```

---

## 17. Permissions Flutter

```json
{
  "permissions": {
    "allow": [
      "Read", "Glob", "Grep",
      "Bash(flutter *)",
      "Bash(dart *)",
      "Bash(git *)",
      "Bash(firebase *)",
      "WebSearch"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(flutter clean)",
      "Edit(android/app/google-services.json)",
      "Edit(ios/Runner/GoogleService-Info.plist)",
      "Edit(.env*)"
    ]
  }
}
```

---

## 18. Plugin — Flutter Toolkit

```
flutter-toolkit-plugin/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── flutter-widget/SKILL.md
│   ├── freezed-model/SKILL.md
│   └── riverpod-provider/SKILL.md
├── agents/
│   ├── flutter-tester.md
│   └── flutter-reviewer.md
├── hooks/hooks.json
└── settings.json
```

---

## 19. Keybindings Flutter

```json
{
  "ctrl+shift+t": "flutter test",
  "ctrl+shift+a": "flutter analyze",
  "ctrl+shift+r": "/build-release android",
  "ctrl+shift+g": "flutter pub run build_runner build --delete-conflicting-outputs"
}
```

---

## 20. Variables dynamiques — Rapport projet

```yaml
# .claude/skills/flutter-status/SKILL.md
---
name: flutter-status
description: Status complet du projet Flutter
disable-model-invocation: true
---

## Projet Flutter — Status !`date +%Y-%m-%d`

### Version
!`grep 'version:' pubspec.yaml`

### Dépendances
!`flutter pub outdated 2>/dev/null | head -20`

### Analyse statique
!`flutter analyze 2>&1 | tail -5`

### Tests
!`flutter test 2>&1 | tail -10`

### Derniers commits
!`git log --oneline -5`

Analyse et produis un résumé santé avec actions prioritaires.
```

**Utilisation** : `/flutter-status`

---

## 21. Mode /btw — Questions rapides

```
/btw quelle est la différence entre ListView.builder et ListView.separated ?

/btw comment fonctionne le lifecycle d'un StatefulWidget ?

/btw Riverpod : StateProvider vs StateNotifierProvider vs NotifierProvider ?
```

Réponse instantanée, pas de lecture de fichiers, pas de coût d'outils.
