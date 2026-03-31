<step order="4" name="implementer">
  <objective>Écrire le code en respectant les standards.</objective>

  <process>
    **Clean Code :**
    - Noms révélateurs d'intention (anglais)
    - Fonctions courtes (max 20 lignes, idéal 3-5)
    - Max 2-3 paramètres par fonction
    - Un seul niveau d'abstraction par fonction
    - Pas d'effets de bord

    **SOLID :**
    - Single Responsibility : une classe = un rôle
    - Open/Closed : extensible sans modification
    - Dependency Inversion : injecter les dépendances

    **Sécurité (OWASP) :**
    - Valider TOUS les inputs (côté serveur)
    - Requêtes paramétrées (jamais de concaténation SQL)
    - Encoder les outputs (prévention XSS)
    - Pas de secrets en dur
    - Contrôle d'accès sur chaque endpoint

    **Structure :**
    - Suivre la structure existante du projet
    - Feature-first si applicable
    - Repository pattern pour l'accès données
    - Séparer logique métier / infrastructure
  </process>

  <constraints>
    <do-not>Ne jamais ignorer les cas limites (null, vide, overflow).</do-not>
    <do-not>Ne jamais créer de God Class.</do-not>
    <do-not>Ne jamais dupliquer du code — extraire si réutilisé.</do-not>
  </constraints>

  <next>Passer à step-05-tester.md</next>
</step>
