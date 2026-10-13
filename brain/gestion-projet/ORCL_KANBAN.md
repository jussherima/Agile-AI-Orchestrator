# ORCL_KANBAN — Guide complet de gestion Kanban

## Table des matières

1. [Fondamentaux du Kanban](#1-fondamentaux-du-kanban)
2. [Le tableau Kanban](#2-le-tableau-kanban)
3. [Les limites WIP (Work In Progress)](#3-les-limites-wip-work-in-progress)
4. [Les cartes (tickets)](#4-les-cartes-tickets)
5. [Les classes de service](#5-les-classes-de-service)
6. [Les politiques explicites](#6-les-politiques-explicites)
7. [Les 7 cadences (réunions)](#7-les-7-cadences-réunions)
8. [Les métriques Kanban](#8-les-métriques-kanban)
9. [Gestion des goulots d'étranglement](#9-gestion-des-goulots-détranglement)
10. [Gestion des rejets QA et du rework](#10-gestion-des-rejets-qa-et-du-rework)
11. [Kanban vs Scrum vs Scrumban](#11-kanban-vs-scrum-vs-scrumban)
12. [Le modèle de maturité Kanban (KMM)](#12-le-modèle-de-maturité-kanban-kmm)
13. [Anti-patterns courants](#13-anti-patterns-courants)
14. [Outils Kanban recommandés](#14-outils-kanban-recommandés)
15. [Sources](#15-sources)

---

## 1. Fondamentaux du Kanban

### Les 6 pratiques générales (Kanban University)

| # | Pratique | Description |
|---|---------|-------------|
| 1 | **Visualiser le travail** | Rendre tout le travail visible sur un tableau |
| 2 | **Limiter le travail en cours (WIP)** | Ne pas commencer plus qu'on ne peut finir |
| 3 | **Gérer le flux** | Observer et optimiser la fluidité du travail |
| 4 | **Rendre les politiques explicites** | Écrire les règles du jeu pour tous |
| 5 | **Mettre en place des boucles de feedback** | Réunions régulières (cadences) |
| 6 | **S'améliorer collaborativement, évoluer expérimentalement** | Changement continu basé sur les données |

### Le système Pull (tirer)

```
❌ PUSH (traditionnel) : Le manager POUSSE le travail vers l'équipe
   → Surcharge, files d'attente, stress

✅ PULL (Kanban) : L'équipe TIRE le travail quand elle a de la capacité
   → Un slot vide dans une colonne = signal pour tirer un nouveau ticket
   → On ne commence rien de nouveau tant qu'il n'y a pas de place
```

> **Principe fondamental** : Finir le travail en cours est plus important que commencer du nouveau travail.

---

## 2. Le tableau Kanban

### Structure de base

```
┌──────────┬───────────┬──────────────┬──────────┬────────┐
│ BACKLOG  │  READY    │ IN PROGRESS  │  REVIEW  │  DONE  │
│          │           │   WIP: 3     │  WIP: 2  │        │
├──────────┼───────────┼──────────────┼──────────┼────────┤
│ Ticket 7 │ Ticket 5  │ Ticket 3 [A] │ Ticket 1 │ ✓ T-0  │
│ Ticket 8 │ Ticket 6  │ Ticket 4 [B] │ Ticket 2 │ ✓ T-9  │
│ Ticket 9 │           │              │          │ ✓ T-10 │
│ Ticket 10│           │              │          │        │
└──────────┴───────────┴──────────────┴──────────┴────────┘
```

### Colonnes recommandées pour le développement logiciel

| Colonne | Rôle | WIP conseillé |
|---------|------|---------------|
| **Backlog** | Tous les tickets à faire (non priorisés) | Pas de limite |
| **Ready** | Tickets priorisés, prêts à être tirés | 5-10 |
| **In Progress / Dev** | Travail en cours de développement | **Nb devs + 1** |
| **Code Review** | En attente ou en cours de review | 2-3 |
| **Testing / QA** | En cours de test | 2-3 |
| **Ready to Deploy** | Validé, prêt à partir en prod | 3-5 |
| **Done** | Déployé / Livré | Pas de limite |

### Colonnes avancées : séparer "en cours" et "en attente"

```
┌─────────┬────────────────────┬────────────────────┬───────┐
│ BACKLOG │    DEVELOPMENT     │      REVIEW        │ DONE  │
│         ├─────────┬──────────┼─────────┬──────────┤       │
│         │ Doing   │ Waiting  │ Doing   │ Waiting  │       │
│         │ WIP: 3  │          │ WIP: 2  │          │       │
└─────────┴─────────┴──────────┴─────────┴──────────┴───────┘
```

Séparer "Doing" et "Waiting" révèle les **files d'attente cachées** — souvent la vraie source de lenteur.

---

## 3. Les limites WIP (Work In Progress)

### Pourquoi limiter ?

```
Sans WIP limits :
  Dev 1 : 🔴🔴🔴🔴🔴 (5 tickets en parallèle)
  → Context switching constant
  → Rien n'est jamais fini
  → Tout prend 3x plus de temps

Avec WIP limits :
  Dev 1 : 🟢🟢 (2 tickets max)
  → Focus total
  → Tickets terminés rapidement
  → Flux régulier de livraisons
```

### Comment définir les limites WIP

| Méthode | Formule | Exemple |
|---------|---------|---------|
| **Par colonne** | Nombre de personnes travaillant sur cette étape + 1 | 3 devs → WIP = 4 |
| **Par personne** | 1 à 2 tickets max en simultané | WIP personnel = 2 |
| **Globale** | Nombre total de membres × 1.5 | Équipe de 4 → WIP global = 6 |

### Que faire quand la limite est atteinte ?

1. **Aider à finir** un ticket en cours (swarming)
2. **Débloquer** un ticket qui attend
3. **Faire de la review** pour libérer un slot
4. **Améliorer le processus** (documentation, automatisation)
5. **NE PAS** commencer un nouveau ticket

---

## 4. Les cartes (tickets)

### Contenu d'une carte Kanban

```
┌──────────────────────────────────────┐
│ 🔴 HAUTE PRIORITÉ          [DEV-42] │
├──────────────────────────────────────┤
│ Titre : Corriger le bug de login     │
│                                      │
│ Assigné : @herimalala                │
│ Date limite : 15 mars                │
│ Classe : Standard                    │
│                                      │
│ Bloqueur : Attente API externe       │
│ Âge : 3 jours                        │
│ Story Points : 3                     │
└──────────────────────────────────────┘
```

### Informations essentielles

- **Titre clair** : action + objet
- **Assigné** : qui travaille dessus
- **Priorité** : visuelle (couleur, tag)
- **Date limite** : si applicable
- **Bloqueurs** : visibles immédiatement
- **Âge du ticket** : depuis combien de temps il est en cours

---

## 5. Les classes de service

Les classes de service définissent **comment traiter un ticket selon son urgence** :

| Classe | Politique | WIP | Exemple |
|--------|-----------|-----|---------|
| **Expedite** (urgence) | Passe devant tout, pas de limite de WIP, traité immédiatement | **1 seul** à la fois dans tout le système | Bug critique en production |
| **Fixed Date** (date fixe) | Doit être livré à une date précise, planifié en amont | Normal | Feature pour un lancement prévu |
| **Standard** | Traité en FIFO (premier arrivé, premier servi) | Normal | Feature classique, bug non critique |
| **Intangible** (différable) | Important mais pas urgent, risque si jamais fait | Remplir les slots vides | Dette technique, refactoring |

### Visualisation par swimlanes

```
┌──────────────────────────────────────────────────────┐
│ EXPEDITE (WIP: 1)                                    │
│ ┌─────────┬────────────┬──────────┬────────┬───────┐ │
│ │         │            │ BUG-911  │        │       │ │
│ └─────────┴────────────┴──────────┴────────┴───────┘ │
├──────────────────────────────────────────────────────┤
│ FIXED DATE                                           │
│ ┌─────────┬────────────┬──────────┬────────┬───────┐ │
│ │ FEAT-20 │            │ FEAT-18  │        │       │ │
│ └─────────┴────────────┴──────────┴────────┴───────┘ │
├──────────────────────────────────────────────────────┤
│ STANDARD                                             │
│ ┌─────────┬────────────┬──────────┬────────┬───────┐ │
│ │ FEAT-25 │ FEAT-22    │ FEAT-21  │ FEAT-19│       │ │
│ │ FEAT-26 │ FEAT-23    │          │        │       │ │
│ └─────────┴────────────┴──────────┴────────┴───────┘ │
├──────────────────────────────────────────────────────┤
│ INTANGIBLE                                           │
│ ┌─────────┬────────────┬──────────┬────────┬───────┐ │
│ │ TECH-05 │            │ TECH-03  │        │       │ │
│ └─────────┴────────────┴──────────┴────────┴───────┘ │
└──────────────────────────────────────────────────────┘
        Backlog    Ready    In Progress  Review   Done
```

---

## 6. Les politiques explicites

Les **politiques** sont les règles écrites que tout le monde doit suivre.

### Politique de "Ready" (Definition of Ready)

```
Un ticket peut entrer dans "Ready" quand :
- [ ] Le besoin est clairement décrit
- [ ] Les critères d'acceptation sont définis
- [ ] Les dépendances sont identifiées et résolues
- [ ] L'estimation est faite
```

### Politique de "Done" (Definition of Done)

```
Un ticket peut passer dans "Done" quand :
- [ ] Le code est écrit et fonctionnel
- [ ] Les tests unitaires passent (couverture > 80%)
- [ ] La code review est approuvée
- [ ] Les tests QA sont validés
- [ ] La documentation est mise à jour
- [ ] Le déploiement en staging est vérifié
```

### Politique de Pull (quand tirer un nouveau ticket)

```
- On tire un ticket de la colonne précédente seulement si on a un slot libre
- On prend le ticket le plus haut (le plus prioritaire)
- Les Expedite passent toujours en premier
- Si un ticket est bloqué depuis > 2 jours, lever un signal
```

### Politique de blocage

```
- Mettre un flag rouge visible sur le ticket bloqué
- Notifier le Standup du lendemain
- Si bloqué > 48h → escalade au manager
```

---

## 7. Les 7 cadences (réunions)

| Cadence | Fréquence | Durée | Objectif |
|---------|-----------|-------|----------|
| **Daily Standup** | Quotidien | 15 min | Quels tickets bougent ? Quels bloqueurs ? |
| **Replenishment Meeting** | Hebdo ou bi-hebdo | 30 min | Quels tickets entrent dans "Ready" ? Priorisation |
| **Delivery Planning** | Hebdo | 30 min | Qu'est-ce qui est prêt à livrer ? |
| **Service Delivery Review** | Bi-hebdo ou mensuel | 1h | Analyse des métriques (lead time, throughput) |
| **Operations Review** | Mensuel | 1-2h | Vue globale inter-équipes, coordination |
| **Strategy Review** | Trimestriel | 2-4h | Direction stratégique, ajustements majeurs |
| **Risk Review** | Mensuel | 1h | Identification et gestion des risques |

### Le Daily Standup Kanban (différent du Scrum)

```
❌ Scrum Standup : "Qu'est-ce que j'ai fait hier ?"
   → Centré sur les PERSONNES

✅ Kanban Standup : "Quels tickets sont bloqués ?"
   → Centré sur le FLUX de travail

Format Kanban :
  1. Parcourir le tableau de DROITE à GAUCHE (finir > commencer)
  2. Pour chaque ticket en cours :
     - Est-il bloqué ?
     - A-t-il besoin d'aide ?
     - Peut-il avancer aujourd'hui ?
  3. Y a-t-il des tickets qui vieillissent trop ?
```

---

## 8. Les métriques Kanban

### Les 4 métriques essentielles

| Métrique | Définition | Comment la calculer | Objectif |
|----------|------------|--------------------|---------|
| **Lead Time** | Temps total du moment où le ticket est demandé jusqu'à sa livraison | Date de livraison - Date de demande | Mesurer l'expérience client |
| **Cycle Time** | Temps de travail actif sur un ticket | Date de livraison - Date de début de travail | Mesurer l'efficacité de l'équipe |
| **Throughput** | Nombre de tickets livrés par unité de temps | Tickets livrés / semaine | Mesurer la productivité |
| **WIP** | Nombre de tickets en cours à un instant T | Compter les tickets entre "In Progress" et "Done" | Contrôler la charge |

### Relation fondamentale : Loi de Little

```
Lead Time = WIP / Throughput

Exemple :
  WIP = 6 tickets en cours
  Throughput = 3 tickets/semaine
  → Lead Time = 6/3 = 2 semaines

Pour réduire le Lead Time :
  → Réduire le WIP (limiter le travail en cours)
  → Augmenter le Throughput (améliorer le processus)
```

### Le Cumulative Flow Diagram (CFD)

```
Tickets │
cumulés │     ╱─── Done
        │    ╱────── Review
        │   ╱──────── In Progress
        │  ╱────────── Ready
        │ ╱──────────── Backlog
        │╱
        └──────────────────── Temps

Ce que le CFD révèle :
  - Bandes qui s'élargissent → WIP qui augmente (problème !)
  - Bandes parallèles et stables → flux sain
  - Bande qui s'élargit brusquement → goulot d'étranglement
  - Pente de "Done" = throughput (plus c'est raide, mieux c'est)
```

### Cycle Time Scatterplot

```
Cycle     │
Time      │  .
(jours)   │     .        .
          │  . .  .  .
          │ .. ... .. ...  .
          │.....................
          └──────────────────── Tickets (chronologique)

  85e percentile ─── "85% des tickets se terminent en X jours"
  → Utilisé pour faire des prévisions fiables
```

---

## 9. Gestion des goulots d'étranglement

### Comment les détecter

| Signal | Ce que ça indique |
|--------|-------------------|
| Tickets qui s'accumulent avant une colonne | Cette colonne est un goulot |
| Une colonne toujours pleine à la limite WIP | Capacité insuffisante à cette étape |
| Tickets qui "vieillissent" dans une colonne | Blocage ou manque de ressources |
| CFD avec une bande qui s'élargit | Goulot à cette étape |

### Stratégies de résolution

| Stratégie | Description |
|-----------|-------------|
| **Swarming** | Toute l'équipe se concentre sur le goulot pour le vider |
| **Réduire le WIP en amont** | Moins d'entrée = moins de pression sur le goulot |
| **Cross-training** | Former l'équipe pour que plusieurs personnes puissent traiter cette étape |
| **Automatiser** | Automatiser les tâches répétitives (tests, déploiement, review) |
| **Diviser la colonne** | Séparer en sous-étapes pour mieux identifier le problème |
| **Ajouter de la capacité** | En dernier recours : ajouter des personnes à cette étape |

### Les 5 étapes de focalisation (Theory of Constraints)

```
1. IDENTIFIER le goulot → Où s'accumulent les tickets ?
2. EXPLOITER le goulot → Maximiser son efficacité (0 temps perdu)
3. SUBORDONNER tout au goulot → Aligner le rythme du système sur le goulot
4. ÉLEVER le goulot → Investir pour augmenter sa capacité
5. RECOMMENCER → Le goulot a bougé ? Reprendre à l'étape 1
```

---

## 10. Gestion des rejets QA et du rework

### La règle d'or : NE PAS reculer le ticket

```
❌ MAUVAISE PRATIQUE : Remettre le ticket dans "In Progress / Dev"
   → Casse le WIP limit de la colonne Dev
   → Fausse les métriques (lead time, cycle time)
   → Masque le vrai problème
   → Équivalent d'un "push" dans un système pull

✅ BONNE PRATIQUE : Le ticket RESTE dans la colonne où le défaut a été détecté
   → On le marque comme BLOQUÉ (flag rouge)
   → L'équipe swarme pour le corriger
   → Le flux reste lisible et les métriques fiables
```

> **Pourquoi ?** Le défaut a été **découvert** en QA, pas **créé** en QA. Reculer le ticket revient à pousser du travail en amont vers une colonne qui est peut-être déjà à sa limite WIP.

### Les 3 stratégies selon la gravité

#### Stratégie 1 — Remarques mineures : Swarming en place

```
┌─────────┬──────────┬──────────┬──────────────┬────────┐
│ Backlog │   Dev    │  Review  │     QA       │  Done  │
│         │ WIP: 3   │ WIP: 2   │   WIP: 3     │        │
├─────────┼──────────┼──────────┼──────────────┼────────┤
│         │          │          │ FLAG T-42    │ ✓ T-40 │
│         │          │          │   T-43       │ ✓ T-41 │
└─────────┴──────────┴──────────┴──────────────┴────────┘

→ Le dev qui a travaillé sur T-42 vient corriger DANS la colonne QA
→ Le ticket ne bouge pas
→ QA reteste immédiatement après correction
→ Si OK → Done
```

**Quand** : Bugs mineurs, ajustements UI, corrections rapides (< 2h)

#### Stratégie 2 — Défaut significatif : Flag + politique explicite

```
Le ticket T-42 reste en QA avec :
  - FLAG "Blocked - QA Rejection"
  - Liste des remarques QA (commentaire sur le ticket)
  - Le dev est notifié
  - Le fix est traité comme une PRIORITÉ (pas un nouveau ticket)
```

**Politique de rework à écrire :**

```
Quand QA rejette un ticket :
1. Le ticket reste dans la colonne QA
2. Ajouter un flag "Rejected" avec les remarques détaillées
3. Le développeur original prend en charge le fix
4. Le fix NE COMPTE PAS comme un nouveau ticket
5. QA reteste dès que le fix est poussé
6. Si rejeté 3 fois → escalade + rétrospective
```

#### Stratégie 3 — Défaut majeur / refonte nécessaire : Nouveau ticket

```
Cas où un NOUVEAU ticket est justifié :
  - Le scope initial est terminé et validé
  - Le QA a trouvé un problème dans un AUTRE périmètre
  - La remarque est en fait une NOUVELLE fonctionnalité
  - Le fix nécessite > 1 jour de travail et un re-design

→ Le ticket original passe en Done (le scope initial est livré)
→ Un nouveau ticket est créé pour le défaut/évolution
→ Ce nouveau ticket entre dans le Backlog normalement
```

### Ce qu'il ne faut PAS faire : la colonne "Blocked"

```
❌ Créer une colonne "Blocked" ou "Rejected" sur le board

Pourquoi c'est un anti-pattern :
  - Les tickets vont s'y accumuler et y mourir
  - Ça cache le problème au lieu de le rendre urgent
  - Le ticket sort du flux normal → plus personne ne s'en occupe
  - Les métriques deviennent illisibles

✅ À la place : utiliser un FLAG visuel sur le ticket
   (couleur rouge, icône, tag "blocked")
   Le ticket reste dans sa colonne mais est visuellement différent
```

### Visualisation sur le board

#### Avec flags (recommandé)

```
┌──────────┬──────────┬──────────┬──────────────┬────────┐
│ Backlog  │   Dev    │  Review  │     QA       │  Done  │
│          │ WIP: 3   │ WIP: 2   │   WIP: 3     │        │
├──────────┼──────────┼──────────┼──────────────┼────────┤
│ T-50     │ T-47     │ T-45     │ FLAG T-42    │ ✓ T-40 │
│ T-51     │ T-48     │          │   T-43       │ ✓ T-41 │
│          │          │          │   T-44       │ ✓ T-39 │
└──────────┴──────────┴──────────┴──────────────┴────────┘
                                    ↑
                        T-42 est flaggé "Rejected"
                        Le dev swarme pour corriger
                        QA retestera ensuite
```

#### Avec sous-colonnes (pour les équipes matures)

```
┌──────────┬─────────────────────────────────┬────────┐
│          │              QA                 │        │
│ ...      ├──────────┬──────────┬───────────┤  Done  │
│          │ Testing  │ Rework   │ Retest    │        │
│          │ WIP: 2   │ WIP: 1   │ WIP: 1    │        │
├──────────┼──────────┼──────────┼───────────┼────────┤
│          │ T-43     │ T-42     │           │ ✓ T-40 │
│          │ T-44     │          │           │ ✓ T-41 │
└──────────┴──────────┴──────────┴───────────┴────────┘

Flux : Testing → (si rejeté) → Rework → Retest → Done
       Testing → (si OK) → Done directement
```

### Métriques de qualité QA

| Métrique | Formule | Objectif |
|----------|---------|----------|
| **Taux de rejet QA** | Tickets rejetés / Tickets testés x 100 | < 10-15% |
| **Taux de rework** | Tickets retravaillés / Tickets livrés x 100 | < 10% |
| **Nombre de rejets par ticket** | Compteur de rejets sur chaque ticket | Idéal : 0-1 |
| **Temps de rework** | Temps entre rejet et retest validé | Mesurer pour réduire |

### Signaux d'alerte

```
Taux de rejet > 30% → Problème en amont :
  - Les critères d'acceptation ne sont pas assez clairs
  - Pas de review technique avant le QA
  - Le dev ne teste pas en local avant de passer en QA

→ Solution : Prévention plutôt que détection
```

### Prévenir plutôt que guérir

| Pratique préventive | Impact sur le taux de rejet |
|--------------------|-----------------------------|
| **Kickoff QA-Dev** avant le dev | 30-40% → 5-8% de rejet |
| **Critères d'acceptation** clairs et testables | Réduction majeure des malentendus |
| **Review technique** avant le QA | Attrape les bugs de logique avant QA |
| **Tests automatisés** (unit + intégration) | Élimine les régressions |
| **Definition of Done** stricte | Le dev ne passe en QA que si tout est vérifié |
| **Pair programming** ou mob programming | Moins de bugs dès l'écriture |

### Le Kickoff QA-Dev (shift-left)

```
AVANT le développement :
  Dev + QA se réunissent 15 min
  ├── QA explique comment il va tester
  ├── Dev comprend les edge cases attendus
  ├── Ils s'alignent sur les critères d'acceptation
  └── Résultat : le dev code en pensant aux tests QA

→ Taux de rejet divisé par 5 selon les retours d'expérience
```

---

## 11. Kanban vs Scrum vs Scrumban

| Aspect | Kanban | Scrum | Scrumban |
|--------|--------|-------|----------|
| **Cadence** | Flux continu | Sprints fixes (2-4 sem) | Flux continu + planning périodique |
| **Rôles** | Aucun rôle imposé | Scrum Master, PO, Dev Team | Flexibles |
| **Changements** | Autorisés à tout moment | Uniquement entre sprints | À tout moment |
| **Métriques** | Lead time, throughput | Vélocité, burndown | Mix des deux |
| **WIP Limits** | **Oui** (fondamental) | Non (implicite via sprint) | **Oui** |
| **Planning** | Continu (replenishment) | Sprint Planning | On-demand |
| **Board** | Persistant | Réinitialisé chaque sprint | Persistant |
| **Idéal pour** | Maintenance, support, ops, flux continu | Projets avec deadlines, features planifiées | Équipes mixtes (features + support) |

### Quand choisir quoi ?

```
Ton travail est-il prévisible et planifiable ?
  ├── OUI → Scrum
  └── NON → Ton travail a-t-il des deadlines régulières ?
              ├── OUI → Scrumban
              └── NON → Kanban
```

---

## 12. Le modèle de maturité Kanban (KMM)

| Niveau | Nom | Pratiques | Culture |
|--------|-----|-----------|---------|
| **0** | Inconscient | Aucune visualisation | "On fait comme d'habitude" |
| **1** | Émergent | Tableau basique, visualisation du travail | Prise de conscience |
| **2** | Défini | WIP limits, mesure du lead time, politiques explicites | Collaboration |
| **3** | Adapté | Classes de service, cadences régulières, métriques | Orientation client |
| **4** | Géré quantitativement | Gestion des risques, prévisions statistiques | Culture data-driven |
| **5** | Optimisé | Amélioration systémique, expérimentation | Organisation apprenante |
| **6** | Leadership | Innovation, influence stratégique | Excellence opérationnelle |

### Progression recommandée

```
Débutant → Commencer par :
  ✅ Visualiser le travail (tableau basique)
  ✅ Limiter le WIP (même de manière lâche)
  ✅ Daily standup centré sur le flux

Intermédiaire → Ajouter :
  ✅ Politiques explicites (DoR, DoD)
  ✅ Classes de service
  ✅ Mesurer lead time et cycle time
  ✅ Replenishment meeting hebdo

Avancé → Maîtriser :
  ✅ CFD et analyse statistique
  ✅ Prévisions basées sur les données
  ✅ Gestion des risques
  ✅ Amélioration continue expérimentale
```

---

## 13. Anti-patterns courants

| Anti-pattern | Problème | Solution |
|-------------|----------|----------|
| **Pas de WIP limits** | Tout le monde travaille sur tout → rien n'est fini | Mettre des limites, même larges au début |
| **WIP limits ignorés** | Les limites existent mais ne sont pas respectées | Les rendre visibles, en discuter au standup |
| **Tableau décoratif** | Le tableau ne reflète pas la réalité | Mettre à jour en temps réel, sanctuariser le standup |
| **Pas de politiques écrites** | Chacun interprète les règles à sa façon | Écrire et afficher les politiques |
| **Standup centré sur les personnes** | "Qu'as-tu fait hier ?" au lieu de regarder le flux | Parcourir le tableau de droite à gauche |
| **Backlog infini** | Des centaines de tickets jamais traités | Purger régulièrement, limiter le backlog |
| **Pas de métriques** | Impossible de savoir si on s'améliore | Commencer par mesurer le lead time |
| **Tickets trop gros** | Un ticket reste "In Progress" pendant 2 semaines | Découper (cf. ORCL_TICKET_SLICE.md) |
| **Tout est "Expedite"** | Si tout est urgent, rien n'est urgent | 1 seul Expedite à la fois, maximum |
| **Ignorer les bloqueurs** | Les tickets bloqués restent sans action | Flag visible + escalade automatique |
| **Colonne "Blocked"** | Les tickets y meurent, cachés du flux | Utiliser des flags visuels à la place |
| **Reculer les tickets** | Casse le WIP, fausse les métriques | Garder en place + flag + swarming |

---

## 14. Outils Kanban recommandés

| Outil | Type | Idéal pour |
|-------|------|------------|
| **Linear** | Digital | Équipes dev, intégration Git |
| **Jira** | Digital | Grandes équipes, personnalisation poussée |
| **Trello** | Digital | Petites équipes, simplicité |
| **GitHub Projects** | Digital | Projets open source, intégration GitHub native |
| **Notion** | Digital | Équipes non-tech, documentation intégrée |
| **Asana** | Digital | Équipes cross-fonctionnelles |
| **Tableau physique** | Physique | Colocalisation, standup en présentiel |

---

## 15. Sources

### Documentation officielle Kanban
- [The Official Kanban Guide - Kanban University](https://kanban.university/kanban-guide/)
- [The Official Kanban Guide (PDF)](https://kanban.university/wp-content/uploads/2023/04/The-Official-Kanban-Guide_A4.pdf)
- [Kanban Cadences - Kanban University](https://resources.kanban.university/kanban-cadences/)
- [Kanban Maturity Model - Kanban University](https://kanban.university/kanban-development-path/kmm/)

### Guides pratiques
- [WIP Limits - Atlassian](https://www.atlassian.com/agile/kanban/wip-limits)
- [Kanban Principles - Atlassian](https://www.atlassian.com/agile/project-management/kanban-principles)
- [Kanban Metrics - Atlassian](https://www.atlassian.com/agile/project-management/kanban-metrics)
- [Kanban vs Scrum - Atlassian](https://www.atlassian.com/agile/kanban/kanban-vs-scrum)
- [WIP Limits Guide - Businessmap](https://businessmap.io/kanban-resources/getting-started/what-is-wip)
- [Classes of Service - Businessmap](https://businessmap.io/kanban-resources/getting-started/kanban-classes-of-service)
- [Kanban Swimlanes - Businessmap](https://businessmap.io/kanban-resources/kanban-software/kanban-swimlanes)
- [Kanban Board Examples - Businessmap](https://businessmap.io/kanban-resources/kanban-software/kanban-board-examples)
- [Kanban for Software Development - Businessmap](https://businessmap.io/blog/kanban-software-development)
- [Pull Systems - Kanban Tool](https://kanbantool.com/kanban-guide/pull-systems)
- [The Kanban Method - Kanban Tool](https://kanbantool.com/kanban-method)
- [Best Practices for Kanban Columns - Multiboard](https://www.multiboard.dev/posts/best-practices-kanban-columns)

### Métriques et analyse
- [Lead Time vs Cycle Time - Businessmap](https://businessmap.io/kanban-resources/kanban-software/kanban-lead-cycle-time)
- [Kanban Analytics - Kanban Tool](https://kanbantool.com/kanban-analytics-and-metrics)
- [Kanban Metrics - Nave](https://getnave.com/blog/kanban-metrics/)
- [Cumulative Flow Diagrams - Adobe](https://business.adobe.com/blog/basics/cumulative-flow)

### Goulots, rework et anti-patterns
- [Don't Move Items Backward - David J. Anderson](https://djaa.com/kanban-evergreen-dont-move-items-backward-on-the-kanban-board/)
- [Kanban: Avoiding Going Backwards - Jez Halford](https://medium.com/@jezhalford/kanban-avoiding-going-backwards-29077793c499)
- [3 Mistakes with Kanban Blocked Column - Nave](https://getnave.com/blog/kanban-blocked-column/)
- [Stop Using a Blocked State - The Pragmatic Agilists](https://medium.com/the-pragmatic-agilists/stop-using-a-blocked-state-column-57496af15589)
- [Avoid Blocked Columns - Evogility](https://evogility.com.au/avoid-using-blocked-columns-on-kanban-boards/)
- [Resolving Bottlenecks in Kanban - Kanban Tool](https://kanbantool.com/blog/resolving-bottlenecks-in-kanban)
- [Bottlenecks & Five Focusing Steps - Kanban Tool](https://kanbantool.com/kanban-guide/bottlenecks)
- [Handling Ticket Issues With Kanban - Nimblework](https://www.nimblework.com/blog/handling-ticket-issues-with-kanban/)
- [Kanban Anti-patterns](https://imwrightshardcode.com/kanban-anti-patterns/)
- [QA Teams Kanban Board - Businessmap](https://businessmap.io/blog/qa-teams-kanban-board)
- [How to Handle Defects in Testing - Scrum.org](https://www.scrum.org/forum/scrum-forum/33126/kanban-board-how-handle-defects-found-testing-phase)

### Cadences et réunions
- [Kanban Cadences - Teamhood](https://teamhood.com/kanban/kanban-cadences/)
- [Kanban Cadences Guide - Teaching Agile](https://teachingagile.com/kanban/introduction/kanban-cadences)
- [Kanban Meetings - Nave](https://getnave.com/blog/kanban-meetings/)
- [Replenishment Meeting - Nimblework](https://www.nimblework.com/blog/kanban-replenishment-meeting/)

### Scrumban
- [Scrumban - Atlassian](https://www.atlassian.com/agile/project-management/scrumban)
- [Scrumban Guide - Asana](https://asana.com/resources/scrumban)

### Maturity Model
- [Kanban Maturity Model Explained - Kanban Zone](https://kanbanzone.com/2024/kanban-maturity-model/)
- [KMM - David J. Anderson School](https://djaa.com/kanban-maturity-model/)
