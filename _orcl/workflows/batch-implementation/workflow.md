<workflow>
  <metadata>
    <name>Batch Implementation — Projet en one-shot (LEGACY)</name>
    <command>/orcl/dev/batch-implementation</command>
    <input>CDC ou description du projet</input>
    <output>Projet complet : repo GitHub + tickets + UX + code implémenté</output>
    <description>
      ⚠️ VERSION LEGACY — Séquentielle, non token-efficient.
      Utilisez plutôt : `/orcl/dev/parallel` (subagents parallèles, orchestrés).
      
      Ancien pipeline : GitHub init → CDC validation → Tickets → UX → Implémentation séquentielle.
    </description>
  </metadata>

  <steps>
    <step file="steps/step-01-intake.md">Intake — Comprendre le projet</step>
    <step file="steps/step-02-github.md">Créer le repo GitHub + Project</step>
    <step file="steps/step-03-cdc.md">Valider le CDC</step>
    <step file="steps/step-04-tickets.md">Créer et valider les tickets</step>
    <step file="steps/step-05-ux.md">Recherche standards + patterns UI + livrables UX</step>
    <step file="steps/step-06-stack.md">Rechercher la stack technique + best practices</step>
    <step file="steps/step-07-architecture.md">Définir l'architecture technique</step>
    <step file="steps/step-08-scaffold.md">Scaffolder le projet</step>
    <step file="steps/step-09-implement.md">Implémenter tous les tickets (SÉQUENTIEL - LENT)</step>
    <step file="steps/step-10-audit.md">Audit final qualité/sécurité/performance</step>
    <step file="steps/step-11-push.md">Push tickets sur GitHub Projects</step>
    <step file="steps/step-12-output.md">Rapport final</step>
  </steps>

  <mode>
    MODE LEGACY SÉQUENTIEL — Ne pas utiliser pour nouveaux projets.
    Utilisez `/orcl/dev/parallel` pour implémentation parallèle subagents.
  </mode>

  <see_also>
    /orcl/dev/parallel — Implémentation parallèle subagents (RECOMMANDÉ)
    /orcl/subagent/implement-ticket — Subagent implémentation
    /orcl/subagent/review-ticket — Subagent review
  </see_also>
</workflow>
