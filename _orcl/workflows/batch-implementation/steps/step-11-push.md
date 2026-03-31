<step order="11" name="push">
  <objective>Pousser le code et les tickets sur GitHub.</objective>

  <process>
    **1. Push le code :**
    - Connecter le repo local au remote : `git remote add origin [url]` (si pas fait)
    - Push : `git push -u origin main`

    **2. Créer les issues GitHub (workflow push-kanban inline) :**
    Pour chaque ticket du backlog :
    - Créer l'issue avec titre, body (user story + critères), labels
    - Ajouter au GitHub Project
    - Marquer comme "Done" les tickets déjà implémentés
    - Laisser en "Backlog" les tickets non implémentés (s'il y en a)

    **3. Distribuer sur le board :**
    - Tickets implémentés → "Done"
    - Tickets restants → "Backlog" (prioritaires en "Ready")

    Annoncer : "✓ Code pushé + [N] issues créées sur GitHub Projects."
  </process>

  <next>Passer à step-12-output.md</next>
</step>
