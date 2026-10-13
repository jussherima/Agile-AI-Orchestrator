# Standards et Normes UX/UI — Référence Orchestral

## 1. Normes ISO

### ISO 9241-110:2020 — 7 principes d'interaction
1. **Aptitude à la tâche** — Le système aide à accomplir la tâche efficacement
2. **Auto-description** — L'état et les possibilités sont évidents
3. **Conformité aux attentes** — Comportement prévisible, conforme aux conventions
4. **Facilité d'apprentissage** — Guide la découverte et la mémorisation
5. **Contrôlabilité** — L'utilisateur garde le contrôle
6. **Robustesse aux erreurs** — Prévient, tolère et permet la récupération
7. **Engagement utilisateur** — Motivant et satisfaisant

### ISO/IEC 25010:2023 — Interaction Capability (8 sous-caractéristiques)
1. Appropriateness recognizability
2. Learnability
3. Operability
4. User error protection
5. User engagement
6. Inclusivity
7. User assistance
8. Self-descriptiveness

## 2. WCAG 2.2 — Accessibilité

### 4 principes (POUR)
- **Perceptible** — Information présentable de manière perceptible
- **Utilisable** — Composants et navigation utilisables
- **Compréhensible** — Information et fonctionnement compréhensibles
- **Robuste** — Contenu interprétable par divers agents

### Niveaux
- **A** — Minimum essentiel
- **AA** — Recommandé (obligation légale)
- **AAA** — Optimal

### Ratios de contraste
| Niveau | Texte normal | Grand texte (≥18px ou ≥14px bold) | Composants UI |
|--------|-------------|----------------------------------|---------------|
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | — |

### Tailles de cible tactile
- Apple HIG : 44×44 px minimum
- Material Design : 48×48 px recommandé
- WCAG 2.5.5 (AA) : 24×24 CSS px
- Espacement entre cibles : minimum 8px

## 3. Heuristiques de Nielsen (10)

1. **Visibilité de l'état du système** — Feedback rapide et adéquat
2. **Correspondance système/monde réel** — Langage de l'utilisateur, conventions réelles
3. **Contrôle et liberté** — Sorties de secours, annuler/refaire
4. **Cohérence et standards** — Conventions de la plateforme respectées
5. **Prévention des erreurs** — Éliminer les conditions propices aux erreurs
6. **Reconnaissance plutôt que rappel** — Éléments visibles en contexte
7. **Flexibilité et efficacité** — Raccourcis pour experts
8. **Design esthétique et minimaliste** — Chaque info doit être nécessaire
9. **Aide à la correction des erreurs** — Messages clairs avec solution
10. **Aide et documentation** — Consultable, focalisée sur la tâche

## 4. Lois UX essentielles

| Loi | Règle |
|-----|-------|
| **Fitts** | Plus une cible est grande et proche, plus elle est rapide à atteindre |
| **Hick** | Plus d'options = décision plus lente |
| **Jakob** | Les utilisateurs s'attendent au même fonctionnement que les sites qu'ils connaissent |
| **Miller** | Mémoire de travail : 7 ± 2 éléments |
| **Doherty** | Feedback en < 400ms pour maintenir l'engagement |
| **Von Restorff** | Un élément visuellement différent est mieux mémorisé |
| **Peak-End** | L'expérience est jugée sur les pics et la fin |

## 5. Principes Gestalt

- **Proximité** — Éléments proches = même groupe
- **Similarité** — Éléments similaires = liés
- **Région commune** — Éléments dans une zone délimitée = groupe
- **Continuité** — Alignement guide l'œil
- **Clôture** — Le cerveau complète les formes incomplètes
- **Figure-fond** — Distinction premier plan / arrière-plan

## 6. Principes de Don Norman

1. **Affordance** — L'objet suggère son usage
2. **Signifiants** — Indices visuels indiquant où et comment agir
3. **Feedback** — Retour immédiat sur chaque action
4. **Mapping** — Correspondance naturelle commandes/effets
5. **Contraintes** — Limiter les interactions pour prévenir les erreurs
6. **Modèle conceptuel** — Image mentale du fonctionnement

## 7. Métriques UX

### Comportementales
| Métrique | Benchmark |
|----------|-----------|
| Task Completion Rate | Moyenne ~78% |
| Time on Task | Moins = mieux |
| Error Rate | < 10% = bon |
| Learnability | Courbe descendante = bon |

### Attitudinales
| Métrique | Interprétation |
|----------|---------------|
| SUS (System Usability Scale) | > 68 = au-dessus de la moyenne ; > 80 = excellent |
| NPS | > 0 = positif ; > 50 = excellent |
| CSAT | > 4/5 = bon |
| SEQ | > 5.5/7 = facile |

### Framework HEART (Google)
- **H**appiness — Satisfaction
- **E**ngagement — Fréquence, durée
- **A**doption — Nouveaux utilisateurs
- **R**etention — Taux de retour
- **T**ask success — Completion, erreurs

## 8. Red Flags UX

| Red Flag | Problème |
|----------|----------|
| Pas d'état vide | L'utilisateur ne sait pas quoi faire |
| Messages d'erreur génériques | Impossible de corriger |
| Actions irréversibles sans confirmation | Perte de contrôle |
| Surcharge d'options | Paralysie décisionnelle (Hick) |
| Jargon technique | Rupture du modèle mental |
| Pas de feedback après action | Doute sur le résultat |
| Cibles tactiles < 44px | Erreurs de tap |
| Texte à faible contraste | Illisible pour ~8% de la population |
| Onboarding 10+ écrans | Surcharge cognitive, abandon |
