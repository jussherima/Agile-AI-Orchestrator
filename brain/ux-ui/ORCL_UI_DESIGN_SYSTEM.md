# Systèmes de Design UI — Référence Orchestral

## 1. Atomic Design (Brad Frost)

5 niveaux hiérarchiques :
1. **Atomes** — Éléments HTML fondamentaux : labels, inputs, boutons, icônes
2. **Molécules** — Groupes d'atomes : label + input + bouton = recherche
3. **Organismes** — Composants complexes : header avec logo + nav + recherche
4. **Templates** — Layouts sans contenu réel
5. **Pages** — Templates avec contenu réel, test de résilience

## 2. Design Tokens (3 niveaux)

```
REFERENCE TOKENS (primitives)
  blue-500: #2196F3, space-4: 16px
       ↓
SYSTEM TOKENS (sémantiques)
  color-primary: {blue-500}, spacing-md: {space-4}
       ↓
COMPONENT TOKENS (spécifiques)
  button-bg: {color-primary}, card-padding: {spacing-md}
```

Formats d'export : JSON, CSS custom properties, SCSS, Swift/Kotlin.

## 3. Composants UI essentiels

### Contrôles d'entrée
Boutons (primary, secondary, tertiary, ghost, icon, FAB, toggle), champs texte, selecteurs, checkboxes, radios, switches, sliders, date/time pickers, file upload, stepper

### Navigation
Top app bar, sidebar/drawer, tab bar, bottom navigation, breadcrumbs, pagination, menu hamburger, menu contextuel

### Affichage
Cards, listes, tableaux, badges/tags, avatars, tooltips, progress bars, accordéons, tabs de contenu, carrousels, timelines, skeleton loaders, empty states

### Feedback
Toasts (2-4s, auto), snackbars (4-10s, action optionnelle), modals (action requise), alertes/bannières, spinners/loaders

## 4. Patterns de formulaires

### Validation
- Inline au blur (pas à chaque frappe)
- Bordure rouge + message sous le champ
- Désactiver submit si champs requis vides

### États
- Default, focus, filled, error, disabled, loading, success

## 5. Responsive Design

### Breakpoints standards
| Catégorie | Largeur |
|-----------|---------|
| Mobile S | 320px |
| Mobile M | 375px |
| Mobile L | 425px |
| Tablette | 768px |
| Laptop | 1024px |
| Desktop | 1440px |
| Large | 2560px |

### Mobile-first
```css
/* Base: mobile */
@media (min-width: 768px)  { /* Tablette */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large */ }
```

## 6. Typographie

### Échelle (Material Design 3)
| Rôle | Taille | Line Height | Usage |
|------|--------|-------------|-------|
| Display Large | 57px | 64px | Titres hero |
| Headline Large | 32px | 40px | H1 |
| Headline Medium | 28px | 36px | H2 |
| Headline Small | 24px | 32px | H3 |
| Title Large | 22px | 28px | Sections |
| Body Large | 16px | 24px | Texte principal |
| Body Medium | 14px | 20px | Texte secondaire |
| Body Small | 12px | 16px | Texte tertiaire |
| Label Large | 14px | 20px | Boutons |

## 7. Couleurs

### Palette recommandée
- 1 primaire (marque, actions principales)
- 1 secondaire (accents)
- 1 tertiaire (optionnelle)
- Neutres (5-10 nuances de gris)
- Sémantiques : succès (vert), erreur (rouge), warning (orange), info (bleu)

### Vérifications
- Contraste checker sur chaque combinaison
- Mode clair ET sombre
- Simulateur de daltonisme

## 8. Spacing System (grille 8px)

```
4px  — micro (cas spéciaux)
8px  — xs
16px — sm
24px — md
32px — lg
48px — xl
64px — 2xl
80px — 3xl
```

Règles :
- Padding interne < marge externe
- Line heights : multiples de 4px
- UNIQUEMENT les valeurs de l'échelle

## 9. Pipeline création UI

| Étape | Fidélité | Objectif |
|-------|----------|----------|
| Wireframe | Basse | Structure, layout, hiérarchie |
| Mockup | Haute | Design visuel final |
| Prototype | Interactive | Tester flux et interactions |
| Handoff | Technique | Specs pour les devs |

## 10. Handoff Design → Dev

Informations obligatoires :
- **Spacing** : système, margins, padding, grille, responsive
- **Colors** : palette complète, sémantiques, opacités, mode sombre
- **Typography** : familles, échelle, styles nommés, responsive
- **Interactions** : états (default, hover, focus, active, disabled, loading, error, success), transitions, animations
- **Responsive** : breakpoints, comportement par composant
- **Assets** : SVG, images @1x/@2x/@3x
- **Accessibilité** : rôles ARIA, tabulation, alt-text, labels
