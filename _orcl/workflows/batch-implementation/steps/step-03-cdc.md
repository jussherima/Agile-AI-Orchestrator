<step order="3" name="cdc">
  <objective>Valider le cahier des charges.</objective>

  <process>
    Exécuter le workflow `validate-cdc` en mode inline :

    1. **Localiser** : charger le CDC depuis `_orcl/client/specs/`
    2. **Analyser** : évaluer contre la checklist IEEE 830 / ISO 29148
       - Complétude, correctitude, non-ambiguïté, cohérence
       - Vérifiabilité, traçabilité, priorisation
    3. **Verdict** :
       - Si VALIDE (score ≥ 7/10) → créer `_orcl/output/CDC-validated.md` et continuer
       - Si INVALIDE mais récupérable → lister les questions, faire des hypothèses raisonnables basées sur le contexte, documenter les hypothèses dans le CDC validé, et continuer
       - Si INVALIDE critique (contradictions, fonctionnalités incompréhensibles) → STOP

    **Mode batch** : en cas d'ambiguïtés mineures, l'agent fait des hypothèses raisonnables
    et les documente clairement dans le CDC validé (section "Hypothèses prises").

    Annoncer : "✓ CDC validé ([score]/10). Création des tickets..."
  </process>

  <next>Passer à step-04-tickets.md</next>
</step>
