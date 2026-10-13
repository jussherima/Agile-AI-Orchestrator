# Guide Complet : Rédiger de Bons Tickets

## 1. Structure Universelle d'un Bon Ticket

Quel que soit le type (bug, feature, amélioration), un ticket doit contenir :

| Élément | Description |
|---|---|
| **Titre clair** | Commence par un verbe d'action, résume le ticket en une phrase. Ex : "Corriger le crash au login sur mobile" et non "Bug login" |
| **Description / Contexte** | Le "pourquoi" — quel problème on résout, pour qui, et dans quel contexte |
| **Critères d'acceptation** | Liste précise de conditions pour considérer le ticket comme "terminé" |
| **Priorité / Sévérité** | Blocker, Critique, Majeur, Mineur, Trivial |
| **Labels / Composants** | Catégorisation (UI, Backend, API, etc.) |
| **Dépendances** | Liens vers les tickets liés ou bloquants |
| **Assignation** | Qui est responsable |

---

## 2. Par Type de Ticket

### Bug / Fix

**Template :**

```
Titre : [Verbe] + [Description du bug]
Ex : "Corriger l'erreur 500 lors de la soumission du formulaire de contact"

## Description
Brève description du problème observé.

## Étapes pour reproduire
1. Aller sur la page X
2. Remplir le formulaire avec Y
3. Cliquer sur "Envoyer"

## Comportement attendu
Le formulaire est soumis et un message de confirmation s'affiche.

## Comportement observé
Une erreur 500 s'affiche. Le formulaire n'est pas soumis.

## Environnement
- OS : Android 14
- Navigateur : Chrome 120
- Version de l'app : 2.3.1

## Captures d'écran / Logs
[Joindre screenshots, vidéos, logs d'erreur]

## Sévérité / Priorité
Majeur / Haute

## Critères d'acceptation
- [ ] Le formulaire se soumet sans erreur
- [ ] Le message de confirmation s'affiche
- [ ] Aucune régression sur les autres formulaires
```

**Bonnes pratiques bug :**

- Un bug = un ticket (ne jamais regrouper plusieurs bugs)
- Toujours inclure les étapes de reproduction exactes
- Utiliser un langage neutre (pas de "c'est la faute de X")
- Joindre des captures d'écran ou vidéos
- Préciser l'environnement exact (OS, navigateur, version)

---

### Feature / Amélioration

**Template (format User Story) :**

```
Titre : [Verbe] + [Fonctionnalité]
Ex : "Ajouter un système de liste de souhaits pour les produits"

## User Story
En tant que [rôle/utilisateur],
Je veux [action/fonctionnalité],
Afin de [bénéfice/valeur].

Ex : En tant que client, je veux pouvoir sauvegarder des produits
en favoris afin de les retrouver facilement plus tard.

## Contexte / Objectif
Pourquoi cette fonctionnalité est nécessaire. Quel problème
elle résout. Données ou feedback utilisateur qui la justifient.

## Critères d'acceptation (format Given-When-Then)
- Given que je suis sur une page produit
  When je clique sur "Ajouter aux favoris"
  Then le produit apparaît dans ma liste de favoris

- Given que je suis sur ma liste de favoris
  When je clique sur "Supprimer"
  Then le produit est retiré de la liste

## Maquettes / Visuels
[Liens vers Figma, screenshots, wireframes]

## Scope / Hors scope
- IN : Ajout, suppression, consultation de la liste
- OUT : Partage de la liste, notifications de prix

## Estimation
Story points : 5
```

**Bonnes pratiques feature :**

- Formuler en termes de valeur utilisateur, pas de détails techniques
- Les détails d'implémentation technique vont dans des sous-tâches
- Inclure des maquettes quand c'est possible
- Définir clairement le scope ET le hors-scope
- Un ticket bien scopé = max 5 jours de travail

---

### Tâche technique / Refactoring

```
Titre : "Migrer le service d'authentification vers OAuth 2.0"

## Contexte
Pourquoi ce changement technique est nécessaire
(dette technique, conformité, performance...).

## Travail à effectuer
- [ ] Étape 1
- [ ] Étape 2
- [ ] Étape 3

## Risques / Points d'attention
- Impact sur les sessions existantes
- Migration des tokens en cours

## Critères d'acceptation
- [ ] Tous les tests passent
- [ ] Pas de régression sur le login
- [ ] Documentation mise à jour
```

---

## 3. Les Critères d'Acceptation — 3 Formats

| Format | Quand l'utiliser | Exemple |
|---|---|---|
| **Given-When-Then** | Scénarios comportementaux | Given je suis connecté, When je clique sur déconnexion, Then je suis redirigé vers la page de login |
| **Liste à puces** | Fonctionnalités simples aux limites claires | - Le bouton est visible / - Le clic déclenche l'action / - Un message de succès s'affiche |
| **"C'est terminé quand..."** | Approche pragmatique | C'est terminé quand l'utilisateur peut exporter en PDF depuis le tableau de bord |

---

## 4. Méthode INVEST pour valider un ticket

Un bon ticket respecte les critères **INVEST** :

- **I**ndépendant — Peut être développé seul, sans dépendance bloquante
- **N**égociable — Les détails peuvent être discutés avec l'équipe
- **V**aluable (Valeur) — Apporte une valeur claire à l'utilisateur ou au business
- **E**stimable — Assez détaillé pour être estimé par l'équipe
- **S**mall (Petit) — Réalisable en un sprint (idéalement < 5 jours)
- **T**estable — Les critères d'acceptation permettent de vérifier objectivement

---

## 5. Erreurs Fréquentes à Éviter

1. **Titre vague** — "Bug page produit" au lieu de "Corriger l'affichage du prix barré sur la page produit mobile"
2. **Pas de critères d'acceptation** — Le dev ne sait pas quand c'est "fini"
3. **Trop gros** — Un ticket qui prend 2 semaines doit être découpé
4. **Mélanger user story et technique** — Séparer la valeur utilisateur de l'implémentation
5. **Hypothèses non vérifiées** — Faire un spike de recherche avant si le besoin est flou
6. **Pas de contexte** — Le développeur ne comprend pas le "pourquoi"
7. **Infos dispersées** — Tout centraliser dans le ticket, pas dans Slack/emails
8. **Pas de priorité** — Le dev ne sait pas ce qui est urgent
9. **Écrire pour un seul public** — Le ticket doit être compréhensible par le dev ET le business

---

## 6. Checklist Avant de Soumettre un Ticket

- [ ] Le titre est clair et commence par un verbe
- [ ] Le contexte / problème est expliqué
- [ ] Les critères d'acceptation sont définis
- [ ] La priorité est assignée
- [ ] Les dépendances sont identifiées et liées
- [ ] Les visuels/maquettes sont joints (si applicable)
- [ ] Le scope est réaliste (< 5 jours)
- [ ] Le ticket est compréhensible sans contexte oral supplémentaire

---

## Sources

- [Thin Air Labs - Writing Good Tickets](https://www.thinairlabs.ca/post/writing-good-tickets)
- [Heady - Foundations of Agile Ticket Writing](https://www.heady.io/blog/foundations-of-agile-ticket-writing-a-4-part-series)
- [Atlassian Community - How to Write a Useful Jira Ticket](https://community.atlassian.com/forums/Jira-articles/How-to-write-a-useful-Jira-ticket/ba-p/2147004)
- [The Anatomy of a Good Ticket - Chromatic](https://chromatichq.com/insights/anatomy-good-ticket/)
- [Medium - How to Write Good Tickets in Software Development](https://medium.com/@niclast/how-to-write-good-tickets-in-software-development-600909701fb6)
- [GitStart - Writing Effective Tickets](https://gitstart.com/guides/1-better-tickets/)
- [Lullabot - Guidelines for Writing Proper Tickets](https://www.lullabot.com/articles/guidelines-for-writing-proper-tickets-and-commits)
- [Atlassian - What is a Feature Request](https://www.atlassian.com/agile/product-management/feature-request)
- [Vollcom Digital - How to Write an Agile Ticket](https://www.vollcom-digital.com/blog/agility-scrum/how-to-write-an-agile-ticket/)
- [Smartsheet - User Story Examples with Acceptance Criteria](https://www.smartsheet.com/content/user-story-with-acceptance-criteria-examples)
- [AltexSoft - Acceptance Criteria Best Practices](https://www.altexsoft.com/blog/acceptance-criteria-purposes-formats-and-best-practices/)
- [Vanitech - How to Raise a Bug Ticket in Jira](https://www.vanitech.com.au/guides/general/jira-how-to-raise-a-bug-ticket-to-make-sense/)
