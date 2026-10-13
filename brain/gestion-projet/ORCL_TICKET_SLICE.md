# ORCL_TICKET_SLICE — Guide de découpage d'un cahier des charges en tickets

## 1. La hiérarchie de découpage

```
Cahier des charges
  └── Thèmes (domaines fonctionnels)
       └── Epics (grandes fonctionnalités)
            └── User Stories (unités de valeur utilisateur)
                 └── Tasks/Sous-tâches (travail technique)
```

**Exemple concret :**

```
Thème : Gestion des utilisateurs
  Epic : Authentification
    Story : "En tant qu'utilisateur, je veux me connecter avec email/mot de passe"
      Task : Créer l'endpoint API /login
      Task : Créer le formulaire de connexion frontend
      Task : Implémenter la validation JWT
    Story : "En tant qu'utilisateur, je veux réinitialiser mon mot de passe"
    Story : "En tant qu'admin, je veux bloquer un compte après 5 tentatives"
```

---

## 2. Méthode pas à pas

### Étape 1 — Identifier les thèmes/domaines

Regrouper les exigences du cahier des charges par **domaine fonctionnel** (ex: authentification, paiement, notifications, reporting...).

### Étape 2 — Extraire les Epics

Chaque grande fonctionnalité devient un **Epic**. Un Epic est trop gros pour un sprint — il sera découpé ensuite.

### Étape 3 — Découper en User Stories

Chaque Epic est découpé en **User Stories** au format :

> **En tant que** [rôle], **je veux** [action] **afin de** [bénéfice]

### Étape 4 — Vérifier les critères INVEST

Chaque story doit être :

| Lettre | Critère | Signification |
|--------|---------|---------------|
| **I** | Independent | Réalisable sans dépendre d'une autre story |
| **N** | Negotiable | Décrit un besoin, pas une solution technique |
| **V** | Valuable | Apporte une valeur observable à l'utilisateur |
| **E** | Estimable | L'équipe peut estimer l'effort |
| **S** | Small | Réalisable en **3 jours max** (idéalement) |
| **T** | Testable | On peut écrire des critères d'acceptation clairs |

**Si une story ne respecte pas INVEST → la redécouper.**

### Étape 5 — Rédiger chaque ticket

Chaque ticket doit contenir :

```markdown
## Titre
[Action claire et concise]

## User Story
En tant que [rôle], je veux [action] afin de [bénéfice]

## Description
[Contexte, détails fonctionnels]

## Critères d'acceptation
- [ ] Critère 1 (testable, pass/fail)
- [ ] Critère 2
- [ ] Critère 3

## Notes techniques (optionnel)
[Contraintes, dépendances, endpoints concernés]

## Estimation
[Story points ou temps]
```

---

## 3. Les 9 techniques de découpage (Story Splitting)

| Technique | Quand l'utiliser | Exemple |
|-----------|-----------------|---------|
| **Par workflow** | Processus en étapes | Inscription → étape 1: email, étape 2: profil, étape 3: vérification |
| **Par règles métier** | Logique complexe | Calcul de prix: prix standard / prix promo / prix grossiste |
| **Par CRUD** | Gestion de données | Créer un produit / Lire / Modifier / Supprimer |
| **Par rôle/persona** | Multi-utilisateurs | Vue admin vs vue client vs vue livreur |
| **Par plateforme** | Multi-device | Web / Mobile / API |
| **Par cas nominal vs cas limites** | Gestion d'erreurs | Happy path d'abord, puis cas d'erreur |
| **Par données** | Variations de données | Import CSV simple → puis import Excel → puis import API |
| **Par opérations** | Interface complexe | Recherche simple → puis filtres avancés → puis tri |
| **Par qualité de service** | Non-fonctionnel | D'abord ça marche → puis ça tient la charge → puis c'est rapide |

---

## 4. Vertical Slicing vs Horizontal Slicing

**Toujours préférer le découpage vertical :**

```
HORIZONTAL (par couche technique) :
  Ticket 1 : Créer la table en BDD
  Ticket 2 : Créer l'API
  Ticket 3 : Créer le frontend
  → Aucun ticket ne délivre de valeur seul

VERTICAL (par tranche fonctionnelle) :
  Ticket 1 : L'utilisateur peut créer un compte (BDD + API + UI)
  Ticket 2 : L'utilisateur peut modifier son profil (BDD + API + UI)
  → Chaque ticket délivre une fonctionnalité complète et testable
```

Le vertical slicing traverse **toutes les couches** (UI, backend, BDD) pour livrer une fonctionnalité de bout en bout à chaque ticket.

---

## 5. Validation d'un cahier des charges avant découpage

### Les 8 propriétés qualité (IEEE 830 / ISO 29148)

Un cahier des charges est considéré **validé, clair et compris** lorsqu'il satisfait :

| Propriété | Le cahier des charges est validé quand... |
|---|---|
| **Complet** | Toutes les fonctionnalités, contraintes, interfaces et cas limites sont décrits. Aucune section "à définir" ne subsiste. |
| **Correct** | Chaque exigence reflète un besoin réel et vérifié auprès du client/utilisateur. |
| **Non ambigu** | Chaque exigence n'admet qu'une seule interprétation possible. Pas de "rapide", "convivial", "intuitif" sans critères mesurables. |
| **Cohérent** | Aucune exigence ne contredit une autre. |
| **Vérifiable/Testable** | Pour chaque exigence, on peut définir un test ou une méthode de vérification (test, inspection, analyse, démonstration). |
| **Traçable** | Chaque exigence est reliée à un besoin source (pourquoi) et pourra être reliée à un livrable (comment). |
| **Modifiable** | Le document est structuré pour permettre des évolutions sans incohérences. |
| **Classé par importance** | Les exigences sont priorisées (indispensable, souhaitable, optionnel). |

### Techniques de validation

- **Revue formelle** : un groupe (client + équipe technique) passe en revue chaque exigence systématiquement.
- **Walkthrough** : présentation au client qui réagit, pose des questions, valide sa compréhension.
- **Prototypage** : un prototype ou maquette est montré pour confirmer que le besoin est bien compris visuellement.
- **Génération de cas de test** : écrire les tests d'acceptation *avant* le développement. Si on n'arrive pas à écrire le test, l'exigence est floue.
- **Checklist de validation** : vérification systématique point par point.

### Checklist "Est-ce que c'est prêt ?" (Definition of Ready)

- [ ] Chaque exigence est **indépendante** (compréhensible seule)
- [ ] Chaque exigence est **négociable** (pas une solution technique imposée, mais un besoin)
- [ ] Chaque exigence apporte une **valeur** identifiable
- [ ] Chaque exigence est **estimable** (l'équipe peut évaluer l'effort)
- [ ] Chaque exigence est **suffisamment petite** pour être réalisable
- [ ] Chaque exigence est **testable** (critères d'acceptation définis)
- [ ] Les **dépendances externes** sont identifiées et résolues
- [ ] Le **vocabulaire** est défini (glossaire si nécessaire)
- [ ] Les **cas limites et erreurs** sont traités
- [ ] Les **contraintes non fonctionnelles** sont quantifiées (temps de réponse < 2s, disponibilité 99.9%, etc.)

### Signaux d'alerte : le cahier des charges n'est PAS encore validé si...

- Il contient des mots vagues : "ergonomique", "performant", "intuitif", "moderne" sans critères mesurables
- L'équipe technique pose des questions auxquelles personne ne sait répondre
- Deux lecteurs différents comprennent une exigence différemment
- On ne peut pas écrire de critères d'acceptation pour une exigence
- Il reste des sections marquées "TBD" ou "à préciser"
- Les parties prenantes n'ont pas toutes relu et approuvé

---

## 6. Erreurs courantes à éviter

- **Tickets trop gros** : si > 3-5 jours de travail → redécouper
- **Tickets trop techniques** : "Refactorer le service X" n'a pas de valeur utilisateur visible — le rattacher à une story
- **Oublier les critères d'acceptation** : un ticket sans AC = un ticket ambigu
- **Découpage horizontal** : séparer front/back/BDD empêche de livrer de la valeur incrémentale
- **Dépendances circulaires** : si A dépend de B qui dépend de A → reformuler
- **Ignorer les stories non fonctionnelles** : performance, sécurité, accessibilité doivent aussi être des tickets

---

## 7. Processus complet : du cahier des charges aux tickets

```
1. Valider le cahier des charges (section 5)
         ↓
2. Identifier les thèmes/domaines fonctionnels
         ↓
3. Extraire les Epics par thème
         ↓
4. Découper chaque Epic en User Stories (techniques section 3)
         ↓
5. Vérifier INVEST sur chaque story (section 2, étape 4)
         ↓
6. Rédiger les tickets avec critères d'acceptation (section 2, étape 5)
         ↓
7. Prioriser le backlog (MoSCoW, valeur/effort, etc.)
         ↓
8. Estimer (planning poker, t-shirt sizing)
         ↓
9. Planifier les sprints
```

---

## Sources

- [How to Turn Requirements into User Stories](https://daedtech.com/how-to-turn-requirements-into-user-stories/)
- [Epics, Stories, and Initiatives - Atlassian](https://www.atlassian.com/agile/project-management/epics-stories-themes)
- [How to Break Down Features into Epics, Stories & Tasks](https://www.dezkr.com/blog/break-features-into-user-stories/)
- [Splitting Epics and User Stories](https://premieragile.com/splitting-epics-and-user-stories/)
- [Guide to Splitting User Stories - Humanizing Work](https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/)
- [Vertical Slice vs Horizontal Slice](https://www.visual-paradigm.com/scrum/user-story-splitting-vertical-slice-vs-horizontal-slice/)
- [Acceptance Criteria - Atlassian](https://www.atlassian.com/work-management/project-management/acceptance-criteria)
- [Agile Ticket Writing Best Practices](https://www.heady.io/blog/foundations-of-agile-ticket-writing-a-4-part-series)
- [Adaptez votre cahier des charges à un contexte agile - OpenClassrooms](https://openclassrooms.com/fr/courses/6739646-realisez-un-cahier-des-charges-fonctionnel/6755931-adaptez-votre-cahier-des-charges-a-un-contexte-agile)
- [Decomposing Features into User Stories - PMI](https://www.pmi.org/disciplined-agile/team-lead/practice-decomposing-features-into-stories)
- [IEEE 830 Standard Overview](https://medium.com/@abdul.rehman_84899/ieee-standard-for-software-requirements-specifications-ieee-830-1998-0395f1da639a)
- [Requirements Validation Techniques - GeeksforGeeks](https://www.geeksforgeeks.org/software-engineering/software-engineering-requirements-validation-techniques/)
- [Requirements Checklist - AcqNotes](https://acqnotes.com/acqnote/tasks/requirements-checklist)
- [Definition of Ready - Atlassian](https://www.atlassian.com/agile/project-management/definition-of-ready)
