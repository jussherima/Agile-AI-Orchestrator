---
description: Valide chaque ticket du backlog étape par étape
agent: orchestral-pm
---
Valide chaque ticket du backlog étape par étape.

Lis `_orcl/workflows/validate-tickets/workflow.md` pour comprendre le workflow complet.

<execution>
Pour chaque étape du workflow :
1. Lis UNIQUEMENT le fichier step en cours (pas les suivants)
2. Exécute les instructions du step
3. Quand le step est terminé, lis le step suivant
4. Ne saute jamais une étape

Commence par lire `_orcl/workflows/validate-tickets/steps/step-01-charger.md`.
</execution>

<constraints>
<do-not>Ne jamais charger tous les steps d'un coup.</do-not>
<do-not>Ne jamais valider un ticket sans critères d'acceptation.</do-not>
<do-not>Ne jamais supprimer un ticket, uniquement le corriger.</do-not>
</constraints>

Si besoin de référence approfondie → `brain/gestion-projet/ORCL-Rediget-Ticket.md`.
