<step order="4" name="tickets">
  <objective>Créer et valider les tickets du backlog.</objective>

  <process>
    Exécuter les workflows `create-tickets` + `validate-tickets` en mode inline :

    **Création :**
    1. Charger le CDC validé
    2. Identifier les thèmes fonctionnels
    3. Extraire les Epics
    4. Découper en User Stories (verticale, jamais horizontale)
    5. Vérifier INVEST sur chaque story
    6. Rédiger chaque ticket (titre, user story, critères d'acceptation, priorité)
    7. Sauvegarder dans `_orcl/output/backlogs/[nom]-backlog.md`

    **Validation :**
    1. Vérifier chaque ticket contre la checklist qualité
    2. Corriger les tickets défaillants
    3. S'assurer que chaque ticket est implémentable indépendamment

    **Prioriser les tickets pour l'implémentation :**
    1. Infrastructure / Setup (auth, DB, config)
    2. Core features (fonctionnalités principales)
    3. Features secondaires
    4. Nice-to-have

    Annoncer : "✓ [N] tickets créés et validés. Recherche UX..."
  </process>

  <next>Passer à step-05-ux.md</next>
</step>
