# Orchestral — Règles globales du projet

## Règles de validation des spécifications

### Principe STOP

Quand tu analyses un cahier des charges ou une demande, tu DOIS signaler un **STOP** si :
- Des mots vagues sont utilisés sans mesure ("ergonomique", "performant", "intuitif", "rapide")
- Des questions restent sans réponse
- Différentes interprétations sont possibles
- On ne peut pas écrire de critères d'acceptation
- Des sections sont marquées "à définir" ou "TBD"
- Les parties prenantes n'ont pas validé

### Critères de complétude (IEEE 830 / ISO 29148)

Une spec est prête pour découpage quand elle est :
- **Complète** : toutes les fonctionnalités et contraintes décrites
- **Correcte** : reflète des besoins réels et vérifiés
- **Non ambiguë** : une seule interprétation possible par exigence
- **Cohérente** : pas de contradictions
- **Vérifiable** : chaque exigence peut être testée
- **Traçable** : liée à un besoin source
- **Priorisée** : essentiel / souhaitable / optionnel

### Drapeaux rouges

Signaler immédiatement si :
- Aucun écran/page de destination n'est identifié pour une fonctionnalité
- L'emplacement d'affichage d'une donnée n'est pas précisé
- Les rôles utilisateurs ne sont pas définis
- Les cas limites ne sont pas mentionnés
- Les contraintes non-fonctionnelles ne sont pas quantifiées

## Règles de qualité des tickets

### Validation obligatoire avant soumission

Tout ticket produit DOIT passer cette checklist :
- [ ] Titre clair commençant par un verbe d'action
- [ ] Contexte/problème expliqué (le "pourquoi")
- [ ] Critères d'acceptation définis et testables
- [ ] Priorité assignée (critical/high/medium/low)
- [ ] Dépendances identifiées
- [ ] Scope réaliste (≤ 3-5 jours de travail)
- [ ] Compréhensible sans contexte oral

### Critères INVEST

Chaque user story doit être :
- **I**ndépendante — pas de dépendance bloquante
- **N**égociable — exprime un besoin, pas une solution
- **V**aluable — valeur claire pour l'utilisateur ou le business
- **E**stimable — l'équipe peut estimer l'effort
- **S**mall — réalisable en un sprint
- **T**estable — critères de vérification clairs

### Classification de sévérité (bugs)

- **Bloquant** : système totalement inutilisable
- **Critique** : empêche l'utilisation d'une fonctionnalité essentielle
- **Élevé** : dysfonctionnement mais fonctionnalité utilisable
- **Normal** : contournement possible
- **Faible** : expérience dégradée mais fonctionnel

### Types de tickets

- **Bug/Anomalie** : problème identifié
- **Feature/Évolution** : changement fonctionnel
- **Technique/Refactoring** : dette technique, amélioration interne
- **Assistance** : aide nécessaire
- **Question** : interrogation projet
