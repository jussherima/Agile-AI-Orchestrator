# Guide complet : Comment rediger un bon Cahier des Charges

> Recherche approfondie compilee le 2026-03-14.
> Ce document sert de reference pour la skill `/verify-cdc` d'Orchestral.

---

## Table des matieres

1. [Definitions et types de CDC](#1-definitions-et-types-de-cdc)
2. [Normes et standards de reference](#2-normes-et-standards-de-reference)
3. [Structure type d'un CDC](#3-structure-type-dun-cdc)
4. [Template SRS selon ISO/IEC/IEEE 29148](#4-template-srs-selon-isoiecieee-29148)
5. [Criteres de qualite des exigences](#5-criteres-de-qualite-des-exigences)
6. [Bonnes pratiques de redaction](#6-bonnes-pratiques-de-redaction)
7. [17 erreurs courantes a eviter](#7-17-erreurs-courantes-a-eviter)
8. [CDC fonctionnel vs CDC technique](#8-cdc-fonctionnel-vs-cdc-technique)
9. [Methodes de validation d'un CDC](#9-methodes-de-validation-dun-cdc)
10. [Grille d'evaluation de completude](#10-grille-devaluation-de-completude)

---

## 1. Definitions et types de CDC

Le **cahier des charges** (CDC) est un document contractuel qui formalise les besoins d'un projet et les traduit en exigences fonctionnelles, techniques et organisationnelles. Il constitue le socle de communication entre le maitre d'ouvrage (MOA) et le maitre d'oeuvre (MOE).

### Types principaux

| Type | Sigle | Objectif | Destinataire |
|------|-------|----------|--------------|
| Cahier des charges fonctionnel | CDCF | Decrire le **quoi** : besoins, fonctions attendues, valeur | Metier, client, utilisateurs |
| Cahier des charges technique | CDCT | Decrire le **comment** : technologies, contraintes, normes | Equipes techniques, developpeurs |
| Software Requirements Specification | SRS | Document complet combinant les deux (norme IEEE/ISO) | Toutes les parties prenantes |

---

## 2. Normes et standards de reference

### IEEE 830-1998 (obsolete, remplace par ISO 29148)

Norme historique definissant les pratiques recommandees pour la redaction d'une SRS. Elle etablit **8 criteres de qualite** qu'une specification doit respecter :

1. **Correcte** : reflète des besoins reels et verifies
2. **Non ambigue** : une seule interpretation possible par exigence
3. **Complete** : toutes les fonctionnalites et contraintes sont decrites
4. **Coherente** : pas de contradictions entre exigences
5. **Priorisee** : classee par importance et stabilite
6. **Verifiable** : chaque exigence peut etre testee
7. **Modifiable** : structure facilitant les evolutions
8. **Tracable** : chaque exigence est liee a un besoin source

### ISO/IEC/IEEE 29148:2018

Remplace IEEE 830 depuis 2011 (2e edition en 2018). Portee plus large :
- Couvre le processus complet de gestion des exigences
- Definit 3 niveaux de specification : StRS (Stakeholder), SyRS (System), SRS (Software)
- Inclut les criteres de qualite, le processus de management, et les templates

### NF EN 16271

Norme francaise applicable au CDCF, definissant la methode d'analyse fonctionnelle du besoin.

### Autres references utiles

- **ISO 9126 / ISO 25010** : modele de qualite logicielle (fonctionnalite, fiabilite, utilisabilite, efficacite, maintenabilite, portabilite)
- **CMMI** : niveaux de maturite incluant la gestion des exigences
- **IREB (CPRE)** : certification en ingenierie des exigences

---

## 3. Structure type d'un CDC (generaliste)

### Partie 1 : Contexte et presentation d'ensemble

- Presentation de l'entreprise / du projet
- Objectifs du projet (formules en SMART)
- Enjeux business et strategiques
- Cible utilisateur et personas
- Perimetre fonctionnel et limites du projet
- Concurrence et existant

### Partie 2 : Description fonctionnelle

- Liste des fonctionnalites attendues (priorisees)
- Parcours utilisateurs et cas d'usage
- Regles de gestion metier
- Roles et droits utilisateurs
- Donnees manipulees

### Partie 3 : Exigences non-fonctionnelles

- Performance (temps de reponse, charge)
- Securite et confidentialite
- Accessibilite (RGAA, WCAG)
- Compatibilite (navigateurs, appareils)
- Disponibilite et fiabilite (SLA)
- Maintenabilite
- Conformite reglementaire (RGPD, etc.)

### Partie 4 : Exigences techniques et contraintes

- Architecture technique souhaitee ou imposee
- Technologies et frameworks imposes
- Contraintes d'hebergement
- Interfaces avec systemes existants
- Contraintes de migration de donnees

### Partie 5 : Design et ergonomie

- Charte graphique et identite visuelle
- Maquettes / wireframes
- Principes UX

### Partie 6 : Organisation du projet

- Planning et jalons
- Budget et enveloppe financiere
- Equipe et roles (matrice RACI)
- Processus de validation et recette
- Criteres d'acceptation des livrables
- Garantie et maintenance post-livraison

### Partie 7 : Annexes

- Glossaire des termes
- Documents de reference
- Schemas et diagrammes
- Liste des questions ouvertes (TBD)

---

## 4. Template SRS selon ISO/IEC/IEEE 29148

### 4.1 Structure complete

```
1. Introduction
   1.1 Purpose
   1.2 Scope
   1.3 Intended Audience and Document Use
   1.4 References
   1.5 Definitions, Acronyms, and Abbreviations
   1.6 Document Overview

2. Overall Description
   2.1 System or Product Perspective
   2.2 System or Product Functions
   2.3 User Characteristics
   2.4 Constraints, Assumptions, and Dependencies
   2.5 Operational Environment

3. Functional Requirements
   3.x [Groupe fonctionnel ou feature] (repetable)

4. Non-Functional Requirements
   4.1 Performance Requirements
   4.2 Safety and Security Requirements
   4.3 Reliability and Availability
   4.4 Usability and Human Factors
   4.5 Maintainability and Support
   4.6 Portability and Compatibility
   4.7 Other Quality Attributes

5. External Interface Requirements
   5.1 User Interfaces
   5.2 Hardware Interfaces
   5.3 Software Interfaces
   5.4 Communications Interfaces

6. Other Requirements (optionnel)
   6.1 Legal or Regulatory Requirements
   6.2 Packaging, Installation, and Deployment
   6.3 Internationalization and Localization
   6.4 Data Requirements

7. Verification and Validation
   7.1 Requirements Verification Methods
   7.2 Acceptance Criteria

8. Appendices
9. Index (optionnel)
```

### 4.2 Les 3 niveaux ISO 29148

| Document | Niveau | Contenu |
|----------|--------|---------|
| **StRS** (Stakeholder Requirements Specification) | Strategique | Besoins des parties prenantes, objectifs business |
| **SyRS** (System Requirements Specification) | Systeme | Exigences systeme globales, interfaces |
| **SRS** (Software Requirements Specification) | Logiciel | Exigences logicielles detaillees |

---

## 5. Criteres de qualite des exigences

### 5.1 Les 8 criteres IEEE 830

Chaque exigence individuelle doit etre :

| Critere | Question de verification |
|---------|------------------------|
| **Correcte** | Reflète-t-elle un vrai besoin valide ? |
| **Non ambigue** | N'a-t-elle qu'une seule interpretation possible ? |
| **Complete** | Toutes les informations necessaires sont-elles presentes ? |
| **Coherente** | Est-elle compatible avec les autres exigences ? |
| **Priorisee** | Son importance relative est-elle definie ? |
| **Verifiable** | Peut-on ecrire un test pour la valider ? |
| **Modifiable** | Peut-on la modifier sans impact en cascade ? |
| **Tracable** | Est-elle liee a un besoin source et a des tests ? |

### 5.2 Criteres INVEST (pour les user stories)

- **I**ndependante : pas de dependance bloquante avec d'autres stories
- **N**egociable : exprime un besoin, pas une solution technique
- **V**aluable : apporte une valeur claire a l'utilisateur ou au business
- **E**stimable : l'equipe peut estimer l'effort necessaire
- **S**mall : realisable en un sprint (3-5 jours max)
- **T**estable : criteres de verification clairs et mesurables

### 5.3 Criteres SMART (pour les objectifs)

- **S**pecifique : clair et precis
- **M**esurable : quantifiable
- **A**mbitieux / Atteignable : realiste mais stimulant
- **R**ealiste : faisable avec les ressources disponibles
- **T**emporel : avec une echeance definie

### 5.4 Methodes de formulation des exigences

| Methode | Format | Exemple |
|---------|--------|---------|
| **EARS** | Quand [evenement], le systeme doit [reponse] | Quand l'utilisateur saisit un email invalide, le systeme doit afficher un message d'erreur en moins de 200ms |
| **BDD/Gherkin** | Given/When/Then | Given un utilisateur connecte, When il clique sur "Deconnexion", Then la session est detruite |
| **User Story** | En tant que [role], je veux [action] afin de [benefice] | En tant qu'admin, je veux exporter les donnees en CSV afin de les analyser dans Excel |

---

## 6. Bonnes pratiques de redaction

### Clarte et precision

- Utiliser des phrases courtes : sujet + verbe + complement
- Preferer les verbes a l'infinitif pour les exigences
- Bannir les termes vagues : "ergonomique", "performant", "intuitif", "rapide", "simple"
- Toujours quantifier : "temps de reponse < 2 secondes" au lieu de "rapide"
- Inclure un glossaire definissant chaque terme technique

### Structure et organisation

- Numerotation hierarchique de chaque exigence (REQ-001, REQ-002...)
- Tableaux de synthese pour les comparaisons
- Diagrammes, schemas, maquettes pour illustrer
- Table des matieres et index pour la navigation
- Controle de version du document

### Processus collaboratif

- Impliquer toutes les parties prenantes des la redaction
- Organiser des ateliers de recueil des besoins
- Faire relire par des profils differents (technique, metier, utilisateur)
- Iterer : un bon CDC est rarement parfait du premier coup
- Prevoir un processus de gestion des changements

### Exigences non-fonctionnelles

- Toujours les quantifier avec des metriques precises
- Couvrir systematiquement : performance, securite, fiabilite, utilisabilite, maintenabilite, portabilite
- Utiliser les categories ISO 25010 comme checklist
- Ne pas les considerer comme secondaires : elles determinent l'architecture

### Tracabilite

- Chaque exigence doit etre liee a un besoin source (pourquoi)
- Chaque exigence doit etre liee a un test (comment verifier)
- Utiliser une matrice de tracabilite (exigence -> besoin -> test -> livrable)

---

## 7. 17 erreurs courantes a eviter

| # | Erreur | Consequence |
|---|--------|-------------|
| 1 | **Decrire des solutions au lieu de besoins** | Limite l'innovation, fige le "comment" au lieu du "quoi" |
| 2 | **Exclure des parties prenantes** | Besoins incomplets, resistance au changement |
| 3 | **Objectifs flous** | Impossible de mesurer le succes du projet |
| 4 | **Confondre specs fonctionnelles et techniques** | Document incoherent, mauvaise audience |
| 5 | **Omettre les contraintes** | Surprises budgetaires, temporelles, legales |
| 6 | **Specifications vagues** | Interpretations divergentes, litiges |
| 7 | **Pas de procedure de validation** | Impossible de valider les livrables |
| 8 | **Langage obscur / jargon** | Incomprehension, erreurs d'implementation |
| 9 | **Mauvais niveau de detail** | Trop vague = ambiguite ; trop detaille = rigidite |
| 10 | **Pas de plan de maintenance** | Produit non perenne apres livraison |
| 11 | **Exigences irrealistes** | Echec programme, budget explose |
| 12 | **Pas de criteres d'acceptation** | Pas de base pour la recette |
| 13 | **Document trop rigide** | Incapacite a s'adapter aux evolutions |
| 14 | **Temps insuffisant alloue a la redaction** | Specs bâclees = projet en echec |
| 15 | **Roles non definis** | Confusion des responsabilites |
| 16 | **Mauvaise structure / organisation** | Document illisible, informations introuvables |
| 17 | **Elements critiques manquants** | Trous dans les specs decouverts trop tard |

---

## 8. CDC fonctionnel vs CDC technique

### Tableau comparatif detaille

| Aspect | CDCF (Fonctionnel) | CDCT (Technique) |
|--------|---------------------|-------------------|
| **Question** | Quoi ? Pourquoi ? | Comment ? Avec quoi ? |
| **Objectif** | Decrire les besoins et fonctions attendues | Definir les moyens et contraintes techniques |
| **Contenu** | Fonctionnalites, parcours utilisateur, regles metier | Technologies, architecture, normes, composants |
| **Destinataire** | Client, utilisateurs, metier | Developpeurs, architectes, ingenieurs |
| **Norme** | NF EN 16271 | Pas de norme specifique |
| **Flexibilite** | Laisse de la liberte au MOE pour innover | Cadre plus strict, encadre le travail |
| **Priorise** | La valeur utilisateur | La faisabilite technique |

### Contenu du CDCF

- Presentation du contexte et des objectifs
- Description des fonctions principales et secondaires
- Parcours utilisateurs et scenarios d'usage
- Criteres d'acceptation par fonction
- Contraintes fonctionnelles (reglementaire, metier)
- Priorisation des fonctionnalites (MoSCoW, valeur/effort)

### Contenu du CDCT

- Architecture technique cible
- Technologies et frameworks imposes
- Contraintes d'hebergement et d'infrastructure
- Exigences de performance chiffrees
- Normes techniques a respecter
- Interfaces avec les systemes existants (API, BDD)
- Plan de securite technique

### Recommandation

Dans la pratique, combiner les deux dans un document unique structure en sections distinctes, ou bien produire un CDCF d'abord (phase besoin) puis un CDCT (phase conception). Le CDCF doit toujours preceder le CDCT.

---

## 9. Methodes de validation d'un CDC

### 9.1 Revue formelle

1. **Preparation** : envoyer le document aux relecteurs en amont (min. 3-5 jours)
2. **Revue individuelle** : chaque relecteur annote ses remarques
3. **Reunion de revue** : animee par un facilitateur neutre, parcours structure du document
4. **Consolidation** : integration des retours, nouvelle version
5. **Validation finale** : signature formelle des parties prenantes

### 9.2 Checklist de verification (inspiree IEEE 830)

Pour chaque exigence, verifier :
- [ ] Est-elle correcte ? (besoin reel et valide)
- [ ] Est-elle non ambigue ? (une seule interpretation)
- [ ] Est-elle complete ? (toutes les infos necessaires)
- [ ] Est-elle coherente ? (pas de contradiction)
- [ ] Est-elle priorisee ? (importance definie)
- [ ] Est-elle verifiable ? (test possible)
- [ ] Est-elle modifiable ? (structure permettant l'evolution)
- [ ] Est-elle tracable ? (liee a un besoin et a un test)

### 9.3 Techniques complementaires

| Technique | Description |
|-----------|-------------|
| **Inspection** | Relecture systematique ligne par ligne par des pairs |
| **Walkthrough** | L'auteur presente le document section par section |
| **Prototypage** | Valider les exigences UI/UX par des maquettes interactives |
| **Matrice de tracabilite** | Verifier que chaque besoin est couvert par une exigence et un test |
| **FMEA** | Analyse des modes de defaillance : Severite x Occurrence x Detection |
| **Revue croisee** | Un autre chef de projet ou analyste relit avec un regard neuf |

### 9.4 Signaux d'alerte (drapeaux rouges)

Un CDC n'est PAS pret si :
- Des sections sont marquees "a definir" ou "TBD"
- Des termes vagues non quantifies sont utilises ("performant", "ergonomique")
- Les roles utilisateurs ne sont pas definis
- Les cas limites ne sont pas mentionnes
- Les exigences non-fonctionnelles ne sont pas chiffrees
- Aucun critere d'acceptation n'est defini
- Des contradictions existent entre sections
- Le budget ou le planning n'est pas mentionne

---

## 10. Grille d'evaluation de completude

### Score de maturite du CDC

| Critere | Poids | 0 (Absent) | 1 (Partiel) | 2 (Complet) |
|---------|-------|-------------|--------------|--------------|
| Contexte et objectifs | 10% | - | - | - |
| Perimetre et limites | 10% | - | - | - |
| Exigences fonctionnelles | 20% | - | - | - |
| Exigences non-fonctionnelles | 15% | - | - | - |
| Criteres d'acceptation | 15% | - | - | - |
| Contraintes et risques | 10% | - | - | - |
| Planning et budget | 10% | - | - | - |
| Roles et responsabilites | 5% | - | - | - |
| Glossaire et annexes | 5% | - | - | - |

### Interpretation du score

- **90-100%** : CDC pret pour le decoupage en tickets
- **70-89%** : CDC exploitable avec reserves mineures
- **50-69%** : CDC necessitant des complements significatifs
- **< 50%** : CDC insuffisant, retour au client necessaire (STOP)

---

## Sources

- [Comment rediger un cahier des charges - ibat-solution](https://www.ibat-solution.com/blog/comment-rediger-un-cahier-des-charges/)
- [Guide 2026 - apprendre-les-achats.fr](https://apprendre-les-achats.fr/rediger-un-cahier-des-charges/)
- [Structure type d'un CDC - La Fabrique du Net](https://www.lafabriquedunet.fr/structure-type-dun-cahier-des-charges-exemple/)
- [CDC fonctionnel - HubSpot](https://blog.hubspot.fr/marketing/cahier-des-charges-fonctionnels)
- [17 erreurs a eviter - Reussir Ses Projets](https://www.reussirsesprojets.com/erreurs-cahier-des-charges/)
- [CDC fonctionnel vs technique - Reussir Ses Projets](https://www.reussirsesprojets.com/differences-cdc-technique-fonctionnel/)
- [IEEE 830-1998 - IEEE Xplore](https://ieeexplore.ieee.org/document/720574)
- [ISO/IEC/IEEE 29148 Templates - ReqView](https://www.reqview.com/doc/iso-iec-ieee-29148-templates/)
- [ISO/IEC/IEEE 29148 SRS Template - Well Architected Guide](https://www.well-architected-guide.com/documents/iso-iec-ieee-29148-template/)
- [How to Write an SRS - Perforce](https://www.perforce.com/blog/alm/how-write-software-requirements-specification-srs-document)
- [SRS Practical Guide 2025 - Shadecoder](https://www.shadecoder.com/topics/a-software-requirements-specification-srs-a-practical-guide-for-2025)
- [SRS Template IEEE 830 + ISO 29148 - GitHub](https://github.com/jam01/SRS-Template)
- [How to Write Software Requirements - SoftKraft](https://www.softkraft.co/how-to-write-software-requirements/)
- [SRS Document - Aqua Cloud](https://aqua-cloud.io/how-write-effective-software-requirements-specification/)
- [Qualite des exigences - ScopeMaster](https://www.scopemaster.com/blog/requirements-quality-attributes/)
- [CDC methodologie - College de Paris](https://formation-continue.collegedeparis.fr/actualites/cahier-des-charges-fonctionnel-methode-et-bonnes-pratiques)
- [Erreurs CDC - cahier-des-charges.net](https://www.cahier-des-charges.net/erreurs-redaction-cahier-des-charges/)
- [Wikipedia - Software Requirements Specification](https://en.wikipedia.org/wiki/Software_requirements_specification)
- [Wikipedia - Cahier des charges fonctionnel](https://fr.wikipedia.org/wiki/Cahier_des_charges_fonctionnel)
