<step order="2" name="themes">
  <objective>Regrouper les exigences du CDC par domaine fonctionnel.</objective>

  <process>
    - Lire toutes les exigences du CDC
    - Les regrouper par domaine fonctionnel (ex: authentification, paiement, notifications, profil, admin...)
    - Chaque groupe = un Thème
  </process>

  <output>
    Liste des thèmes identifiés avec les exigences rattachées.
  </output>

  <constraints>
    <do-not>Ne jamais créer de thème fourre-tout "Divers" ou "Autre".</do-not>
  </constraints>

  <next>Passer à step-03-epics.md</next>
</step>
