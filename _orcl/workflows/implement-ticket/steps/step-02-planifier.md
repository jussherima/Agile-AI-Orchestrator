<step order="2" name="planifier">
  <objective>Planifier l'implémentation avant d'écrire du code.</objective>

  <process>
    **Analyser le projet :**
    - Détecter la stack (package.json, pubspec.yaml, etc.)
    - Comprendre la structure existante (feature-first? layer-first?)
    - Identifier les patterns utilisés (Repository, Service, Controller, etc.)
    - Repérer le code existant lié au ticket

    **Plan d'implémentation :**
    - Lister les fichiers à créer/modifier
    - Identifier les composants/classes nécessaires
    - Définir les interfaces/contrats entre les couches
    - Anticiper les cas limites
    - Lister les tests à écrire

    **Principes à appliquer :**
    - Feature-first : nouveau code dans le dossier de la feature
    - SOLID : une classe = une responsabilité
    - Clean Architecture : dépendances vers l'intérieur
    - KISS : solution la plus simple qui satisfait les critères
  </process>

  <output>
    Présenter le plan et demander validation avant de coder.
  </output>

  <next>Passer à step-03-branch.md</next>
</step>
