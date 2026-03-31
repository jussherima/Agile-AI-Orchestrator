<step order="2" name="github">
  <objective>Créer le repository GitHub et le Project board.</objective>

  <process>
    Exécuter le workflow `/orcl/github/init-project` en mode inline (pas en sous-commande) :

    1. **Prérequis** : vérifier `gh auth status` et les scopes
    2. **Repo** : `gh repo create [owner]/[nom] --private --description "..."`
       - Si le repo existe déjà → l'utiliser sans recréer
    3. **Labels** : créer les labels Orchestral (types, priorités, tailles)
       - Supprimer les labels par défaut
    4. **Project** : `gh project create --owner [owner] --title "[nom]"`
       - Colonnes : Backlog → Ready → In Progress → Code Review → QA/Testing → Done
       - Champs : Priority, Type, Story Points, Sprint

    Annoncer : "✓ Repo + Project créés. Validation du CDC..."
  </process>

  <on-error>
    Si `gh auth` échoue → STOP : "Lance `gh auth login` puis relance."
    Si le repo existe → l'utiliser et continuer.
  </on-error>

  <next>Passer à step-03-cdc.md</next>
</step>
