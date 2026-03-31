<step order="1" name="intake">
  <objective>Comprendre le projet et collecter toutes les informations nécessaires.</objective>

  <process>
    **Chercher le CDC :**
    - Scanner `_orcl/client/specs/` pour un CDC existant
    - Si aucun CDC → demander à l'utilisateur de le fournir ou de le décrire

    **Collecter les informations clés :**
    - **Nom du projet** (kebab-case pour le repo)
    - **Description** (une phrase)
    - **Type d'app** : web, mobile (Flutter/React Native), desktop, API
    - **Stack technique** : framework, langage, base de données
    - **Plateforme cible** : iOS, Android, web, multi
    - **Audience** : type d'utilisateurs
    - **GitHub owner** : utilisateur ou organisation
    - **Visibilité** : public ou private

    **Récapituler et confirmer avec l'utilisateur avant de lancer le pipeline.**

    ⚠️ C'est la SEULE confirmation manuelle du workflow.
    Après cette validation, tout s'enchaîne automatiquement.
  </process>

  <output>
    "Projet [nom] — [stack]. Pipeline batch lancé. Je vais :
    1. Créer le repo GitHub + Project
    2. Valider le CDC
    3. Créer les tickets
    4. Définir l'UX
    5. Scaffolder et implémenter
    6. Auditer le code
    7. Pousser sur GitHub Projects

    C'est parti."
  </output>

  <next>Passer à step-02-github.md</next>
</step>
