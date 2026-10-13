# Guide de Gestion de Projet avec GitHub & GitHub Projects

> Guide complet des bonnes pratiques pour gérer un projet logiciel avec GitHub et l'outil intégré GitHub Projects.

---

## Table des matières

- [Partie 1 : Gestion de Projet avec GitHub](#partie-1--gestion-de-projet-avec-github)
  - [1.1 Stratégies de Branching](#11-stratégies-de-branching)
  - [1.2 Pull Requests et Code Reviews](#12-pull-requests-et-code-reviews)
  - [1.3 Gestion des Issues et Labels](#13-gestion-des-issues-et-labels)
  - [1.4 Milestones](#14-milestones)
  - [1.5 GitHub Actions pour CI/CD](#15-github-actions-pour-cicd)
  - [1.6 Releases et Versionnage](#16-releases-et-versionnage)
  - [1.7 CODEOWNERS et Rulesets](#17-codeowners-et-rulesets)
  - [1.8 Collaboration : Équipes et Permissions](#18-collaboration--équipes-et-permissions)
- [Partie 2 : GitHub Projects (v2)](#partie-2--github-projects-v2)
  - [2.1 Présentation](#21-présentation)
  - [2.2 Créer et Configurer un Projet](#22-créer-et-configurer-un-projet)
  - [2.3 Champs Personnalisés](#23-champs-personnalisés)
  - [2.4 Les 3 Types de Vues](#24-les-3-types-de-vues)
  - [2.5 Automations](#25-automations)
  - [2.6 Itérations et Sprints](#26-itérations-et-sprints)
  - [2.7 Suivi de l'Avancement](#27-suivi-de-lavancement)
  - [2.8 Bonnes Pratiques Agile/Scrum](#28-bonnes-pratiques-agilescrum)

---

## Partie 1 : Gestion de Projet avec GitHub

### 1.1 Stratégies de Branching

Il existe trois stratégies principales, chacune adaptée à un contexte différent.

#### Git Flow

Git Flow utilise plusieurs branches à longue durée de vie :

```
main ──────────────────────────────────────────►
  │                                       ▲
  └── develop ────────────────────────────►│
        │          ▲         │        ▲
        └─ feature/xyz ─────┘        │
                              release/1.0 ─┘
```

- **Branches** : `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`
- **Quand l'utiliser** : projets avec des versions planifiées (v1.0, v2.0), grandes équipes, industries réglementées nécessitant de longues phases de QA.
- **Inconvénient** : surcharge de complexité si vous déployez en continu.

#### GitHub Flow (recommandé pour la plupart des équipes)

Modèle simple : une seule branche principale (`main`), toujours déployable. Les développeurs créent des branches de feature courtes puis ouvrent une Pull Request.

```
main ──────────────────────────────────────────►
  │          ▲       │           ▲
  └─ feature/a ─────┘           │
                  └─ feature/b ─┘
```

- **Quand l'utiliser** : petites et moyennes équipes, déploiement continu, produits sans maintenance de versions multiples.
- **Avantage** : bon compromis entre simplicité et collaboration structurée via les Pull Requests.

#### Trunk-Based Development

Tous les développeurs travaillent sur une seule branche partagée. Les branches de feature durent moins d'un jour.

- **Quand l'utiliser** : équipes pratiquant le déploiement continu avec une CI/CD solide.
- **Prérequis** : tests automatisés fiables, feature flags pour masquer les fonctionnalités inachevées en production.

#### Comparaison rapide

| Critère | Git Flow | GitHub Flow | Trunk-Based |
|---------|----------|-------------|-------------|
| Complexité | Élevée | Moyenne | Faible |
| Fréquence de déploiement | Planifiée | Continue | Très fréquente |
| Taille d'équipe idéale | Grande | Petite/Moyenne | Toute taille |
| Versions multiples | Oui | Non | Non |
| Courbe d'apprentissage | Haute | Basse | Basse |

---

### 1.2 Pull Requests et Code Reviews

Les Pull Requests (PR) sont le pilier de la collaboration sur GitHub.

#### Bonnes pratiques

1. **PRs petites et ciblées** : décomposer le travail en petites PR facilite la revue et réduit les risques. Les PR volumineuses sont difficiles à relire et ont tendance à être approuvées sans examen approfondi.

2. **Description claire** : expliquer le "pourquoi" du changement, pas seulement le "quoi". Inclure :
   - Le contexte et la motivation
   - Les captures d'écran si pertinent
   - La référence à l'issue liée (`Closes #123`)

3. **Revues de code obligatoires** : configurer les règles de protection de branche pour exiger au moins une approbation avant fusion.

4. **Rejeter les approbations obsolètes** : activer l'option "Dismiss stale pull request approvals when new commits are pushed".

5. **Résolution des conversations** : exiger que tous les commentaires de revue soient résolus avant la fusion.

#### Template de PR

Créer un fichier `.github/PULL_REQUEST_TEMPLATE.md` :

```markdown
## Description
<!-- Décrivez le changement et sa motivation -->

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Refactoring
- [ ] Documentation

## Issue liée
Closes #

## Checklist
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Code review demandée
```

---

### 1.3 Gestion des Issues et Labels

#### Issues

- **Templates d'issues** : utiliser le constructeur de templates GitHub (`.github/ISSUE_TEMPLATE/`) pour créer des modèles différents (rapport de bug, demande de fonctionnalité).
- **Sub-issues** : décomposer les grandes issues en sous-issues pour permettre le travail en parallèle et produire des PR plus petites.
- **Recherche avant création** : encourager l'équipe à chercher les issues existantes avant d'en créer pour éviter les doublons.

#### Labels — Convention de nommage recommandée

Utiliser des préfixes pour organiser les labels par catégorie :

| Catégorie | Labels | Couleur suggérée |
|-----------|--------|------------------|
| **Type** | `type:bug`, `type:feature`, `type:refactor`, `type:docs` | Rouge, Vert, Bleu, Gris |
| **Priorité** | `priority:critical`, `priority:high`, `priority:medium`, `priority:low` | Rouge foncé → Jaune |
| **Statut** | `status:in-progress`, `status:needs-review`, `status:blocked` | Orange, Violet, Noir |
| **Domaine** | `area:frontend`, `area:backend`, `area:infra` | Couleurs distinctes |

**Conseil** : ne pas surcharger les issues de labels — viser 2 à 4 labels par issue maximum.

---

### 1.4 Milestones

Les milestones permettent de regrouper des issues et PR autour d'un objectif de release ou d'un sprint.

- **Associer chaque issue à un milestone** pour suivre la progression globale.
- Les milestones offrent une **barre de progression** montrant le pourcentage d'issues fermées.
- **Distinction** : une issue peut avoir plusieurs labels, appartenir à un milestone (ex: "Release v2.1"), et figurer sur un projet GitHub Projects.

#### Exemple d'organisation

```
Milestone "v1.0"
├── #12 - Authentification utilisateur     ✅ Fermée
├── #15 - Page d'accueil                   ✅ Fermée
├── #18 - API de paiement                  🔵 En cours
└── #21 - Tests d'intégration              ⚪ À faire
                                    ████████░░ 50%
```

---

### 1.5 GitHub Actions pour CI/CD

GitHub Actions est la plateforme intégrée de CI/CD permettant d'automatiser les workflows directement dans le dépôt.

#### Bonnes pratiques

1. **Triggers adaptés** : utiliser les événements appropriés

   ```yaml
   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]
   ```

2. **Mise en cache des dépendances** pour accélérer les builds :

   ```yaml
   - uses: actions/cache@v4
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

3. **Builds matriciels** pour tester sur plusieurs environnements :

   ```yaml
   strategy:
     matrix:
       node-version: [18, 20, 22]
       os: [ubuntu-latest, macos-latest]
   ```

4. **Concurrence** : annuler les workflows en cours quand un nouveau commit arrive :

   ```yaml
   concurrency:
     group: ${{ github.workflow }}-${{ github.ref }}
     cancel-in-progress: true
   ```

5. **Sécurité** :
   - Stocker les secrets dans GitHub Secrets (chiffrés au repos)
   - Épingler les actions tierces à un SHA de commit, pas un tag

   ```yaml
   # Bien
   - uses: actions/checkout@a5ac7e51b41094c92402da3b24376905380afc29  # v4.1.6
   # Risqué
   - uses: actions/checkout@v4
   ```

---

### 1.6 Releases et Versionnage

#### Semantic Versioning (SemVer)

Format : `MAJOR.MINOR.PATCH` (ex: `v1.2.3`)

| Composant | Quand incrémenter | Exemple |
|-----------|-------------------|---------|
| **MAJOR** | Changement incompatible (breaking change) | `v1.0.0` → `v2.0.0` |
| **MINOR** | Nouvelle fonctionnalité rétrocompatible | `v1.0.0` → `v1.1.0` |
| **PATCH** | Correction de bug rétrocompatible | `v1.0.0` → `v1.0.1` |

#### Automatisation avec semantic-release

Utiliser des outils comme **semantic-release** qui :
- Déterminent automatiquement le type de release via les messages de commit
- Mettent à jour la version
- Génèrent un changelog
- Publient la release GitHub

#### Convention de commits (Conventional Commits)

```
feat: ajouter l'authentification OAuth      → MINOR
fix: corriger le calcul de TVA              → PATCH
feat!: refonte de l'API de paiement         → MAJOR
chore: mettre à jour les dépendances        → pas de release
```

---

### 1.7 CODEOWNERS et Rulesets

#### CODEOWNERS

Le fichier `.github/CODEOWNERS` définit les responsables de chaque partie du code :

```
# Syntaxe : pattern   @owner

# Propriétaires globaux par défaut
*                       @team-leads

# Par répertoire
/frontend/              @frontend-team
/backend/               @backend-team
/infra/                 @devops-team

# Par type de fichier
*.sql                   @dba-team
Dockerfile              @devops-team
```

Les code owners sont **automatiquement ajoutés comme reviewers** sur les PR modifiant leur code.

#### Rulesets (remplacent les Branch Protection Rules)

GitHub recommande désormais les **Rulesets**, plus puissants et transparents.

| Niveau | Règles recommandées |
|--------|---------------------|
| **Base (tous les repos)** | Bloquer force push et suppressions, exiger une PR avant fusion, exiger le passage de la CI |
| **Production** | + Approbations requises (≥ 1), rejet des approbations obsolètes, revue CODEOWNERS, résolution des conversations, scan de code |
| **Réglementé (SOX, HIPAA)** | + Commits signés, restrictions de fichiers, scan de secrets, vérification de déploiement |

**Conseil** : déployer les rulesets en **mode Evaluate** pendant au moins un sprint avant de les activer, pour identifier les frictions via Rule Insights.

---

### 1.8 Collaboration : Équipes et Permissions

#### Niveaux de permissions

| Rôle | Capacités |
|------|-----------|
| **Read** | Voir le code, les issues, les PR |
| **Triage** | Gérer les issues et PR (labels, assignees) sans écrire du code |
| **Write** | Pousser du code, créer des branches |
| **Maintain** | Gérer le dépôt sans accès aux paramètres sensibles |
| **Admin** | Accès complet (paramètres, suppressions, etc.) |

#### Bonnes pratiques

- **Principe du moindre privilège** : accorder uniquement les permissions nécessaires.
- **Organiser en équipes** : frontend, backend, DevOps, QA — chaque équipe a des permissions adaptées.
- **Fichier `CONTRIBUTING.md`** : guider les contributeurs sur les conventions du projet (style de code, process de PR, convention de commits).
- **Utiliser les @mentions** pour notifier des personnes ou équipes spécifiques.
- **Assigner des responsables** aux issues pour établir une propriété claire.

---

## Partie 2 : GitHub Projects (v2)

### 2.1 Présentation

GitHub Projects est l'outil de gestion de projet intégré à GitHub, remplaçant les anciens "Project Boards" classiques.

**Caractéristiques principales :**
- Intégration native avec les issues, PR et draft issues
- Trois types de vues : **Table**, **Board (Kanban)**, **Roadmap (Timeline)**
- Champs personnalisés, filtres, groupements, tris
- Automations intégrées + intégration GitHub Actions
- Peut couvrir **plusieurs dépôts** (projets au niveau organisation)

---

### 2.2 Créer et Configurer un Projet

1. Naviguer vers l'onglet **Projects** de votre profil ou organisation
2. Cliquer sur **New project** et choisir un template (Board, Table, Roadmap) ou partir de zéro
3. Ajouter des éléments :
   - **Issues existantes** depuis n'importe quel dépôt de l'organisation
   - **Pull Requests** pour suivre les changements de code
   - **Draft issues** : brouillons rapides convertibles en vraies issues plus tard

---

### 2.3 Champs Personnalisés

GitHub Projects supporte jusqu'à **50 champs** par projet.

| Type de champ | Utilisation | Exemple |
|---------------|-------------|---------|
| **Texte** | Notes rapides, contexte | "Dépend du déploiement infra" |
| **Nombre** | Story points, complexité | 1, 2, 3, 5, 8, 13 |
| **Date** | Date cible de livraison | 2026-03-20 |
| **Sélection unique** | Priorité, catégorie | Basse / Moyenne / Haute / Critique |
| **Itération** | Sprints, cycles de travail | Sprint 12 (10-24 mars) |

Ces champs permettent de **filtrer**, **grouper** et **trier** les éléments dans chaque vue.

---

### 2.4 Les 3 Types de Vues

#### Vue Table

Affichage haute densité, similaire à un tableur.

```
┌──────────────────────┬──────────┬──────────┬────────┬───────────┐
│ Titre                │ Statut   │ Priorité │ Points │ Assignée  │
├──────────────────────┼──────────┼──────────┼────────┼───────────┤
│ Auth OAuth           │ En cours │ Haute    │ 5      │ @alice    │
│ Fix calcul TVA       │ À faire  │ Critique │ 3      │ @bob      │
│ Page d'accueil       │ Terminé  │ Moyenne  │ 8      │ @charlie  │
└──────────────────────┴──────────┴──────────┴────────┴───────────┘
                                              Total: 16 points
```

**Idéal pour** : trier par priorité, filtrer par statut, voir les estimations, sommes par colonne.

#### Vue Board (Kanban)

Colonnes représentant les étapes du workflow.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Backlog    │  │  À faire    │  │  En cours   │  │  Terminé    │
│             │  │             │  │  (max: 3)   │  │             │
│ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │
│ │ Issue 5 │ │  │ │ Issue 3 │ │  │ │ Issue 1 │ │  │ │ Issue 7 │ │
│ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │
│ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │
│ │ Issue 6 │ │  │ │ Issue 4 │ │  │ │ Issue 2 │ │  │ │ Issue 8 │ │
│ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

**Idéal pour** : visualiser le flux de travail, limiter le WIP, daily standups.

#### Vue Roadmap (Timeline)

Positionne les issues sur une timeline en utilisant les champs de date ou d'itération.

```
Mars 2026                           Avril 2026
│ S10    │ S11    │ S12    │ S13    │ S14    │ S15    │
│        │        │        │        │        │        │
│ ██████ Auth OAuth ██████ │        │        │        │
│        │ ████ Fix TVA ██ │        │        │        │
│        │        │        │ ██████ Page accueil █████ │
│        │        │        │        │ ███ API v2 █████ │
```

**Idéal pour** : planification moyen/long terme, visualisation des dépendances temporelles.

#### Conseil

Créer des **vues sauvegardées** pour différents usages :
- "Sprint en cours" (board filtré sur `iteration:@current`)
- "Backlog par priorité" (table triée par priorité)
- "Roadmap Q1" (roadmap filtrée par date)
- "Mon travail" (table filtrée sur `assignee:@me`)

---

### 2.5 Automations

#### Workflows intégrés

GitHub Projects offre des workflows automatiques préconfigurés :

| Workflow | Déclencheur | Action |
|----------|-------------|--------|
| **Auto-add to project** | Issue créée dans un dépôt | Ajout automatique au projet (filtrable par label) |
| **Item closed** | Issue/PR fermée | Statut passe à "Done" |
| **Item reopened** | Issue/PR rouverte | Statut revient à "Todo" |
| **PR merged** | PR fusionnée | Statut passe à "Done" |
| **Auto-archive** | Critères définis | Archivage automatique des éléments anciens |

#### Intégration avec GitHub Actions

Pour des automations plus poussées, utiliser l'API GraphQL ProjectsV2 via GitHub Actions :

```yaml
# Exemple : ajouter automatiquement une PR au projet
name: Add PR to project
on:
  pull_request:
    types: [ready_for_review]
jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v1
        with:
          project-url: https://github.com/orgs/DASN/projects/1
          github-token: ${{ secrets.PROJECT_TOKEN }}
```

---

### 2.6 Itérations et Sprints

Les champs d'itération permettent de planifier le travail en blocs de temps répétitifs.

#### Configuration

1. Dans la vue table, ajouter un nouveau champ de type **Iteration**
2. Définir la date de début et la durée (1 ou 2 semaines typiquement)
3. Configurer les pauses éventuelles (vacances, jours fériés)
4. Assigner les issues aux itérations

#### Fonctionnalités clés

- **Filtre `iteration:@current`** : afficher uniquement les éléments du sprint en cours
- **Filtre `iteration:@next`** : préparer le prochain sprint
- **Déplacement en masse** : reporter le travail non terminé au sprint suivant
- **Vue Roadmap par itération** : visualiser la charge de travail sur plusieurs sprints

---

### 2.7 Suivi de l'Avancement

- **Barre de progression** dans les milestones (ratio issues ouvertes/fermées)
- **Groupement par statut** avec somme des story points par colonne
- **Filtres dynamiques** pour isoler :
  - Le travail en retard
  - Les éléments bloqués
  - Les éléments sans assignée
- **Slicing** : découper une vue par un champ spécifique (ex: par équipe, par priorité)

---

### 2.8 Bonnes Pratiques Agile/Scrum

#### Organisation recommandée

| Cérémonie Scrum | Vue GitHub Projects | Configuration |
|-----------------|---------------------|---------------|
| **Product Backlog** | Table | Toutes les issues, triées par priorité |
| **Sprint Planning** | Table | Estimer (story points) et assigner à l'itération |
| **Sprint Backlog** | Board | Filtré sur `iteration:@current` |
| **Daily Standup** | Board | Sprint en cours, groupé par assignée |
| **Sprint Review** | Table | Filtré sur itération passée, statut "Done" |
| **Rétrospective** | Table | Métriques du sprint terminé |

#### Workflow type

```
1. BACKLOG GROOMING
   → Créer/affiner les issues dans le backlog
   → Estimer en story points
   → Prioriser (champ Priorité)

2. SPRINT PLANNING
   → Sélectionner les issues pour le sprint
   → Assigner l'itération courante
   → Assigner les responsables

3. PENDANT LE SPRINT
   → Déplacer les cartes sur le board (Todo → In Progress → Review → Done)
   → Lier les PR aux issues (Closes #123)
   → Limiter le WIP (max 2-3 items par personne)

4. FIN DE SPRINT
   → Revoir les éléments terminés
   → Reporter les éléments non terminés à l'itération suivante
   → Archiver les éléments anciens
```

#### Hiérarchie du travail avec les sub-issues

```
Epic (Issue parente)
├── Story 1 (Sub-issue)
│   ├── Tâche 1.1 (Sub-issue)
│   └── Tâche 1.2 (Sub-issue)
├── Story 2 (Sub-issue)
│   ├── Tâche 2.1 (Sub-issue)
│   └── Tâche 2.2 (Sub-issue)
└── Story 3 (Sub-issue)
```

#### Règles d'or

1. **Source unique de vérité** : tout le suivi dans GitHub Projects, synchronisé avec issues et PR
2. **Décomposer** : Epic → Story → Tâche pour un suivi granulaire
3. **Lier systématiquement** : chaque PR référence une issue (`Closes #123`)
4. **Limiter le WIP** : ne pas dépasser 2-3 éléments en cours par personne
5. **Mettre à jour quotidiennement** : le board reflète la réalité du sprint
6. **Automatiser** : utiliser les workflows intégrés pour réduire le travail manuel

---

## Ressources

- [GitHub Docs — About Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects)
- [GitHub Docs — Best practices for Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/best-practices-for-projects)
- [GitHub Docs — About iteration fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-iteration-fields)
- [GitHub Docs — About code owners](https://docs.github.com/articles/about-code-owners)
- [GitHub Well-Architected — Rulesets Best Practices](https://wellarchitected.github.com/library/governance/recommendations/managing-repositories-at-scale/rulesets-best-practices/)
