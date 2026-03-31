<step order="2" name="verifier">
  <objective>Vérifier chaque ticket contre la checklist qualité.</objective>

  <checklist>
    Pour chaque ticket, vérifier (✅ ou ❌) :
    - Le titre commence par un verbe d'action et est clair
    - Le contexte/problème est expliqué (le "pourquoi")
    - Les critères d'acceptation sont définis et testables
    - Une priorité est assignée (critical/high/medium/low)
    - Les dépendances sont identifiées
    - Le scope est réaliste (max 3-5 jours)
    - Le ticket est compréhensible sans contexte oral
    - Le ticket passe les critères INVEST
  </checklist>

  <constraints>
    <do-not>Ne jamais valider un ticket sans critères d'acceptation.</do-not>
    <do-not>Ne jamais ignorer un critère de la checklist.</do-not>
  </constraints>

  <next>Passer à step-03-corriger.md</next>
</step>
