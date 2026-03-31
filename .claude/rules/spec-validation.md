---
description: Règles de validation des spécifications et cahiers des charges
globs:
---

# Règles de validation des spécifications

## Principe STOP

Quand tu analyses un cahier des charges ou une demande, tu DOIS signaler un **STOP** si :
- Des mots vagues sont utilisés sans mesure ("ergonomique", "performant", "intuitif", "rapide")
- Des questions restent sans réponse
- Différentes interprétations sont possibles
- On ne peut pas écrire de critères d'acceptation
- Des sections sont marquées "à définir" ou "TBD"
- Les parties prenantes n'ont pas validé

## Critères de complétude (IEEE 830 / ISO 29148)

Une spec est prête pour découpage quand elle est :
- **Complète** : toutes les fonctionnalités et contraintes décrites
- **Correcte** : reflète des besoins réels et vérifiés
- **Non ambiguë** : une seule interprétation possible par exigence
- **Cohérente** : pas de contradictions
- **Vérifiable** : chaque exigence peut être testée
- **Traçable** : liée à un besoin source
- **Priorisée** : essentiel / souhaitable / optionnel

## Drapeaux rouges

Signaler immédiatement si :
- Aucun écran/page de destination n'est identifié pour une fonctionnalité
- L'emplacement d'affichage d'une donnée n'est pas précisé
- Les rôles utilisateurs ne sont pas définis
- Les cas limites ne sont pas mentionnés
- Les contraintes non-fonctionnelles ne sont pas quantifiées
