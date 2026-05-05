# Design system — Aurélien & Lisbeth

Ce document décrit les règles globales (couleurs, typographie, espacements, motifs récurrents) qui régissent le site. Toute nouvelle section ou composant **devrait s'appuyer exclusivement sur les tokens CSS définis dans `src/styles/tokens.css`** plutôt que sur des valeurs en dur.

---

## 1. Tokens (`src/styles/tokens.css`)

### Couleurs

| Token | Hex | Usage |
|---|---|---|
| `--creme` | `#FBF8F2` | Fond global, contrastes inversés (texte clair sur fond sombre) |
| `--crayon` | `#2A1F18` | Texte courant (couleur du `<body>`) |
| `--primary` | `#6F1712` | Bordeaux — titres, boutons primaires, accents forts |
| `--secondary` | `#123827` | Sapin — infos secondaires (liens, lieu, sous-titres) |
| `--tertiary` | `#B8923B` | Doré — décorations (timeline, flourishes, bordures FAQ, monogramme) |
| `--ligne` | `#E5DFD3` | Filets neutres (cards, inputs, séparateurs discrets) |

**Règle :** ne jamais réécrire ces couleurs en dur dans une nouvelle règle. Pour une variante avec opacité, utiliser `color-mix(in srgb, var(--<token>) X%, transparent)`.

### Typographie

| Token | Valeur | Usage |
|---|---|---|
| `--font-serif` | `'Dancing Script', cursive` | Tous les titres (`h1–h4`), valeurs calligraphiques (`.hero__meta dd em`) |
| `--font-sans` | `'Montserrat', sans-serif` | Corps de texte (par défaut sur `<body>`) |
| `--text-label` | `0.75rem` (12px) | Texte uppercase (eyebrow, boutons, liens uppercase, labels de form) |
| `--text-body` | `0.9rem` (~14px) | Corps de texte par défaut |

**Hiérarchie des tailles** (codée en dur, pas dans tokens) :

| Élément | Taille |
|---|---|
| `h1` / `.hero__names` | `5rem` |
| `h2` / `.section-title` | `3.5rem` |
| `h3` (timeline title, hotel h3, info-grid h3) | `2rem` |
| `.hero__meta dd em` | `1.85rem` (calligraphique) |
| `.faq__item > summary::after` (icône `+`) | `1.5rem` |

### Tracking (letter-spacing)

| Token | Valeur | Usage |
|---|---|---|
| `--track-label` | `0.13em` | Texte uppercase général |
| `--track-nav` | `0.2em` | Nav menu uniquement |

### Espacements (verticaux)

| Token | Valeur | Usage |
|---|---|---|
| `--space-sm` | `1rem` | `<p>` margin-bottom (base) |
| `--space-md` | `2rem` | Marges intermédiaires (timeline CTA) |
| `--space-lg` | `4rem` | Marges entre titre et contenu (`.section-title`, `.lead`, etc.) |
| `--section-py-desktop` | `6rem` | Padding vertical des `<section class="section">` desktop |
| `--section-py-mobile` | `4rem` | Idem, mobile (≤ 768px) |

**Règle :** entre deux sections, l'espace haut + guirlande + bas est symétrique grâce à `--section-py-desktop` / `--section-py-mobile`. La compensation pour la 1ʳᵉ guirlande (sous le hero) est gérée dans `.hero + .garland`.

### Containers (largeurs max)

| Token | Valeur | Usage |
|---|---|---|
| `--container-narrow` | `720px` | Narrow (RSVP, liste, FAQ) |
| `--container-medium` | `960px` | Standard (programme, hébergements, infos) |
| `--container-wide` | `1200px` | Pour usage futur, pas utilisé actuellement |

Appliqués via `.container.container--narrow` / `--medium` / `--wide` autour du contenu d'une section.

### Couleur fonctionnelle / opacités

| Token | Valeur | Usage |
|---|---|---|
| `--opacity-mute` | `0.75` | Texte secondaire (paragraphes assombris : `.lead`, `.hotel p`, `.timeline-festive__desc`, etc.) |
| `--opacity-soft` | `0.85` | Texte légèrement assombri (`.faq__item p`, `.info-grid p/li`) |

**Règle :** ne jamais utiliser `opacity: 0.78` ou `0.8` ad hoc — choisir l'un des deux tokens.

### Tokens utilitaires

| Token | Valeur | Usage |
|---|---|---|
| `--radius-sm` | `2px` | Boutons, inputs, focus outlines |
| `--radius-md` | `4px` | Cartes (`.hotel`), carte iframe (`.map`) |
| `--border-fine` | `1px solid var(--ligne)` | Bordures discrètes (cartes, inputs, séparateurs) |
| `--transition-fast` | `.25s ease` | Transitions standard (color, background, border-color, opacity) |

### Décorations SVG

| Token | Description |
|---|---|
| `--svg-flourish` | S-curves dorées (viewBox 80×14). Réutilisée en nav header desktop, monogramme mobile, footer. Stroke-width = 0.4. |
| `--svg-diamond` | Petit losange doré (viewBox 8×8). Séparateur entre items dans la nav et le footer. |

**Note :** la couleur dorée `#B8923B` est figée en hex à l'intérieur du data-URL — `var()` n'est pas utilisable dans `url("data:...")`. Si la palette change, il faudra mettre à jour ces deux tokens.

---

## 2. Patterns CSS récurrents

### Pattern "uppercase label"

Pour tout texte en majuscules (eyebrow, boutons, liens, labels de form, sous-titres uppercase), utiliser une des classes ci-dessous **et ne pas re-déclarer** `font-size` / `letter-spacing` / `text-transform` :

```css
/* Centralisé dans base.css */
:is(
  .eyebrow,
  .nav__links a,
  .hero__meta dt,
  .footer,
  .timeline-festive__place,
  .btn-ghost,
  .btn-primary,
  .calendar-add__menu button,
  .hotel__tag,
  .link-uppercase,
  .info-note,
  .field label,
  .field legend
) {
  font-size: var(--text-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
}
```

**Pour ajouter un nouvel élément qui doit suivre ce pattern :** ajouter sa classe dans la liste du `:is()`. Ne pas re-déclarer les 3 propriétés sur la classe elle-même.

### Pattern "section"

Une section standard suit ce HTML :

```html
<section class="section section--<nom>" id="<nom>">
  <div class="container container--<narrow|medium>">
    <h2 class="section-title">Titre</h2>
    <!-- contenu -->
  </div>
</section>
<!-- guirlande entre deux sections -->
<div class="garland" aria-hidden="true"></div>
```

**Règles :**
- `.section` gère le padding vertical (`--section-py-desktop` / `--section-py-mobile`).
- `.container` gère la largeur max et le padding horizontal (`4vw`).
- `.section-title` (sur le `<h2>`) centre + colore en `--primary` + ajoute `margin-bottom: var(--space-lg)`.
- Une `.garland` séparée vit en dehors de la section — elle se loge automatiquement entre les paddings inférieur de la section précédente et supérieur de la suivante.

### Anchors et spans

`a, span` ont par défaut `font-size: var(--text-body)` (règle globale dans `base.css`). Conséquences :
- Les spans imbriqués (e.g. `.hero__meta dd em` ou `.timeline-festive__place-text span`) qui doivent suivre la taille du parent doivent forcer `font-size: inherit`.
- Les liens `.link-uppercase` (uppercase) sont remontés en `--text-label` via le `:is()` ci-dessus, et ils gagnent en spécificité (0,1,1) contre la règle bare-element `a` (0,0,1).

### Décorations dorées

| Pattern | Implémentation |
|---|---|
| Tiret doré (avant un label uppercase) | `::before { content:''; width: ?; height: 1px; background: var(--tertiary); }` voir `.eyebrow::before`, `.hero__meta dt::before`. |
| Flourish (vague) | `background: var(--svg-flourish) center / contain no-repeat;` avec largeur ≥ 60px. |
| Losange séparateur | `background: var(--svg-diamond) center / contain no-repeat;` carré 6×6 ou 8×8. |
| Bordure dorée atténuée | `1px solid color-mix(in srgb, var(--tertiary) 45%, transparent)` (voir FAQ). |

### Cards

```html
<article class="hotel">
  <div class="hotel__media"><img src="..." /></div>
  <div class="hotel__body">
    <h3>Nom</h3>
    <p>Description</p>
    <a class="link-uppercase">Voir le site →</a>
  </div>
</article>
```

Règles :
- `border: var(--border-fine)` + `border-radius: var(--radius-md)` au container.
- Hover : `border-color: var(--primary)` + transform sur l'image.
- Lien CTA en bas via `align-self: flex-start; margin-top: auto`.

---

## 3. Hiérarchie des fichiers CSS

| Fichier | Rôle |
|---|---|
| `src/styles/tokens.css` | **Tous les tokens** (`:root` uniquement, pas de règles autres). Source unique de vérité pour les valeurs. |
| `src/styles/base.css` | Reset, styles de balises (`html`, `body`, `h1–h4`, `a`, `button`, `img`), classes utilitaires (`.eyebrow`, `.section-title`, `.container`, `.garland`, `.sr-only`), media queries reduced-motion. Pattern `:is(...)` uppercase est ici. |
| `src/styles/sections.css` | Toutes les sections / composants spécifiques au site (header, hero, programme, hébergements, infos, RSVP, FAQ, footer). Doit toujours s'appuyer sur les tokens. |

**Règle :** les nouveaux composants vont dans `sections.css`, sauf si c'est un utilitaire vraiment générique → `base.css`. Les nouvelles valeurs (couleur, espacement, etc.) doivent passer par un nouveau token dans `tokens.css`.

---

## 4. Couleur par contexte (ant-sèche)

| Contexte | Couleur |
|---|---|
| Texte courant | `var(--crayon)` |
| Titres (`.section-title`, `.hotel h3`, `.timeline-festive__title`, `.info-grid h3`) | `var(--primary)` (bordeaux) |
| Liens secondaires (`.link-uppercase`), `.timeline-festive__place`, `.hero__sub`, `.hero__countdown`, `.rsvp-status.is-success` | `var(--secondary)` (sapin) |
| Décorations (eyebrows, monogramme, burger menu, bordures FAQ, marqueurs timeline, flourish, losange) | `var(--tertiary)` (doré) |
| Boutons primaires (`.btn-primary`) | fond `--primary`, texte `--creme`, hover fond `--secondary` |
| Boutons fantômes (`.btn-ghost`) | bordure + texte `--primary`, hover fond `--primary` |
| Erreurs (form, `.rsvp-status.is-error`, `is-invalid`) | `var(--primary)` |

---

## 5. Responsive

Breakpoint principal : **`768px`** (mobile ≤ 768, desktop ≥ 769).
Breakpoint secondaire : **`640px`** (footer ultra-compact, `.map` plus court).

**Patterns mobile :**
- Grid → flex column (hero, timeline)
- Eyebrow / dt / nav-links → centrés (eyebrow et hero passent en `text-align: center`)
- Nav : burger visible, monogramme centré absolu, dropdown sous le bandeau
- Footer : seuls les noms restent visibles, flourishes conservées

---

## 6. À faire si on change un token

| Changement | Effet en cascade |
|---|---|
| `--primary` (bordeaux) | tous les titres, boutons primaires, monogramme focus, bordures hover des cartes |
| `--secondary` (sapin) | liens, lieu, sous-titres, fond du footer |
| `--tertiary` (doré) | décorations, monogramme, mais **pas** les SVG inline (`--svg-flourish`, `--svg-diamond`) qui figent le hex `%23B8923B` |
| `--font-serif` | tous les titres, valeurs `<em>` du hero |
| `--text-label` / `--text-body` | toutes les règles centralisées via `:is(...)` ou `font-size: var(--text-body)` |
| `--section-py-*` | espacement vertical des sections **et** offset de la première guirlande |

---

## 7. Checklist avant d'ajouter une nouvelle règle CSS

- [ ] Une variable existe-t-elle déjà pour cette valeur ? (taille, couleur, transition…)
- [ ] La couleur est-elle l'une des 3 sémantiques (`primary`/`secondary`/`tertiary`) ou une variante via `color-mix` ?
- [ ] Le pattern uppercase est-il géré par le `:is(...)` plutôt que dupliqué ?
- [ ] La transition utilise-t-elle `var(--transition-fast)` ?
- [ ] La bordure utilise-t-elle `var(--border-fine)` quand applicable ?
- [ ] Si c'est responsive : la règle mobile fait-elle partie d'un `@media (max-width: 768px)` (ou 640px pour les cas extrêmes) ?
