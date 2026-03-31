<step order="9" name="implement">
  <objective>Implémenter TOUS les tickets du backlog, un par un, dans l'ordre de priorité.</objective>

  <process>
    **Charger le backlog** depuis `_orcl/output/backlogs/[nom]-backlog.md`.
    Trier par ordre d'implémentation (dépendances d'abord, puis priorité).

    **Pour CHAQUE ticket, exécuter le cycle complet :**

    1. **Comprendre** : lire le ticket, ses critères d'acceptation
    2. **Implémenter** en respectant :
       - Clean Code (fonctions courtes, noms clairs)
       - SOLID (single responsibility, dependency inversion)
       - Sécurité (input validation, pas de secrets en dur)
       - Architecture feature-first
    3. **Tester** :
       - Tests unitaires (AAA, couverture ≥ 80%)
       - Tests d'intégration si nécessaire
    4. **Auto-review** : checklist qualité + sécurité
    5. **Commit atomique** :
       ```
       feat([feature]): [description]
       ```

    **Règles batch :**
    - Un commit par ticket (ou par sous-tâche logique si le ticket est gros)
    - Vérifier que le build passe après chaque ticket
    - Vérifier que les tests existants passent toujours
    - Si un ticket est bloqué (dépendance manquante) → le mettre en fin de file et continuer

    **Progression :**
    Après chaque ticket, annoncer :
    "✓ Ticket [X/N] : [titre] — implémenté et testé."

    **À la fin de tous les tickets :**
    - Exécuter tous les tests une dernière fois
    - Vérifier le build complet
    - Vérifier que le linter passe sur tout le projet
  </process>

  <constraints>
    <do-not>Ne jamais sauter un ticket sans justification.</do-not>
    <do-not>Ne jamais commiter du code sans tests.</do-not>
    <do-not>Ne jamais casser les tests existants.</do-not>
  </constraints>

  <next>Passer à step-10-audit.md</next>
</step>
