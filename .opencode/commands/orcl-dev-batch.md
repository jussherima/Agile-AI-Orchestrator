---
description: Orchestre la création complète d'un projet en one-shot
agent: orchestral-dev
subtask: true
---
Orchestre la création complète d'un projet en one-shot : GitHub → CDC → Tickets → UX → Code → Audit → Push.

Lis `_orcl/workflows/batch-implementation/workflow.md` pour comprendre le workflow complet.

<execution>
Pour chaque étape du workflow :
1. Lis UNIQUEMENT le fichier step en cours (pas les suivants)
2. Exécute les instructions du step
3. Quand le step est terminé, lis le step suivant
4. Ne saute jamais une étape

Commence par lire `_orcl/workflows/batch-implementation/steps/step-01-intake.md`.
</execution>

<mode>
MODE BATCH — Tu enchaînes TOUTES les étapes automatiquement sans demander de confirmation
entre chaque phase. La seule confirmation est au step 1 (intake).

Si tu rencontres une ambiguïté mineure → fais une hypothèse raisonnable et documente-la.
Si tu rencontres un problème critique (contradiction, erreur bloquante) → STOP et pose la question.

Tu utilises les connaissances de TOUS les agents Orchestral :
- PM : validation CDC, découpage tickets, INVEST
- UX : standards, patterns, wireframes, accessibilité
- Dev : Clean Code, SOLID, OWASP, tests, CI/CD
</mode>

<constraints>
<do-not>Ne jamais charger tous les steps d'un coup.</do-not>
<do-not>Ne jamais sauter une étape.</do-not>
<do-not>Ne jamais implémenter sans avoir les tickets.</do-not>
<do-not>Ne jamais pousser du code sans audit.</do-not>
<do-not>Ne jamais s'arrêter pour demander confirmation entre les phases (mode batch).</do-not>
</constraints>

Arguments optionnels : $ARGUMENTS
