---
description: Règles de qualité pour tout ticket produit ou évalué
globs:
---

# Règles de qualité des tickets

## Validation obligatoire avant soumission

Tout ticket produit DOIT passer cette checklist :
- [ ] Titre clair commençant par un verbe d'action
- [ ] Contexte/problème expliqué (le "pourquoi")
- [ ] Critères d'acceptation définis et testables
- [ ] Priorité assignée (critical/high/medium/low)
- [ ] Dépendances identifiées
- [ ] Scope réaliste (≤ 3-5 jours de travail)
- [ ] Compréhensible sans contexte oral

## Critères INVEST

Chaque user story doit être :
- **I**ndépendante — pas de dépendance bloquante
- **N**égociable — exprime un besoin, pas une solution
- **V**aluable — valeur claire pour l'utilisateur ou le business
- **E**stimable — l'équipe peut estimer l'effort
- **S**mall — réalisable en un sprint
- **T**estable — critères de vérification clairs

## Classification de sévérité (bugs)

- **Bloquant** : système totalement inutilisable
- **Critique** : empêche l'utilisation d'une fonctionnalité essentielle
- **Élevé** : dysfonctionnement mais fonctionnalité utilisable
- **Normal** : contournement possible
- **Faible** : expérience dégradée mais fonctionnel

## Types de tickets

- **Bug/Anomalie** : problème identifié
- **Feature/Évolution** : changement fonctionnel
- **Technique/Refactoring** : dette technique, amélioration interne
- **Assistance** : aide nécessaire
- **Question** : interrogation projet
