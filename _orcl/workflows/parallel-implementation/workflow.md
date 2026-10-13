<workflow>
  <metadata>
    <name>Implémentation Parallèle — Subagents Orchestrés</name>
    <command>/orcl/dev/parallel-implementation</command>
    <input>Backlog validé + architecture définie</input>
    <output>Tous tickets implémentés, revus, testés, commités</output>
    <description>
      Orchestrateur principal qui lance des subagents en parallèle pour implémenter et reviewer.
      Gestion des dépendances, token-efficient, itératif jusqu'à validation complète.
    </description>
    <prerequisite>Backlog dans _orcl/output/backlogs/, architecture dans _orcl/output/architecture/
  </metadata>

  <steps>
    <step file="steps/step-01-analyze-deps.md">Analyser dépendances et construire graphe d'exécution</step>
    <step file="steps/step-02-plan-waves.md">Planifier les vagues d'exécution parallèle</step>
    <step file="steps/step-03-spawn-implement.md">Lancer subagents implémentation (vague 1)</step>
    <step file="steps/step-04-spawn-review.md">Lancer subagents review (vague 1)</step>
    <step file="steps/step-05-iterate-waves.md">Itérer vagues suivantes jusqu'à completion</step>
    <step file="steps/step-06-verify-all.md">Vérification finale par agent principal</step>
    <step file="steps/step-07-report.md">Rapport de synthèse</step>
  </steps>

  <mode>
    Mode SUBAGENT PARALLÈLE — L'agent principal ne fait QUE l'orchestration.
    Les subagents font le travail réel (implémentation, review).
    Parallélisme maximal respectant les dépendances.
    Boucle implémentation → review jusqu'à validation.
  </mode>
</workflow>