<step order="3" name="repo">
  <objective>Créer le repository GitHub.</objective>

  <process>
    - Vérifier que le repo n'existe pas déjà (`gh repo view owner/nom`)
    - Si le repo existe → STOP : "Le repo existe déjà. Veux-tu l'utiliser ou choisir un autre nom ?"
    - Créer le repo : `gh repo create owner/nom --description "..." --private/--public`
    - Initialiser avec un README si le repo est vide
    - Ajouter un `.gitignore` adapté si l'utilisateur précise la stack
  </process>

  <constraints>
    <do-not>Ne jamais écraser un repo existant.</do-not>
    <do-not>Ne jamais créer un repo public sans confirmation explicite.</do-not>
  </constraints>

  <output>
    Annoncer : "Repo créé : [lien]. Configuration en cours..."
  </output>

  <next>Passer à step-04-labels.md</next>
</step>
