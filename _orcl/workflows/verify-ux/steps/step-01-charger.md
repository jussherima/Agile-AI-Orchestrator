<step order="1" name="charger">
  <objective>Charger tous les livrables UX à auditer.</objective>

  <process>
    - Scanner `_orcl/output/ux/` pour trouver les livrables existants
    - Charger : personas, user flows, sitemap, wireframes, interaction specs
    - Charger aussi les standards identifiés (`standards-*.md`) si disponibles
    - Si aucun livrable → STOP : "Aucun livrable UX trouvé. Lance d'abord `/orcl/ux/create-ux`."
  </process>

  <output>
    "Livrables chargés : [liste]. Audit en cours..."
  </output>

  <next>Passer à step-02-heuristique.md</next>
</step>
