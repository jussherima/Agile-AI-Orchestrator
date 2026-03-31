<workflow>
  <metadata>
    <name>Création de tests</name>
    <command>/orcl/dev/create-tests</command>
    <input>Fichiers ou modules à tester</input>
    <output>Tests unitaires + intégration créés</output>
  </metadata>

  <steps>
    <step file="steps/step-01-analyser.md">Analyser le code à tester</step>
    <step file="steps/step-02-strategie.md">Définir la stratégie de test</step>
    <step file="steps/step-03-unitaires.md">Écrire les tests unitaires</step>
    <step file="steps/step-04-integration.md">Écrire les tests d'intégration</step>
    <step file="steps/step-05-executer.md">Exécuter et vérifier la couverture</step>
  </steps>
</workflow>
