# Testing & Qualité — Référence Orchestral

## 1. Pyramide des tests (ratio 70/20/10)

| Niveau | % | Vitesse | Portée |
|--------|---|---------|--------|
| **Unitaires** | ~70% | ms | Fonction/classe isolée |
| **Intégration** | ~20% | sec | Interaction entre composants |
| **E2E** | ~10% | min | Parcours utilisateur complet |

Anti-pattern "Ice Cream Cone" : beaucoup de E2E, peu d'unitaires.

## 2. Tests unitaires

### Structure AAA
```
// ARRANGE — Préparer
// ACT — Exécuter
// ASSERT — Vérifier
```

### Nommage
`should_[résultat]_when_[condition]`

### Règles
- Un test = un comportement
- Tester entrées/sorties, PAS l'implémentation
- Couverture : ≥ 80% (gate CI), 100% sur code critique

### Principes FIRST
- **F**ast, **I**ndependent, **R**epeatable, **S**elf-checking, **T**imely

## 3. Tests d'intégration

**Mocker :** services tiers (Stripe, S3), APIs externes
**Vraie DB :** requêtes complexes, contraintes FK, migrations, transactions
**Outil :** Testcontainers (DB éphémère Docker)

## 4. Tests E2E — Scénarios critiques

1. Auth : inscription, login, logout, reset password
2. Parcours principal (flux de valeur #1)
3. Gestion erreurs : 404/500, timeout, formulaires invalides
4. Rôles : admin vs utilisateur
5. Smoke tests post-déploiement

**Outils :** Playwright (recommandé), Cypress, Selenium

## 5. TDD — Red-Green-Refactor

1. **RED** : écrire un test qui échoue
2. **GREEN** : code minimum pour passer
3. **REFACTOR** : nettoyer, tests restent verts

**Oui :** logique métier complexe, algorithmes, API publiques
**Non :** prototypage, UI esthétique, scripts jetables

## 6. Qualité du code — Métriques

| Métrique | Seuil |
|----------|-------|
| Couverture | ≥ 80% |
| Complexité cyclomatique | ≤ 10 / fonction |
| Complexité cognitive | ≤ 15 / fonction |
| Duplication | < 3% |
| Dette technique | Ratio ≤ 5% |

## 7. CI/CD Pipeline

```
LINT → TEST (unit + integ) → BUILD → STAGING + E2E → DEPLOY PROD
```

### Branch Protection
- PR reviews obligatoires (min 1)
- CI verte requise
- Pas de push direct sur main
- Up-to-date avant merge

### Déploiement
| Stratégie | Rollback | Usage |
|-----------|----------|-------|
| **Rolling** | Lent | Par défaut (K8s) |
| **Blue-Green** | Instantané | Rollback critique |
| **Canary** | Rapide | Fort trafic |

## 8. Git Workflow

### GitHub Flow (recommandé petites équipes)
main + feature branches, main toujours déployable

### Conventional Commits
```
<type>[scope]: <description>
```

| Type | SemVer |
|------|--------|
| `feat` | MINOR |
| `fix` | PATCH |
| `feat!` / `BREAKING CHANGE` | MAJOR |
| `docs`, `style`, `refactor`, `test`, `ci`, `chore` | — |

### Branch naming
`<type>/<ticket-id>-<description-kebab-case>`

### PR
- < 400 lignes
- Titre = conventional commit
- Description = pourquoi + lien ticket
- Self-review avant demande
