<step order="5" name="invest">
  <objective>Vérifier INVEST sur chaque story et redécouper si nécessaire.</objective>

  <invest-criteria>
    - Independante : réalisable sans dépendance bloquante
    - Negociable : exprime un besoin, pas une solution technique
    - Valuable : apporte une valeur claire à l'utilisateur
    - Estimable : l'équipe peut estimer l'effort
    - Small : réalisable en 3-5 jours max
    - Testable : on peut écrire des critères d'acceptation clairs
  </invest-criteria>

  <process>
    - Pour chaque story, vérifier les 6 critères
    - Si un critère échoue → redécouper la story
    - Répéter jusqu'à ce que toutes les stories passent INVEST
  </process>

  <constraints>
    <do-not>Ne jamais laisser passer une story qui ne respecte pas INVEST.</do-not>
    <do-not>Ne jamais estimer une story à plus de 5 jours.</do-not>
  </constraints>

  <next>Passer à step-06-rediger.md</next>
</step>
