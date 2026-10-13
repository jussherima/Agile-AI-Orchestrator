# Clean Code & Architecture — Référence Orchestral

## 1. Clean Code (Robert C. Martin)

### Principes fondamentaux
- Lisibilité avant tout — le code est lu 10x plus qu'écrit
- Règle du Boy Scout — laisser le code plus propre qu'on ne l'a trouvé
- Un seul niveau d'abstraction par fonction

### Naming
- Noms révélateurs d'intention : `elapsedTimeInDays` pas `d`
- Classes = noms : `Customer`, `Invoice`
- Méthodes = verbes : `calculateTotal()`, `sendNotification()`
- Un mot par concept — ne pas alterner `fetch`/`retrieve`/`get`
- Longueur proportionnelle à la portée

### Taille des fonctions
- Idéalement 3-5 lignes, max 20
- Une fonction = une seule chose
- Max 2-3 paramètres (0-1 idéal)
- Pas d'effets de bord
- Fichiers : 50-100 lignes en moyenne, rarement > 200

### Commentaires
**Oui :** intention (pourquoi), clarification regex/complexe, avertissements, TODO datés, API publique
**Non :** redondants, code commenté, journaux de modif, marqueurs de position

### Code Smells
- **Long Method** (> 15 lignes)
- **God Class** (trop de responsabilités)
- **Long Parameter List** (> 3)
- **Primitive Obsession** (`string` au lieu d'objet métier)
- **Feature Envy** (méthode utilise plus les données d'une autre classe)
- **Message Chains** (`a.getB().getC().doX()`)
- **Dead Code** / **Speculative Generality**
- **Code dupliqué**

## 2. SOLID

| Principe | Règle | Signal d'alerte |
|----------|-------|-----------------|
| **S** — Single Responsibility | Une classe = une raison de changer | "Cette classe fait X ET Y" |
| **O** — Open/Closed | Ouvert à l'extension, fermé à la modification | `if/else` sur les types qui grossit |
| **L** — Liskov Substitution | Sous-classe remplaçable sans casser | Sous-classe qui lève NotImplemented |
| **I** — Interface Segregation | Interfaces petites et spécifiques | Classe forcée d'implémenter des méthodes vides |
| **D** — Dependency Inversion | Dépendre d'abstractions, pas de concrets | `new MySQLDatabase()` dans le service |

## 3. Architecture

### Clean Architecture (Uncle Bob)
```
[Entities] ← [Use Cases] ← [Adapters] ← [Frameworks]
```
Règle : dépendances pointent toujours vers l'intérieur.

### Feature-first (recommandé moyen/grand projet)
```
src/
  user/
    controller.ts
    service.ts
    repository.ts
  product/
    controller.ts
    service.ts
    repository.ts
```

### MVC / MVVM / MVP
- **MVC** : web classique, petits projets
- **MVP** : mobile, forte testabilité
- **MVVM** : UI complexes, data-driven (Angular, SwiftUI)

## 4. Design Patterns essentiels

### Création
- **Factory** : type déterminé au runtime
- **Builder** : objet avec 4+ paramètres optionnels
- **Singleton** : presque toujours un anti-pattern, préférer l'injection

### Structure
- **Adapter** : interface incompatible → compatible
- **Facade** : interface simplifiée sur un sous-système
- **Repository** : abstrait l'accès aux données

### Comportement
- **Observer** : notification un-à-plusieurs
- **Strategy** : algorithmes interchangeables
- **Command** : encapsule requête, undo/redo

**Règle** : refactorer VERS un pattern, pas designer AVEC un pattern.

## 5. Principes additionnels

- **DRY** : pas de duplication de CONNAISSANCE (pas juste de syntaxe)
- **KISS** : solution la plus simple qui fonctionne
- **YAGNI** : ne pas coder ce qui n'est pas nécessaire maintenant
- **Fail Fast** : erreurs détectées le plus tôt possible
- **Composition > Héritage** : assembler plutôt qu'hériter
- **Loi de Demeter** : ne parler qu'aux amis directs

## 6. Code Review

### Checklist
- [ ] Le code fait ce qui est attendu
- [ ] Cas limites gérés (null, vide, overflow)
- [ ] Erreurs correctement gérées
- [ ] Pas d'injection SQL/XSS, pas de secrets en dur
- [ ] Pas de requêtes N+1
- [ ] Noms clairs, fonctions courtes, pas de duplication
- [ ] Tests présents et pertinents
- [ ] Respect des patterns du projet

### Feedback constructif
- Poser des questions plutôt qu'ordonner
- Expliquer le pourquoi
- Distinguer bloquant vs suggestion ("Nit:")
- Critiquer le code, pas la personne

### Taille de PR
- 200-400 lignes max
- Review < 60 min
- Délai de review < 24h
