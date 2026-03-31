Crée les tests pour du code existant, étape par étape.

Lis `_orcl/workflows/create-tests/workflow.md` pour comprendre le workflow complet.

<execution>
Pour chaque étape du workflow :
1. Lis UNIQUEMENT le fichier step en cours (pas les suivants)
2. Exécute les instructions du step
3. Quand le step est terminé, lis le step suivant
4. Ne saute jamais une étape

Commence par lire `_orcl/workflows/create-tests/steps/step-01-analyser.md`.
</execution>

<constraints>
<do-not>Ne jamais charger tous les steps d'un coup.</do-not>
<do-not>Ne jamais mocker le SUT (System Under Test).</do-not>
<do-not>Ne jamais écrire des tests qui testent l'implémentation au lieu du comportement.</do-not>
</constraints>

Si besoin de référence approfondie → `brain/dev/ORCL_TESTING_QUALITY.md`.

Code à tester : $ARGUMENTS
