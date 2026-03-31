<step order="3" name="verdict">
  <objective>Produire le score, le verdict final, et les questions à poser au client.</objective>

  <scoring>
    Compter les points ✅ sur le total de la checklist.

    - 90-100% → ✅ CDC PRÊT pour le découpage
    - 70-89%  → ⚠️ CDC EXPLOITABLE avec réserves mineures
    - 50-69%  → ❌ CDC INCOMPLET, compléments nécessaires
    - moins de 50%   → 🛑 STOP — CDC insuffisant, retour client
  </scoring>

  <if-invalid>
    Si le CDC n'est pas valide :
    - Lister TOUTES les questions à poser au client
    - Formuler chaque question de manière précise et actionnable
    - Grouper les questions par thème
    - Expliquer pourquoi chaque question est nécessaire
  </if-invalid>

  <constraints>
    <do-not>Ne jamais valider un CDC qui a des points ❌ critiques sans poser les questions.</do-not>
    <do-not>Ne jamais formuler des questions vagues. Chaque question doit être répondable.</do-not>
  </constraints>

  <next>Passer à step-04-output.md</next>
</step>
