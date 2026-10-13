# Méthodologies UX — Référence Orchestral

## 1. Double Diamond (Design Council)

### Phase 1 : Discover (Divergence)
**Objectif :** Comprendre le problème réel.
- Interviews, observations terrain, benchmark
- **Livrables :** Rapport de recherche, personas préliminaires, empathy maps

### Phase 2 : Define (Convergence)
**Objectif :** Formuler le bon problème.
- Affinité mapping, synthèse des insights, problem statement
- **Livrables :** Brief de design, personas finalisés, journey maps (as-is), critères de succès

### Phase 3 : Develop (Divergence)
**Objectif :** Explorer les solutions.
- Co-création, sketching, wireframes lo-fi, prototypage papier
- **Livrables :** Concepts multiples, prototypes, résultats de tests préliminaires

### Phase 4 : Deliver (Convergence)
**Objectif :** Finaliser et livrer.
- Prototypage hi-fi, tests utilisabilité, handoff dev
- **Livrables :** Prototype interactif, design system, specs, rapport de tests

## 2. Design Thinking (Stanford d.school)

### 5 étapes (itératives, non-linéaires)

1. **Empathize** — 5+ interviews par segment, observer en contexte, documenter dit/fait/pense/ressent
2. **Define** — POV : "[Utilisateur] a besoin de [besoin] parce que [insight]"
3. **Ideate** — Crazy Eights, SCAMPER, mind mapping, dot voting
4. **Prototype** — Commencer par le plus simple, un prototype par hypothèse
5. **Test** — 5 utilisateurs détectent ~85% des problèmes, observer sans guider

## 3. User Research

### Méthodes

| Méthode | Type | Quand |
|---------|------|-------|
| Interviews | Quali, 5-15 participants | Comprendre besoins et motivations |
| Surveys | Quanti, 100+ répondants | Mesurer satisfaction, tendances |
| Card Sorting | Quali/Quanti | Concevoir l'architecture de l'info |
| Tree Testing | Quanti | Valider l'architecture proposée |
| A/B Testing | Quanti | Comparer deux variantes |
| Tests utilisabilité | Quali | Évaluer l'utilisabilité |

### Personas — Structure
- Nom et photo (fictif réaliste)
- Démographie : âge, profession, localisation
- Bio/Contexte
- Objectifs et motivations
- Frustrations / Pain points
- Comportements numériques
- Citations (verbatims réels)
- Scénarios d'usage

**Règles :** Basé sur données réelles, 3-5 max, mise à jour régulière.

### User Journey Map — Composants
- Étapes (stages)
- Actions utilisateur
- Pensées
- Émotions (courbe)
- Points de contact
- Pain points
- Opportunités

### Empathy Map — 4 quadrants
- **Says** — Citations directes
- **Thinks** — Préoccupations
- **Does** — Actions observables
- **Feels** — Émotions

## 4. UX Deliverables

### Phase Recherche
Rapport de recherche, personas, empathy maps, journey maps, analyse concurrentielle, rapport card sorting

### Phase Architecture
Sitemap, user flows, task flows, content inventory, taxonomie

### Phase Design
Wireframes lo-fi, wireframes hi-fi, mockups, prototypes interactifs, design system, style guide, spécifications d'interaction

### Phase Validation
Rapport tests utilisabilité, rapport audit UX (heuristique), spécifications accessibilité, rapport A/B testing

### Phase Handoff
Redlines/annotations, assets exportés, documentation composants, guide d'implémentation

## 5. Audit UX — Processus

### 6 phases (1-3 semaines)
1. **Cadrage** (1-2j) — Objectifs, parcours critiques, données existantes
2. **Collecte** (2-3j) — Analytics, CSAT, NPS, heatmaps, enregistrements
3. **Analyse parcours** (2-3j) — Cartographier, identifier abandons et frictions
4. **Évaluation heuristique** (3-5j) — 10 heuristiques Nielsen, 3-5 évaluateurs
5. **Priorisation** (2-3j) — Severity ratings, matrice impact/effort
6. **Rapport** (1-2j) — Synthèse, détail, recommandations, planning

### Severity Ratings
| Niveau | Sévérité | Action |
|--------|----------|--------|
| 0 | Pas un problème | Aucune |
| 1 | Cosmétique | Si le temps le permet |
| 2 | Mineur | Priorité basse |
| 3 | Majeur | Priorité haute |
| 4 | Catastrophique | Correction immédiate |

### Critères de sévérité
- **Fréquence** : combien d'utilisateurs affectés ?
- **Impact** : à quel point ça affecte l'expérience ?
- **Persistance** : ponctuel ou récurrent ?
- **Contournement** : objectif atteignable autrement ?

## 6. Checklist d'un design UX "Validé"

### Validé quand :
- Tests utilisateurs : completion > 80%
- SUS > 68
- Audit heuristique : aucun problème sévérité 4 (catastrophique)
- WCAG AA respecté
- Cohérence visuelle vérifiée sur tous les écrans
- Tous les états designés (vide, erreur, chargement, premier usage)

### Pas prêt quand :
- Parcours majeurs non testés
- États manquants
- Accessibilité non vérifiée
- Inconsistances visuelles
- Métriques sous les benchmarks
