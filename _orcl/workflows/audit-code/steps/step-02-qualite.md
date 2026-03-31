<step order="2" name="qualite">
  <objective>Évaluer la qualité du code.</objective>

  <process>
    **Clean Code :**
    - Fonctions > 20 lignes ? Lister les violations
    - Fichiers > 200 lignes ? Lister
    - Noms obscurs ou abréviations cryptiques ?
    - Code dupliqué (patterns répétés) ?
    - Dead code (fonctions/variables non utilisées) ?

    **SOLID :**
    - God Classes (classes avec trop de responsabilités) ?
    - Dépendances concrètes au lieu d'abstractions ?
    - Violations de Single Responsibility ?

    **Architecture :**
    - La structure est-elle cohérente ? (feature-first ou layer-first, pas les deux)
    - Les couches sont-elles respectées ?
    - Y a-t-il du couplage fort entre modules ?

    **Tests :**
    - Couverture de tests existante
    - Qualité des tests (AAA, indépendants, descriptifs)
    - Modules critiques sans tests

    **Métriques à estimer :**
    - Complexité cyclomatique (fonctions > 10)
    - Duplication estimée
    - Couverture de tests

    Pour chaque problème : fichier, description, sévérité (1-4).
  </process>

  <next>Passer à step-03-securite.md</next>
</step>
