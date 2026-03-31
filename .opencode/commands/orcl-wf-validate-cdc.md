---
description: Valide un cahier des charges étape par étape
agent: orchestral-pm
---
Valide un cahier des charges étape par étape.

Lis `_orcl/workflows/validate-cdc/workflow.md` pour comprendre le workflow complet.

<execution>
Pour chaque étape du workflow :
1. Lis UNIQUEMENT le fichier step en cours (pas les suivants)
2. Exécute les instructions du step
3. Quand le step est terminé, lis le step suivant
4. Ne saute jamais une étape

Commence par lire `_orcl/workflows/validate-cdc/steps/step-01-localiser.md`.
</execution>

<constraints>
<do-not>Ne jamais charger tous les steps d'un coup.</do-not>
<do-not>Ne jamais sauter une étape.</do-not>
<do-not>Ne jamais valider un CDC ambigu.</do-not>
</constraints>

Utilise le template `_orcl/workflows/validate-cdc/templates/rapport-verification.md` pour le rapport.
Si besoin de référence approfondie → `brain/gestion-projet/CDC-standart.md`.

Fichier à vérifier : $ARGUMENTS
