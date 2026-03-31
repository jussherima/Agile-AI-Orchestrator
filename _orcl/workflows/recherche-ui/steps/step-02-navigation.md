<step order="2" name="navigation">
  <objective>Définir les patterns de navigation adaptés.</objective>

  <process>
    Selon la plateforme et le nombre de sections :

    **Mobile (3-5 sections principales)** :
    - Bottom navigation (tab bar) pour la nav principale
    - Drawer pour les sections secondaires
    - Stack navigation pour la profondeur

    **Mobile (6+ sections)** :
    - Bottom nav pour le top 5 + Drawer pour le reste
    - Ou tab bar + "Plus" comme 5e item

    **Web** :
    - Top navbar + sidebar pour les apps riches
    - Top navbar seule pour les sites vitrines
    - Breadcrumbs pour la profondeur > 2 niveaux

    **Desktop** :
    - Sidebar permanente pour les apps métier
    - Navigation Rail pour les apps compactes

    Justifier chaque choix par :
    - Le nombre de sections (Hick : limiter les options)
    - La profondeur de l'arborescence
    - Les conventions plateforme (Jakob : respecter les attentes)
  </process>

  <next>Passer à step-03-composants.md</next>
</step>
