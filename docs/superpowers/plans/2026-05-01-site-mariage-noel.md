# Site de mariage Lisbeth & Aurélien — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire un site web statique d'une page pour le mariage de Lisbeth & Aurélien (5 décembre 2026, Boulogne-sur-Mer), avec RSVP relié à Google Sheet, hébergé sur GitHub Pages.

**Architecture:** Page unique HTML/CSS/JS vanilla, build optimisé par Vite, déployée via GitHub Actions sur GitHub Pages. Le RSVP envoie un POST JSON à un endpoint Google Apps Script qui écrit les réponses dans une Google Sheet.

**Tech Stack:** HTML5, CSS3 (custom properties), JavaScript vanilla (modules ES), Vite (build), Vitest (tests unitaires JS), Google Apps Script (backend RSVP), Google Sheets (storage), GitHub Pages (hosting).

**Spec source:** `docs/superpowers/specs/2026-05-01-site-mariage-noel-design.md`

**Scope :** Plan unique pour un site cohérent. Aucun sous-système indépendant à scinder.

---

## File structure

Cette structure découle du spec §5. Chaque fichier a une responsabilité unique.

```
lisbeth-et-aurelien/
├── index.html                       # Page unique, balisage sémantique des 7 sections
├── public/                          # Servi tel quel par Vite (pas de hash)
│   ├── CNAME                        # Domaine custom (T8 — TBD)
│   ├── favicon.svg
│   └── og-cover.jpg                 # Image Open Graph 1200x630 (placeholder dans Task 14)
├── src/
│   ├── main.js                      # Entry point Vite : importe les modules JS
│   ├── styles/
│   │   ├── tokens.css               # Variables CSS (couleurs, typo, espacements)
│   │   ├── base.css                 # Reset + body + typo + nav + utilitaires
│   │   └── sections.css             # Styles spécifiques aux 7 sections
│   ├── scripts/
│   │   ├── nav.js                   # Sticky nav, smooth scroll, classe scrolled
│   │   ├── calendar.js              # Génération .ics (testé)
│   │   └── rsvp.js                  # Validation + fetch (validation testée)
│   └── assets/
│       └── (vide pour l'instant — hero photo TBD T4)
├── apps-script/
│   └── rsvp.gs                      # Code Apps Script (déploiement manuel)
├── tests/
│   ├── calendar.test.js
│   └── rsvp.test.js
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docs/superpowers/
│   ├── specs/2026-05-01-site-mariage-noel-design.md
│   └── plans/2026-05-01-site-mariage-noel.md       # ce fichier
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

Les fichiers actuels au moment de démarrer le plan (sur `main`) — `index.html`, `index.js`, `styles.css`, `images/*` (Provence template), `assets/fonts/*`, `CNAME` — seront **supprimés** dans la Task 1. Tout le contenu utile (Christmas archive, scaffold, WIP) est déjà préservé dans le worktree `../lisbeth-et-aurelien-archive` sur la branche `archive/pre-redesign-snapshot`.

---

## Task 1 — Nettoyer `main` et poser le squelette Vite

**Files:**
- Delete: `index.html`, `index.js`, `styles.css`, `images/`, `assets/`, `CNAME`
- Create: `index.html`, `vite.config.js`, `src/main.js`, `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/sections.css`, `src/scripts/nav.js`, `src/scripts/calendar.js`, `src/scripts/rsvp.js`, `public/.gitkeep`, `tests/.gitkeep`
- Modify: `package.json` (ajouter scripts test, dependencies vitest)

- [ ] **Step 1: Supprimer les fichiers Provence template**

```bash
cd /home/heuxa/dev/claude/lisbeth-et-aurelien
rm -rf index.html index.js styles.css images assets CNAME
```

- [ ] **Step 2: Vérifier que main reste cohérent**

Run: `git status`
Expected: lots of `deleted:` lines, `package.json` and `node_modules/` untouched.

- [ ] **Step 3: Mettre à jour `package.json` pour ajouter Vitest**

Replace the entire content of `package.json`:

```json
{
  "name": "lisbeth-et-aurelien",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/aurelien-heux/lisbeth-et-aurelien.git"
  },
  "license": "ISC",
  "devDependencies": {
    "vite": "^7.3.1",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 4: Installer les dépendances**

Run: `npm install`
Expected: `node_modules/` mis à jour, vitest téléchargé, pas d'erreurs.

- [ ] **Step 5: Créer `vite.config.js`**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: false,
  },
});
```

- [ ] **Step 6: Créer le squelette `index.html` minimal**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lisbeth & Aurélien — 5 décembre 2026</title>
  <meta name="description" content="Site du mariage de Lisbeth & Aurélien, samedi 5 décembre 2026 à Boulogne-sur-Mer." />
  <link rel="stylesheet" href="/src/styles/tokens.css" />
  <link rel="stylesheet" href="/src/styles/base.css" />
  <link rel="stylesheet" href="/src/styles/sections.css" />
  <script type="module" src="/src/main.js"></script>
</head>
<body>
  <main>
    <p>Site en construction — Lisbeth &amp; Aurélien · 05.12.2026</p>
  </main>
</body>
</html>
```

- [ ] **Step 7: Créer les fichiers stub vides**

```bash
touch src/main.js src/styles/tokens.css src/styles/base.css src/styles/sections.css
touch src/scripts/nav.js src/scripts/calendar.js src/scripts/rsvp.js
mkdir -p public tests src/assets
touch public/.gitkeep tests/.gitkeep src/assets/.gitkeep
```

Then write `src/main.js`:

```js
import './scripts/nav.js';
import './scripts/calendar.js';
import './scripts/rsvp.js';
```

- [ ] **Step 8: Vérifier que `npm run dev` fonctionne**

Run: `npm run dev` (and Ctrl+C after seeing the URL)
Expected: Vite démarre sur `http://localhost:5173/`, la page affiche "Site en construction…".

- [ ] **Step 9: Vérifier que `npm run build` fonctionne**

Run: `npm run build`
Expected: dossier `dist/` créé, contient `index.html` et `assets/`. Aucune erreur.

- [ ] **Step 10: Mettre à jour `.gitignore`**

Replace `.gitignore` content:

```
node_modules/
dist/
.idea/
.vscode/
.superpowers/
.DS_Store
.env.local
.env.*.local
```

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "Task 1: clean main and scaffold Vite project structure"
```

---

## Task 2 — Design tokens, base styles, polices

**Files:**
- Modify: `src/styles/tokens.css`, `src/styles/base.css`, `index.html`

- [ ] **Step 1: Définir les tokens CSS dans `src/styles/tokens.css`**

```css
:root {
  /* Couleurs */
  --creme:    #FBF8F2;
  --crayon:   #2A1F18;
  --bordeaux: #6F1712;
  --sapin:    #123827;
  --dore:     #B8923B;
  --ligne:    #E5DFD3;

  /* Polices */
  --font-serif: 'Cormorant Garamond', 'Times New Roman', serif;
  --font-sans:  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Espacements */
  --space-xs:  0.5rem;
  --space-sm:  1rem;
  --space-md:  2rem;
  --space-lg:  4rem;
  --space-xl:  7rem;

  /* Padding sections */
  --section-py-desktop: 7rem;
  --section-py-mobile:  4rem;

  /* Containers */
  --container-narrow: 720px;
  --container-medium: 960px;
  --container-wide:   1200px;

  /* Tracking */
  --track-label: 0.25em;
  --track-nav:   0.2em;
}
```

- [ ] **Step 2: Écrire les styles de base dans `src/styles/base.css`**

```css
*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--creme);
  color: var(--crayon);
  font-family: var(--font-sans);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  margin: 0;
  font-weight: 400;
  line-height: 1.2;
}

p { margin: 0 0 var(--space-sm); }

a { color: inherit; text-decoration: none; }

img { max-width: 100%; height: auto; display: block; }

button {
  font: inherit;
  border: none;
  background: none;
  cursor: pointer;
  color: inherit;
}

/* Utilitaires */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.7rem;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--bordeaux);
}

.eyebrow::before {
  content: '';
  width: 30px;
  height: 1px;
  background: var(--bordeaux);
}

.section-title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(2.5rem, 4.5vw, 3.6rem);
  text-align: center;
  letter-spacing: -0.5px;
  margin-bottom: var(--space-lg);
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 4vw;
}
.container--narrow { max-width: var(--container-narrow); }
.container--medium { max-width: var(--container-medium); }
.container--wide   { max-width: var(--container-wide); }

.section {
  padding: var(--section-py-desktop) 0;
  border-top: 1px solid var(--ligne);
}

@media (max-width: 768px) {
  .section { padding: var(--section-py-mobile) 0; }
}

/* Visually hidden (accessibility) */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

/* Honeypot (caché à l'œil mais pas pour les bots) */
.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
```

- [ ] **Step 3: Charger les Google Fonts dans `index.html`**

Add inside `<head>`, before the `<link rel="stylesheet" href="/src/styles/tokens.css" />`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400;1,500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
```

- [ ] **Step 4: Vérifier visuellement avec `npm run dev`**

Run: `npm run dev`
Open: `http://localhost:5173/`
Expected: page sur fond crème, texte en Inter 300, l'utilitaire `.eyebrow` n'a pas encore d'usage (rien à voir, c'est attendu).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Task 2: design tokens, base styles, fonts loading"
```

---

## Task 3 — Navigation sticky + scroll fluide

**Files:**
- Modify: `index.html`, `src/styles/sections.css`, `src/scripts/nav.js`

- [ ] **Step 1: Ajouter le markup de navigation dans `index.html`**

Replace the `<body>` content:

```html
<body>
  <a class="sr-only" href="#contenu">Aller au contenu</a>

  <nav class="nav" aria-label="Navigation principale">
    <a class="nav__monogram" href="#hero">L &amp; A</a>
    <ul class="nav__links">
      <li><a href="#programme">Programme</a></li>
      <li><a href="#hebergements">Hébergements</a></li>
      <li><a href="#infos">Infos</a></li>
      <li><a href="#rsvp">RSVP</a></li>
      <li><a href="#liste">Liste</a></li>
      <li><a href="#faq">FAQ</a></li>
    </ul>
    <span class="nav__date">05 · 12 · 2026</span>
    <button class="nav__burger" aria-label="Ouvrir le menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <main id="contenu">
    <p style="padding: 8rem 4vw;">Sections à venir…</p>
  </main>
</body>
```

- [ ] **Step 2: Styler la nav dans `src/styles/sections.css`**

Add at the top:

```css
/* ===== Nav ===== */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 4vw;
  background: rgba(251, 248, 242, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid transparent;
  transition: border-color .25s ease;
}

.nav.is-scrolled {
  border-bottom-color: var(--ligne);
}

.nav__monogram {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.15rem;
  letter-spacing: 0.5px;
  color: var(--bordeaux);
}

.nav__links {
  display: flex;
  gap: 2.4rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__links a {
  font-size: 0.7rem;
  letter-spacing: var(--track-nav);
  text-transform: uppercase;
  color: var(--crayon);
  transition: color .25s;
}

.nav__links a:hover { color: var(--bordeaux); }

.nav__date {
  font-size: 0.7rem;
  letter-spacing: var(--track-nav);
  text-transform: uppercase;
  color: var(--bordeaux);
}

.nav__burger {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 0.4rem;
}
.nav__burger span {
  display: block;
  width: 22px;
  height: 1.5px;
  background: var(--crayon);
  transition: transform .25s, opacity .25s;
}

@media (max-width: 768px) {
  .nav__links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: var(--creme);
    border-bottom: 1px solid var(--ligne);
    padding: var(--space-md) 4vw;
  }
  .nav__links li { padding: 0.8rem 0; border-bottom: 1px solid var(--ligne); }
  .nav__links li:last-child { border-bottom: none; }

  .nav.is-open .nav__links { display: flex; }
  .nav.is-open .nav__burger span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
  .nav.is-open .nav__burger span:nth-child(2) { opacity: 0; }
  .nav.is-open .nav__burger span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }

  .nav__date { display: none; }
  .nav__burger { display: flex; }
}
```

- [ ] **Step 3: Implémenter `src/scripts/nav.js`**

```js
const nav = document.querySelector('.nav');
const burger = nav?.querySelector('.nav__burger');
const links = nav?.querySelectorAll('.nav__links a');

if (nav) {
  // Add scrolled class when page is scrolled
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
}

// Close mobile menu when a link is clicked
if (links && nav) {
  links.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger?.setAttribute('aria-expanded', 'false');
    });
  });
}
```

- [ ] **Step 4: Vérifier visuellement**

Run: `npm run dev`
- Desktop : nav fixée en haut, monogramme à gauche, liens centrés, date à droite. Au scroll, ligne fine apparaît sous la nav.
- Mobile : nav avec burger fonctionnel ; cliquer sur un lien referme le menu.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Task 3: sticky nav with smooth scroll and mobile burger"
```

---

## Task 4 — Section Hero

**Files:**
- Modify: `index.html`, `src/styles/sections.css`

- [ ] **Step 1: Remplacer le placeholder `<main>` par la structure des sections + Hero**

In `index.html`, replace `<main id="contenu">…</main>` with:

```html
  <main id="contenu">

    <header class="hero" id="hero">
      <div class="hero__left">
        <span class="eyebrow">Save the date</span>
        <h1 class="hero__names">
          Lisbeth<br>
          <span class="hero__amp">&amp;</span><br>
          Aurélien
        </h1>
        <p class="hero__tagline">
          <!-- TBD T5 : citation courte ou "" -->
          Rejoignez-nous pour célébrer notre union, au cœur de la saison la plus douce.
        </p>
      </div>
      <div class="hero__divider" aria-hidden="true"></div>
      <div class="hero__right">
        <dl class="hero__meta">
          <div>
            <dt>Le jour</dt>
            <dd>samedi <em>5 décembre</em><br><span class="hero__year">deux mille vingt-six</span></dd>
          </div>
          <div>
            <dt>Le lieu</dt>
            <dd>Boulogne<em>-sur-</em>Mer<br><span class="hero__sub">Côte d'Opale, France</span></dd>
          </div>
          <div>
            <dt>L'heure</dt>
            <dd>quatorze <em>heures</em></dd>
          </div>
        </dl>
      </div>
      <span class="hero__star" aria-hidden="true"></span>
    </header>

    <section class="section section--programme" id="programme">
      <div class="container container--narrow"><p>(Programme — à venir)</p></div>
    </section>

    <section class="section section--hebergements" id="hebergements">
      <div class="container container--medium"><p>(Hébergements — à venir)</p></div>
    </section>

    <section class="section section--infos" id="infos">
      <div class="container container--medium"><p>(Infos pratiques — à venir)</p></div>
    </section>

    <section class="section section--rsvp" id="rsvp">
      <div class="container container--narrow"><p>(RSVP — à venir)</p></div>
    </section>

    <section class="section section--liste" id="liste">
      <div class="container container--narrow"><p>(Liste de mariage — à venir)</p></div>
    </section>

    <section class="section section--faq" id="faq">
      <div class="container container--narrow"><p>(FAQ — à venir)</p></div>
    </section>

    <footer class="footer">
      <p>Lisbeth &amp; Aurélien · 05.12.2026 · Boulogne-sur-Mer</p>
    </footer>

  </main>
```

- [ ] **Step 2: Ajouter les styles Hero dans `src/styles/sections.css`**

Append:

```css
/* ===== Hero ===== */
.hero {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 4vw;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 6rem 4vw 4rem;
}

.hero__left  { text-align: right; }
.hero__right { text-align: left; }

.hero__divider {
  align-self: stretch;
  background: var(--ligne);
  height: 100%;
}

.hero__names {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(3.5rem, 7vw, 6.5rem);
  line-height: 0.95;
  letter-spacing: -1px;
  color: var(--crayon);
  margin: 1.4rem 0 0;
}

.hero__amp { color: var(--bordeaux); font-weight: 300; }

.hero__tagline {
  margin: 1.6rem 0 0;
  margin-left: auto;
  max-width: 32ch;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--crayon);
  opacity: 0.75;
}

.hero__meta {
  display: grid;
  gap: 1.4rem;
  margin: 0;
  padding: 0;
}
.hero__meta div { margin: 0; }
.hero__meta dt {
  display: block;
  font-size: 0.65rem;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--bordeaux);
  margin-bottom: 0.3rem;
}
.hero__meta dd {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 1.7rem;
  line-height: 1.2;
  color: var(--crayon);
}
.hero__meta dd em { font-style: italic; color: var(--bordeaux); }

.hero__year { font-size: 0.95rem; opacity: 0.7; }
.hero__sub  { font-size: 0.9rem;  opacity: 0.7; }

.hero__star {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 8px; height: 8px;
  background: var(--dore);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(184, 146, 59, 0.18);
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    min-height: 75vh;
    padding: 4rem 4vw;
    text-align: center;
  }
  .hero__left, .hero__right { text-align: center; }
  .hero__divider { display: none; }
  .hero__tagline { margin-left: auto; margin-right: auto; }
  .hero__star { display: none; }
}

/* Footer minimal */
.footer {
  background: var(--sapin);
  color: var(--creme);
  padding: 3rem 4vw;
  text-align: center;
  font-size: 0.75rem;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
}
```

- [ ] **Step 3: Vérifier visuellement**

Run: `npm run dev`
- Hero affiche prénoms italique sérif, esperluette bordeaux, méta à droite, étoile dorée centrale.
- Mobile : stack vertical centré, étoile masquée.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Task 4: hero section with editorial layout (names left, meta right)"
```

---

## Task 5 — Module de génération .ics (TDD)

**Files:**
- Create: `tests/calendar.test.js`
- Modify: `src/scripts/calendar.js`

- [ ] **Step 1: Écrire les tests dans `tests/calendar.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { buildIcs, escapeIcsText, formatIcsDate } from '../src/scripts/calendar.js';

describe('formatIcsDate', () => {
  it('formats a UTC date as YYYYMMDDTHHMMSSZ', () => {
    const d = new Date('2026-12-05T13:00:00Z');
    expect(formatIcsDate(d)).toBe('20261205T130000Z');
  });

  it('throws on invalid input', () => {
    expect(() => formatIcsDate('not-a-date')).toThrow();
    expect(() => formatIcsDate(new Date('invalid'))).toThrow();
  });
});

describe('escapeIcsText', () => {
  it('escapes commas, semicolons, backslashes and newlines', () => {
    expect(escapeIcsText('a, b; c\\d\ne')).toBe('a\\, b\\; c\\\\d\\ne');
  });

  it('returns empty string for null or undefined', () => {
    expect(escapeIcsText(null)).toBe('');
    expect(escapeIcsText(undefined)).toBe('');
  });
});

describe('buildIcs', () => {
  const event = {
    title: 'Mariage Lisbeth & Aurélien',
    start: new Date('2026-12-05T13:00:00Z'),
    end: new Date('2026-12-05T22:00:00Z'),
    location: 'Boulogne-sur-Mer, France',
    description: 'Cérémonie 14h, dîner 19h',
    uid: 'wedding-lisbeth-aurelien-20261205@example.com',
  };

  it('produces a valid VCALENDAR with all required fields', () => {
    const ics = buildIcs(event);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('SUMMARY:Mariage Lisbeth & Aurélien');
    expect(ics).toContain('LOCATION:Boulogne-sur-Mer\\, France');
    expect(ics).toContain('DTSTART:20261205T130000Z');
    expect(ics).toContain('DTEND:20261205T220000Z');
    expect(ics).toContain('UID:wedding-lisbeth-aurelien-20261205@example.com');
  });

  it('uses CRLF line endings as per RFC 5545', () => {
    const ics = buildIcs(event);
    expect(ics.includes('\r\n')).toBe(true);
    // No bare LF
    expect(/[^\r]\n/.test(ics)).toBe(false);
  });

  it('throws when start is after end', () => {
    expect(() => buildIcs({
      ...event,
      start: new Date('2026-12-05T22:00:00Z'),
      end: new Date('2026-12-05T13:00:00Z'),
    })).toThrow();
  });
});
```

- [ ] **Step 2: Lancer les tests pour vérifier qu'ils échouent**

Run: `npm test`
Expected: tous les tests échouent (`buildIcs is not a function` ou similaire).

- [ ] **Step 3: Implémenter `src/scripts/calendar.js`**

```js
const PROD_ID = '-//Lisbeth & Aurélien//Mariage 2026//FR';

export function formatIcsDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('formatIcsDate expects a valid Date');
  }
  const pad = (n) => String(n).padStart(2, '0');
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) + 'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) + 'Z'
  );
}

export function escapeIcsText(text) {
  if (text == null) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

export function buildIcs({ title, start, end, location, description, uid }) {
  if (start >= end) {
    throw new RangeError('buildIcs: start must be before end');
  }
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PROD_ID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

export function downloadIcs(filename, icsContent) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test`
Expected: tous les tests passent (8 tests verts).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Task 5: calendar.js — generate .ics for wedding event (TDD)"
```

---

## Task 6 — Section Programme (timeline + bouton calendrier)

**Files:**
- Modify: `index.html`, `src/styles/sections.css`, `src/scripts/calendar.js` (ajout du wiring)

- [ ] **Step 1: Remplacer le placeholder Programme dans `index.html`**

```html
    <section class="section section--programme" id="programme">
      <div class="container container--narrow">
        <p class="eyebrow" style="display:flex; justify-content:center; margin-bottom: 0.6rem;">Programme du jour</p>
        <h2 class="section-title">Le déroulé</h2>

        <ol class="timeline">
          <li class="timeline__row">
            <span class="timeline__time">14h</span>
            <div class="timeline__content">
              <h3>Cérémonie religieuse</h3>
              <p>Accueil des invités à partir de 13h30. Prévoir une tenue chaude — l'église n'est pas chauffée.</p>
              <p class="timeline__place">— Église à confirmer · Boulogne-sur-Mer —</p>
            </div>
          </li>
          <li class="timeline__row">
            <span class="timeline__time">17h</span>
            <div class="timeline__content">
              <h3>Vin d'honneur</h3>
              <p>Vin chaud, mets de saison et premières bulles, dans un cadre festif et tamisé.</p>
              <p class="timeline__place">— Lieu à préciser —</p>
            </div>
          </li>
          <li class="timeline__row">
            <span class="timeline__time">19h</span>
            <div class="timeline__content">
              <h3>Dîner de Noël</h3>
              <p>Dîner assis suivi d'une soirée dansante. Tenue élégante recommandée.</p>
              <p class="timeline__place">— Lieu à préciser —</p>
            </div>
          </li>
        </ol>

        <div class="timeline__cta">
          <button type="button" class="btn-ghost" id="add-to-calendar">Ajouter à mon agenda</button>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Ajouter les styles Programme dans `src/styles/sections.css`**

Append:

```css
/* ===== Programme / Timeline ===== */
.timeline {
  list-style: none;
  margin: 0 0 var(--space-lg);
  padding: 0;
}

.timeline__row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 3rem;
  align-items: baseline;
  padding: 2.2rem 0;
  border-bottom: 1px solid var(--ligne);
}
.timeline__row:last-child { border-bottom: none; }

.timeline__time {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.8rem;
  color: var(--bordeaux);
  text-align: right;
}

.timeline__content h3 {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
  letter-spacing: 0.3px;
}

.timeline__content p {
  font-size: 0.9rem;
  color: var(--crayon);
  opacity: 0.75;
  margin: 0 0 0.4rem;
}

.timeline__place {
  font-size: 0.65rem !important;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--dore) !important;
  opacity: 1 !important;
  margin-top: 0.6rem !important;
}

.timeline__cta { text-align: center; }

.btn-ghost {
  display: inline-block;
  padding: 0.95rem 1.8rem;
  font-size: 0.7rem;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--bordeaux);
  background: transparent;
  border: 1px solid var(--bordeaux);
  border-radius: 2px;
  transition: background .25s, color .25s;
}

.btn-ghost:hover {
  background: var(--bordeaux);
  color: var(--creme);
}

@media (max-width: 768px) {
  .timeline__row {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    text-align: center;
    padding: 1.6rem 0;
  }
  .timeline__time { text-align: center; }
}
```

- [ ] **Step 3: Câbler le bouton dans `src/scripts/calendar.js`**

Append at the end of `src/scripts/calendar.js`:

```js
// ----- Wiring du bouton "Ajouter à mon agenda" -----
const ADD_BTN_ID = 'add-to-calendar';

const WEDDING_EVENT = {
  title: 'Mariage Lisbeth & Aurélien',
  start: new Date('2026-12-05T13:00:00+01:00'), // 14h Paris (UTC+1 en décembre)
  end:   new Date('2026-12-05T23:00:00+01:00'), // minuit, fin estimée
  location: 'Boulogne-sur-Mer, France',
  description: '14h cérémonie religieuse · 17h vin d\'honneur · 19h dîner de Noël',
  uid: 'wedding-lisbeth-aurelien-20261205@lisbeth-et-aurelien',
};

const btn = document.getElementById(ADD_BTN_ID);
if (btn) {
  btn.addEventListener('click', () => {
    const ics = buildIcs(WEDDING_EVENT);
    downloadIcs('mariage-lisbeth-aurelien.ics', ics);
  });
}
```

- [ ] **Step 4: Tester manuellement**

Run: `npm run dev`
- Cliquer "Ajouter à mon agenda" → un fichier `mariage-lisbeth-aurelien.ics` se télécharge.
- Ouvrir le fichier (texte) : vérifier `BEGIN:VCALENDAR`, `DTSTART:20261205T130000Z`, etc.
- Importer dans Google Calendar / Apple Calendar : événement "Mariage Lisbeth & Aurélien" créé samedi 5 déc 2026 14h-23h.

- [ ] **Step 5: Vérifier que les tests passent toujours**

Run: `npm test`
Expected: 8 tests verts.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Task 6: programme section with timeline and add-to-calendar button"
```

---

## Task 7 — Section Hébergements

**Files:**
- Modify: `index.html`, `src/styles/sections.css`

- [ ] **Step 1: Remplacer le placeholder Hébergements dans `index.html`**

```html
    <section class="section section--hebergements" id="hebergements">
      <div class="container container--medium">
        <p class="eyebrow" style="display:flex; justify-content:center; margin-bottom: 0.6rem;">Où dormir</p>
        <h2 class="section-title">Hébergements</h2>

        <p class="lead">Quelques adresses recommandées à Boulogne-sur-Mer, à distance raisonnable des lieux du mariage.</p>

        <div class="hotels">
          <article class="hotel">
            <h3>Hôtel de la Matelote</h3>
            <p class="hotel__rating">★ ★ ★ ★</p>
            <p>Face à la mer, à 10 min en voiture du centre.</p>
            <a href="https://www.la-matelote.com/" target="_blank" rel="noopener noreferrer" class="link-bordeaux">Voir le site →</a>
          </article>
          <article class="hotel">
            <h3>Ibis Styles Centre Cathédrale</h3>
            <p class="hotel__rating">★ ★ ★</p>
            <p>Au cœur de la vieille ville, à pied de la cathédrale.</p>
            <a href="https://all.accor.com/" target="_blank" rel="noopener noreferrer" class="link-bordeaux">Voir le site →</a>
          </article>
          <article class="hotel">
            <h3>Opal'Inn</h3>
            <p class="hotel__rating">★ ★ ★</p>
            <p>Face à la plage, à 5 min en voiture du centre.</p>
            <a href="https://www.opalinn-hotel.com/" target="_blank" rel="noopener noreferrer" class="link-bordeaux">Voir le site →</a>
          </article>
        </div>

        <p class="hotels__note">Pensez aussi à <a href="https://www.airbnb.fr/s/Boulogne-sur-Mer" target="_blank" rel="noopener noreferrer" class="link-bordeaux">Airbnb</a> pour des locations plus spacieuses.</p>
      </div>
    </section>
```

- [ ] **Step 2: Ajouter les styles dans `src/styles/sections.css`**

Append:

```css
/* ===== Hébergements ===== */
.lead {
  text-align: center;
  max-width: 56ch;
  margin: 0 auto var(--space-lg);
  font-size: 0.95rem;
  color: var(--crayon);
  opacity: 0.75;
}

.hotels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  margin-bottom: var(--space-md);
}

.hotel {
  padding: 2rem 1.6rem;
  background: white;
  border: 1px solid var(--ligne);
  border-radius: 4px;
  text-align: left;
  transition: border-color .25s, transform .25s;
}

.hotel:hover {
  border-color: var(--bordeaux);
  transform: translateY(-3px);
}

.hotel h3 {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  margin-bottom: 0.4rem;
}

.hotel__rating {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--dore);
  margin-bottom: 0.8rem;
}

.hotel p {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-bottom: 1rem;
}

.link-bordeaux {
  font-size: 0.7rem;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--bordeaux);
  border-bottom: 1px solid transparent;
  transition: border-color .25s;
}
.link-bordeaux:hover { border-bottom-color: var(--bordeaux); }

.hotels__note {
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.75;
}
```

- [ ] **Step 3: Vérifier visuellement**

Run: `npm run dev`
- Section affiche 3 cartes d'hôtels en grille auto-fit.
- Hover : bordure bordeaux + lift de 3px.
- Mobile : cartes en 1 colonne.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Task 7: hébergements section with 3 hotels (Boulogne-sur-Mer)"
```

---

## Task 8 — Section Infos pratiques (carte + accès / tenue / météo)

**Files:**
- Modify: `index.html`, `src/styles/sections.css`

- [ ] **Step 1: Remplacer le placeholder Infos dans `index.html`**

```html
    <section class="section section--infos" id="infos">
      <div class="container container--medium">
        <p class="eyebrow" style="display:flex; justify-content:center; margin-bottom: 0.6rem;">Pour s'organiser</p>
        <h2 class="section-title">Infos pratiques</h2>

        <div class="map">
          <iframe
            title="Carte de Boulogne-sur-Mer"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20165.78772922765!2d1.5947321043180665!3d50.72507850554063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ddebda644cb3c5%3A0x40af13e81645e70!2s62200%20Boulogne-sur-Mer!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
            width="100%" height="380"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>

        <div class="info-grid">
          <article>
            <h3>Accès</h3>
            <ul>
              <li><strong>Train :</strong> Paris-Nord → Boulogne-Ville en ~2h30 (TGV inOui ou TER).</li>
              <li><strong>Voiture :</strong> A16, sortie 32 (Boulogne centre).</li>
              <li><strong>Parking :</strong> stationnement gratuit aux abords de l'église (à confirmer).</li>
            </ul>
          </article>
          <article>
            <h3>Tenue</h3>
            <p>Tenue chic, **touche de rouge bordeaux ou vert sapin** bienvenue. L'église n'est pas chauffée — prévoir un manteau élégant.</p>
            <p class="info-note">— TBD T11 : à valider —</p>
          </article>
          <article>
            <h3>Météo</h3>
            <p>5 décembre à Boulogne : entre 3 et 8°C en journée, possibles averses. Prévoyez chaussures confortables et tenue chaude pour les déplacements.</p>
          </article>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Ajouter les styles dans `src/styles/sections.css`**

Append:

```css
/* ===== Infos pratiques ===== */
.map {
  margin: 0 0 var(--space-lg);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--ligne);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
}

.info-grid article {
  text-align: left;
}

.info-grid h3 {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: var(--bordeaux);
}

.info-grid p, .info-grid li {
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 0.6rem;
}

.info-grid ul {
  padding: 0;
  list-style: none;
}

.info-note {
  font-size: 0.65rem !important;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--dore);
  opacity: 1 !important;
}
```

- [ ] **Step 3: Vérifier visuellement**

Run: `npm run dev`
- Carte Google Maps centrée sur Boulogne-sur-Mer affichée correctement.
- Trois colonnes "Accès / Tenue / Météo" sous la carte.
- Mobile : empile en 1 colonne.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Task 8: infos pratiques section with map, access, dress code, weather"
```

---

## Task 9 — Section RSVP — markup et styles (front uniquement)

**Files:**
- Modify: `index.html`, `src/styles/sections.css`

- [ ] **Step 1: Remplacer le placeholder RSVP dans `index.html`**

```html
    <section class="section section--rsvp" id="rsvp">
      <div class="container container--narrow">
        <p class="eyebrow eyebrow--light" style="display:flex; justify-content:center; margin-bottom: 0.6rem;">Confirmez votre venue</p>
        <h2 class="section-title section-title--light">RSVP</h2>
        <p class="lead lead--light">
          Merci de répondre <strong>avant le 15 octobre 2026</strong>.
          <!-- TBD T9 : confirmer la date limite -->
        </p>

        <form class="rsvp-form" id="rsvp-form" novalidate>
          <div class="field">
            <label for="rsvp-name">Nom complet</label>
            <input type="text" id="rsvp-name" name="name" required autocomplete="name" />
          </div>

          <div class="field">
            <label for="rsvp-email">Email</label>
            <input type="email" id="rsvp-email" name="email" required autocomplete="email" />
          </div>

          <div class="field">
            <label for="rsvp-phone">Téléphone (optionnel)</label>
            <input type="tel" id="rsvp-phone" name="phone" autocomplete="tel" />
          </div>

          <div class="field">
            <label for="rsvp-attendance">Présence</label>
            <select id="rsvp-attendance" name="attendance" required>
              <option value="" disabled selected>Choisissez une réponse</option>
              <option value="oui">Oui, avec plaisir</option>
              <option value="non">Non, je ne pourrai pas</option>
            </select>
          </div>

          <div class="field" data-show-when="attendance:oui">
            <label for="rsvp-guests">Nombre d'accompagnant·es (vous compris·e)</label>
            <input type="number" id="rsvp-guests" name="guests" min="1" max="6" />
          </div>

          <div class="field" data-show-when="attendance:oui">
            <label for="rsvp-guest-names">Prénoms des accompagnant·es</label>
            <input type="text" id="rsvp-guest-names" name="guestNames" placeholder="Marie, Paul…" />
          </div>

          <div class="field" data-show-when="attendance:oui">
            <label for="rsvp-diet">Allergies / régimes</label>
            <textarea id="rsvp-diet" name="diet" rows="2"></textarea>
          </div>

          <div class="field">
            <label for="rsvp-message">Un petit mot ?</label>
            <textarea id="rsvp-message" name="message" rows="3"></textarea>
          </div>

          <!-- Honeypot anti-bot, caché par CSS -->
          <div class="honeypot" aria-hidden="true">
            <label for="rsvp-website">Ne pas remplir</label>
            <input type="text" id="rsvp-website" name="website" tabindex="-1" autocomplete="off" />
          </div>

          <button type="submit" class="btn-primary" id="rsvp-submit">Envoyer ma réponse</button>

          <p class="rsvp-status" id="rsvp-status" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>
```

- [ ] **Step 2: Ajouter les styles RSVP dans `src/styles/sections.css`**

Append:

```css
/* ===== RSVP (fond sombre) ===== */
.section--rsvp {
  background: var(--sapin);
  color: var(--creme);
  border-top: none;
}

.eyebrow--light {
  color: var(--dore) !important;
}
.eyebrow--light::before {
  background: var(--dore) !important;
}

.section-title--light {
  color: var(--creme);
}

.lead--light {
  color: var(--creme);
  opacity: 0.85;
}

.rsvp-form {
  display: grid;
  gap: 1.4rem;
  max-width: 520px;
  margin: 0 auto;
}

.field {
  display: grid;
  gap: 0.4rem;
}

.field[data-show-when]:not(.is-visible) {
  display: none;
}

.field label {
  font-size: 0.65rem;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--dore);
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  color: var(--creme);
  font: inherit;
  font-weight: 300;
  transition: border-color .25s, background .25s;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--dore);
  background: rgba(255, 255, 255, 0.1);
}

.field input.is-invalid,
.field select.is-invalid,
.field textarea.is-invalid {
  border-color: #c66;
}

.btn-primary {
  margin-top: 1rem;
  padding: 1.1rem 1.6rem;
  font-size: 0.7rem;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--sapin);
  background: var(--dore);
  border: 1px solid var(--dore);
  border-radius: 2px;
  cursor: pointer;
  transition: background .25s, color .25s;
}

.btn-primary:hover {
  background: var(--creme);
}

.btn-primary[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.rsvp-status {
  text-align: center;
  font-size: 0.85rem;
  min-height: 1.4em;
  margin: 0;
}

.rsvp-status.is-success { color: var(--dore); }
.rsvp-status.is-error   { color: #f99; }
```

- [ ] **Step 3: Vérifier visuellement**

Run: `npm run dev`
- Section sur fond vert sapin, formulaire avec champs sombres, bouton doré.
- Cliquer "Envoyer" → rien ne se passe (logique pas encore branchée — c'est attendu).
- Champs conditionnels (guests, names, diet) cachés par défaut.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Task 9: RSVP form markup and dark section styling"
```

---

## Task 10 — Module RSVP : validation (TDD)

**Files:**
- Create: `tests/rsvp.test.js`
- Modify: `src/scripts/rsvp.js`

- [ ] **Step 1: Écrire les tests dans `tests/rsvp.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { validateRsvp, isValidEmail } from '../src/scripts/rsvp.js';

describe('isValidEmail', () => {
  it.each([
    ['simple@example.com', true],
    ['with.dot@sub.example.fr', true],
    ['plus+tag@example.com', true],
    ['', false],
    ['no-at.example.com', false],
    ['no-domain@', false],
    ['@no-local.com', false],
    ['spaces in@email.com', false],
  ])('%s → %s', (input, expected) => {
    expect(isValidEmail(input)).toBe(expected);
  });
});

describe('validateRsvp', () => {
  const base = {
    name: 'Jean Dupont',
    email: 'jean@example.com',
    attendance: 'oui',
    guests: 1,
    guestNames: '',
    diet: '',
    message: '',
    phone: '',
    website: '',
  };

  it('accepts a valid "oui" RSVP', () => {
    const result = validateRsvp(base);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('accepts a valid "non" RSVP without guests', () => {
    const result = validateRsvp({ ...base, attendance: 'non', guests: undefined });
    expect(result.valid).toBe(true);
  });

  it('rejects empty name', () => {
    const result = validateRsvp({ ...base, name: '   ' });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('rejects invalid email', () => {
    const result = validateRsvp({ ...base, email: 'not-an-email' });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it('rejects missing attendance', () => {
    const result = validateRsvp({ ...base, attendance: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.attendance).toBeDefined();
  });

  it('rejects guests below 1 when attendance is oui', () => {
    const result = validateRsvp({ ...base, guests: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors.guests).toBeDefined();
  });

  it('rejects guests above 6', () => {
    const result = validateRsvp({ ...base, guests: 7 });
    expect(result.valid).toBe(false);
    expect(result.errors.guests).toBeDefined();
  });

  it('flags honeypot as invalid (silently)', () => {
    const result = validateRsvp({ ...base, website: 'http://spam.example' });
    expect(result.valid).toBe(false);
    expect(result.errors.honeypot).toBeDefined();
  });

  it('does not require guests when attendance is non', () => {
    const result = validateRsvp({ ...base, attendance: 'non', guests: undefined });
    expect(result.valid).toBe(true);
    expect(result.errors.guests).toBeUndefined();
  });
});
```

- [ ] **Step 2: Lancer les tests pour vérifier qu'ils échouent**

Run: `npm test`
Expected: les nouveaux tests échouent (`validateRsvp is not a function`).

- [ ] **Step 3: Implémenter la validation au début de `src/scripts/rsvp.js`**

Replace the empty file with:

```js
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_RE.test(value.trim());
}

export function validateRsvp(input) {
  const errors = {};

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: { form: 'invalid' } };
  }

  // Honeypot — n'importe quelle valeur non vide est suspecte
  if (input.website && String(input.website).trim() !== '') {
    errors.honeypot = 'spam';
  }

  if (typeof input.name !== 'string' || input.name.trim().length < 2) {
    errors.name = 'Nom requis (au moins 2 caractères).';
  }

  if (!isValidEmail(input.email)) {
    errors.email = 'Email invalide.';
  }

  if (input.attendance !== 'oui' && input.attendance !== 'non') {
    errors.attendance = 'Merci d\'indiquer votre présence.';
  }

  if (input.attendance === 'oui') {
    const guests = Number(input.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 6) {
      errors.guests = 'Nombre de personnes : 1 à 6.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test`
Expected: tous les tests passent (calendar 8 + rsvp 17 = 25 verts).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Task 10: RSVP validation logic with email regex and field checks (TDD)"
```

---

## Task 11 — Apps Script backend (déploiement manuel)

**Files:**
- Create: `apps-script/rsvp.gs`, `apps-script/README.md`

- [ ] **Step 1: Créer le code Apps Script dans `apps-script/rsvp.gs`**

```js
/**
 * RSVP endpoint — déployé en Web App, exécuté en tant que "Moi", accessible "Tout le monde".
 *
 * Configuration requise (Apps Script > Project Settings > Script Properties) :
 *   - SHEET_ID         : ID de la Google Sheet (dans l'URL entre /d/ et /edit)
 *   - SHEET_TAB        : nom de l'onglet où on append (ex: "RSVP")
 *   - RSVP_TOKEN       : token partagé attendu (doit matcher VITE_RSVP_TOKEN côté front)
 *   - NOTIF_EMAIL      : (optionnel) adresse pour notifier les mariés à chaque RSVP
 */

const SHEET_HEADERS = [
  'timestamp', 'name', 'email', 'phone', 'attendance',
  'guests', 'guestNames', 'diet', 'message', 'ipHash',
];

function getProps() {
  return PropertiesService.getScriptProperties();
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const props = getProps();
  const sheetId = props.getProperty('SHEET_ID');
  const tab = props.getProperty('SHEET_TAB') || 'RSVP';
  if (!sheetId) {
    throw new Error('SHEET_ID is not set in Script Properties.');
  }
  const ss = SpreadsheetApp.openById(sheetId);
  let sheet = ss.getSheetByName(tab);
  if (!sheet) {
    sheet = ss.insertSheet(tab);
    sheet.appendRow(SHEET_HEADERS);
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function isDuplicateRecent(sheet, email, withinMinutes) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  const cutoff = new Date(Date.now() - withinMinutes * 60 * 1000);
  const range = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  return range.some(row => {
    const rowDate = row[0] instanceof Date ? row[0] : new Date(row[0]);
    return row[2] === email && rowDate > cutoff;
  });
}

function hashIp(ip) {
  if (!ip) return '';
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, ip);
  return bytes.map(b => (b & 0xff).toString(16).padStart(2, '0')).join('').slice(0, 12);
}

function doPost(e) {
  try {
    const props = getProps();
    const expectedToken = props.getProperty('RSVP_TOKEN');
    const notifEmail = props.getProperty('NOTIF_EMAIL');

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (_) {
      return jsonResponse({ ok: false, error: 'invalid_json' });
    }

    if (!expectedToken || data.token !== expectedToken) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    // Honeypot — accept silencieusement, ne rien stocker
    if (data.website && String(data.website).trim() !== '') {
      return jsonResponse({ ok: true });
    }

    const sheet = getSheet();

    if (isDuplicateRecent(sheet, data.email, 60)) {
      return jsonResponse({ ok: false, error: 'duplicate_recent' });
    }

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.attendance || '',
      data.guests || '',
      data.guestNames || '',
      data.diet || '',
      data.message || '',
      hashIp(e.parameter && e.parameter.userIp),
    ]);

    if (notifEmail) {
      const subject = `RSVP: ${data.name || 'anonyme'} — ${data.attendance || ''}`;
      const body = [
        `Nom    : ${data.name || ''}`,
        `Email  : ${data.email || ''}`,
        `Tel    : ${data.phone || ''}`,
        `Présence : ${data.attendance || ''}`,
        `Personnes : ${data.guests || ''}`,
        `Accomp.   : ${data.guestNames || ''}`,
        `Régime    : ${data.diet || ''}`,
        '',
        'Message  :',
        data.message || '(aucun)',
      ].join('\n');
      MailApp.sendEmail(notifEmail, subject, body);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonResponse({ ok: false, error: 'server_error', detail: String(err) });
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: 'rsvp', usage: 'POST application/json' });
}
```

- [ ] **Step 2: Créer `apps-script/README.md` (guide de déploiement manuel)**

```markdown
# Apps Script — RSVP backend

Ce code reçoit les RSVP du site et les écrit dans une Google Sheet.
Le déploiement est **manuel** (l'API Apps Script ne s'automatise pas trivialement).

## 1. Préparer la Google Sheet

1. Créer une Google Sheet vide nommée "Mariage RSVP".
2. Récupérer son ID (dans l'URL : `https://docs.google.com/spreadsheets/d/<ID>/edit`).

## 2. Créer le projet Apps Script

1. Aller sur https://script.google.com → "Nouveau projet".
2. Nommer le projet "Mariage RSVP API".
3. Coller l'intégralité de `rsvp.gs` dans `Code.gs`. Sauvegarder.

## 3. Définir les Script Properties

Dans Apps Script → Project Settings → Script Properties → Add property :

| Clé | Valeur |
|---|---|
| `SHEET_ID` | ID de la Sheet (étape 1) |
| `SHEET_TAB` | `RSVP` |
| `RSVP_TOKEN` | Token aléatoire (ex: générer avec `openssl rand -hex 16`) — doit matcher `VITE_RSVP_TOKEN` |
| `NOTIF_EMAIL` | Adresse email à notifier (ou laisser vide pour désactiver) |

## 4. Déployer en Web App

1. Apps Script → Deploy → New deployment → Type: "Web app".
2. Description : "v1".
3. Execute as : **Me**.
4. Who has access : **Anyone**.
5. Deploy. Autoriser les accès demandés (Sheet + Mail).
6. **Copier l'URL de déploiement** (forme : `https://script.google.com/macros/s/.../exec`) — elle servira pour `VITE_RSVP_URL`.

## 5. Tester

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"token":"<TOKEN>","name":"Test","email":"test@example.com","attendance":"oui","guests":1}' \
  '<URL>'
```

Devrait retourner `{"ok":true}` et créer une ligne dans la Sheet.

## 6. Si vous modifiez le code plus tard

Apps Script → Deploy → Manage deployments → ✏️ → New version → Deploy.
**L'URL ne change pas** entre les versions d'un même déploiement.
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Task 11: Apps Script RSVP backend with deployment guide"
```

---

## Task 12 — Câbler le formulaire RSVP au backend

**Files:**
- Modify: `src/scripts/rsvp.js`
- Create: `.env.example`

- [ ] **Step 1: Créer `.env.example` à la racine**

```
# Config RSVP — copier en `.env.local` et remplir
# (`.env.local` est gitignored)
VITE_RSVP_URL=https://script.google.com/macros/s/REPLACE_ME/exec
VITE_RSVP_TOKEN=REPLACE_ME_WITH_RANDOM_TOKEN
```

- [ ] **Step 2: Créer `.env.local` localement (NE PAS commiter)**

```bash
cp .env.example .env.local
# puis éditer .env.local avec les vraies valeurs après déploiement Apps Script (Task 11)
```

- [ ] **Step 3: Étendre `src/scripts/rsvp.js` avec le wiring DOM + fetch**

Append at the end of `src/scripts/rsvp.js`:

```js
// ----- Wiring DOM -----
const FORM_ID = 'rsvp-form';
const STATUS_ID = 'rsvp-status';
const SUBMIT_ID = 'rsvp-submit';
const ATTENDANCE_ID = 'rsvp-attendance';

const form = document.getElementById(FORM_ID);
const status = document.getElementById(STATUS_ID);
const submit = document.getElementById(SUBMIT_ID);
const attendance = document.getElementById(ATTENDANCE_ID);

const RSVP_URL = import.meta.env?.VITE_RSVP_URL;
const RSVP_TOKEN = import.meta.env?.VITE_RSVP_TOKEN;

function toggleConditionalFields() {
  if (!form) return;
  const value = attendance?.value || '';
  form.querySelectorAll('[data-show-when]').forEach(el => {
    const cond = el.dataset.showWhen;
    const [key, expected] = cond.split(':');
    const visible = key === 'attendance' && value === expected;
    el.classList.toggle('is-visible', visible);
  });
}

function readForm() {
  if (!form) return null;
  const fd = new FormData(form);
  const obj = Object.fromEntries(fd.entries());
  if (obj.guests) obj.guests = Number(obj.guests);
  return obj;
}

function setStatus(message, kind) {
  if (!status) return;
  status.textContent = message;
  status.className = 'rsvp-status' + (kind ? ` is-${kind}` : '');
}

function markInvalidFields(errors) {
  if (!form) return;
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  Object.keys(errors).forEach(field => {
    const el = form.elements[field];
    if (el && el.classList) el.classList.add('is-invalid');
  });
}

if (form) {
  attendance?.addEventListener('change', toggleConditionalFields);
  toggleConditionalFields();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('', null);

    const data = readForm();
    const { valid, errors } = validateRsvp(data);

    if (!valid) {
      // Honeypot rempli → faire semblant d'avoir réussi (pas d'indice au bot)
      if (errors.honeypot) {
        setStatus('Merci, votre réponse a bien été enregistrée.', 'success');
        form.reset();
        return;
      }
      markInvalidFields(errors);
      const firstError = Object.values(errors)[0];
      setStatus(firstError || 'Merci de vérifier le formulaire.', 'error');
      return;
    }

    if (!RSVP_URL || !RSVP_TOKEN) {
      console.warn('RSVP : VITE_RSVP_URL ou VITE_RSVP_TOKEN manquant.');
      setStatus('Configuration manquante côté front. Merci de prévenir les mariés.', 'error');
      return;
    }

    if (submit) submit.disabled = true;
    setStatus('Envoi en cours…', null);

    try {
      const response = await fetch(RSVP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        // Apps Script GAS Web App reçoit du text/plain — Content-Type évite le preflight CORS
        body: JSON.stringify({ ...data, token: RSVP_TOKEN }),
      });

      const result = await response.json().catch(() => ({ ok: false, error: 'invalid_response' }));

      if (result.ok) {
        setStatus('Merci, votre réponse a bien été reçue 🤍', 'success');
        form.reset();
        toggleConditionalFields();
      } else if (result.error === 'duplicate_recent') {
        setStatus('Cette adresse a déjà répondu il y a moins d\'une heure.', 'error');
      } else {
        setStatus('Une erreur est survenue. Merci de réessayer ou de prévenir les mariés.', 'error');
      }
    } catch (err) {
      console.error(err);
      setStatus('Réseau indisponible. Réessayez dans un instant ?', 'error');
    } finally {
      if (submit) submit.disabled = false;
    }
  });
}
```

- [ ] **Step 4: Vérifier les tests**

Run: `npm test`
Expected: tests RSVP toujours verts (la validation est inchangée).

- [ ] **Step 5: Tester manuellement (avec ou sans backend déployé)**

Run: `npm run dev`
- Cas 1 : remplir formulaire valide sans `.env.local` → message "Configuration manquante" (attendu).
- Cas 2 : remplir avec email invalide → champ surligné rouge, message d'erreur.
- Cas 3 : champs conditionnels (guests, names, diet) apparaissent quand on choisit "Oui".
- Cas 4 : avec `.env.local` rempli + Apps Script déployé → soumission réussie, ligne dans la Sheet.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Task 12: wire RSVP form to Apps Script backend with env vars"
```

---

## Task 13 — Sections Liste de mariage et FAQ

**Files:**
- Modify: `index.html`, `src/styles/sections.css`

- [ ] **Step 1: Remplacer le placeholder Liste de mariage dans `index.html`**

```html
    <section class="section section--liste" id="liste">
      <div class="container container--narrow" style="text-align:center;">
        <p class="eyebrow" style="display:flex; justify-content:center; margin-bottom: 0.6rem;">Et si vous le souhaitez</p>
        <h2 class="section-title">Notre liste</h2>

        <p class="lead">
          Votre présence est notre plus beau cadeau. Mais si vous souhaitez participer à notre voyage de noces,
          nous avons mis en place une cagnotte commune.
        </p>

        <a class="btn-ghost" href="#" id="liste-link" target="_blank" rel="noopener noreferrer">
          <!-- TBD T7 : remplacer href par l'URL de la liste/cagnotte -->
          Découvrir la cagnotte
        </a>
      </div>
    </section>
```

- [ ] **Step 2: Remplacer le placeholder FAQ dans `index.html`**

```html
    <section class="section section--faq" id="faq">
      <div class="container container--narrow">
        <p class="eyebrow" style="display:flex; justify-content:center; margin-bottom: 0.6rem;">Questions fréquentes</p>
        <h2 class="section-title">FAQ</h2>

        <div class="faq">
          <details class="faq__item">
            <summary>Les enfants sont-ils les bienvenus ?</summary>
            <p>Oui, les enfants sont les bienvenus à tous les moments de la journée. <!-- TBD T12 --></p>
          </details>
          <details class="faq__item">
            <summary>Quel est le dress code ?</summary>
            <p>Tenue chic, touche de rouge bordeaux ou vert sapin bienvenue. L'église n'est pas chauffée — prévoir un manteau élégant.</p>
          </details>
          <details class="faq__item">
            <summary>Que faire si je ne peux finalement pas venir ?</summary>
            <p>Merci de nous prévenir le plus tôt possible (idéalement avant le 1er novembre 2026) afin que nous puissions ajuster les places et les repas.</p>
          </details>
          <details class="faq__item">
            <summary>Y a-t-il un parking ?</summary>
            <p>Oui, du stationnement gratuit est disponible aux abords de l'église et du lieu de réception.</p>
          </details>
          <details class="faq__item">
            <summary>À quelle heure se termine la soirée ?</summary>
            <p>La soirée prendra fin vers 2h du matin. Vous restez libres de partir à votre rythme.</p>
          </details>
          <details class="faq__item">
            <summary>Plan B en cas de météo extrême ?</summary>
            <p>Tous les lieux choisis sont en intérieur ; la météo ne devrait pas bouleverser le programme. Nous préviendrons par email en cas d'imprévu majeur.</p>
          </details>
          <details class="faq__item">
            <summary>Comment offrir un cadeau ?</summary>
            <p>Voir la section "Notre liste" plus haut sur la page.</p>
          </details>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Ajouter les styles dans `src/styles/sections.css`**

Append:

```css
/* ===== Liste / FAQ ===== */
.section--liste { padding-bottom: var(--section-py-desktop); }

.faq {
  display: grid;
  gap: 0;
  max-width: 720px;
  margin: 0 auto;
}

.faq__item {
  border-bottom: 1px solid var(--ligne);
  padding: 1.4rem 0;
}

.faq__item:first-child { border-top: 1px solid var(--ligne); }

.faq__item > summary {
  list-style: none;
  cursor: pointer;
  font-family: var(--font-serif);
  font-size: 1.15rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-right: 0.4rem;
  transition: color .25s;
}

.faq__item > summary::-webkit-details-marker { display: none; }

.faq__item > summary::after {
  content: '+';
  font-family: var(--font-sans);
  font-size: 1.4rem;
  font-weight: 300;
  color: var(--bordeaux);
  transition: transform .25s;
}

.faq__item[open] > summary::after {
  transform: rotate(45deg);
}

.faq__item[open] > summary {
  color: var(--bordeaux);
}

.faq__item p {
  margin: 0.8rem 0 0;
  font-size: 0.9rem;
  color: var(--crayon);
  opacity: 0.8;
}

@media (max-width: 768px) {
  .faq__item > summary { font-size: 1rem; }
}
```

- [ ] **Step 4: Vérifier visuellement**

Run: `npm run dev`
- Liste de mariage : section centrée, paragraphe + bouton "Découvrir la cagnotte".
- FAQ : 7 entrées, accordéon HTML natif. Cliquer ouvre/ferme avec rotation de + en x.
- Aucun JS pour la FAQ — vérifier en désactivant JavaScript dans DevTools.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Task 13: liste de mariage and FAQ sections (native details accordion)"
```

---

## Task 14 — SEO meta, Open Graph, favicon

**Files:**
- Modify: `index.html`
- Create: `public/favicon.svg`, `public/og-cover.svg` (placeholder), `public/og-cover.jpg` (à générer/remplacer)

- [ ] **Step 1: Créer `public/favicon.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#FBF8F2"/>
  <text x="32" y="44" text-anchor="middle"
        font-family="Cormorant Garamond, Georgia, serif"
        font-style="italic" font-size="38" fill="#6F1712">L&amp;A</text>
  <circle cx="50" cy="14" r="3" fill="#B8923B"/>
</svg>
```

- [ ] **Step 2: Créer un placeholder Open Graph dans `public/og-cover.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FBF8F2"/>
  <line x1="600" y1="100" x2="600" y2="530" stroke="#E5DFD3" stroke-width="2"/>
  <text x="540" y="280" text-anchor="end" font-family="Cormorant Garamond, Georgia, serif"
        font-style="italic" font-size="120" fill="#2A1F18">Lisbeth</text>
  <text x="540" y="410" text-anchor="end" font-family="Cormorant Garamond, Georgia, serif"
        font-style="italic" font-size="80" fill="#6F1712">&amp;</text>
  <text x="540" y="540" text-anchor="end" font-family="Cormorant Garamond, Georgia, serif"
        font-style="italic" font-size="120" fill="#2A1F18">Aurélien</text>

  <text x="660" y="240" font-family="Inter, Arial, sans-serif"
        font-size="20" letter-spacing="6" fill="#6F1712">SAVE THE DATE</text>
  <text x="660" y="320" font-family="Cormorant Garamond, Georgia, serif"
        font-style="italic" font-size="56" fill="#2A1F18">5 décembre 2026</text>
  <text x="660" y="380" font-family="Cormorant Garamond, Georgia, serif"
        font-size="36" fill="#2A1F18">Boulogne-sur-Mer</text>
  <circle cx="600" cy="315" r="6" fill="#B8923B"/>
</svg>
```

> **Note** : Open Graph attend un PNG/JPG. Convertir le SVG en JPG 1200×630 (via Figma, Inkscape, ou `rsvg-convert`) et l'enregistrer comme `public/og-cover.jpg`. Le fichier `public/og-cover.svg` reste comme source pour future itération.

Pour générer le JPG depuis le SVG (si rsvg-convert disponible) :

```bash
rsvg-convert -w 1200 -h 630 -f png public/og-cover.svg | convert - public/og-cover.jpg
```

Si pas d'outil dispo, ouvrir le SVG dans Figma/Inkscape, exporter en JPG 1200×630.

- [ ] **Step 3: Mettre à jour le `<head>` de `index.html`**

Replace the existing `<head>` content with:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>Lisbeth & Aurélien — 5 décembre 2026</title>
  <meta name="description" content="Site du mariage de Lisbeth & Aurélien, samedi 5 décembre 2026 à Boulogne-sur-Mer. Programme, RSVP, hébergements et infos pratiques." />
  <meta name="theme-color" content="#FBF8F2" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Lisbeth & Aurélien — Mariage le 5 décembre 2026" />
  <meta property="og:description" content="Samedi 5 décembre 2026 à Boulogne-sur-Mer. Toutes les infos et le RSVP en un endroit." />
  <meta property="og:image" content="/og-cover.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="fr_FR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />

  <!-- Polices -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400;1,500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/src/styles/tokens.css" />
  <link rel="stylesheet" href="/src/styles/base.css" />
  <link rel="stylesheet" href="/src/styles/sections.css" />
  <script type="module" src="/src/main.js"></script>
</head>
```

- [ ] **Step 4: Vérifier le build**

Run: `npm run build`
Expected: `dist/favicon.svg` et `dist/og-cover.jpg` présents (Vite copie tout `public/` à la racine de `dist/`).

- [ ] **Step 5: Tester l'aperçu Open Graph**

Run: `npm run preview`
Open: `http://localhost:4173/og-cover.jpg` → l'image apparaît.

Une fois déployé, tester sur https://www.opengraph.xyz/ ou via WhatsApp/iMessage.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Task 14: SEO meta tags, Open Graph image, favicon SVG"
```

---

## Task 15 — Déploiement GitHub Pages via Actions

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Créer le workflow `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - run: npm test

      - run: npm run build
        env:
          VITE_RSVP_URL: ${{ secrets.VITE_RSVP_URL }}
          VITE_RSVP_TOKEN: ${{ secrets.VITE_RSVP_TOKEN }}

      - uses: actions/configure-pages@v4

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Documenter la configuration des secrets dans `README.md`**

(Le README sera créé/mis à jour à la Task 16. Pour l'instant, juste créer un commit du workflow.)

- [ ] **Step 3: Vérifier la syntaxe YAML**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))"`
Expected: aucune erreur.

(Si python3-yaml n'est pas dispo, `npx yaml-lint .github/workflows/deploy.yml` ou simplement vérifier visuellement.)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Task 15: GitHub Action to build and deploy on Pages"
```

> **Configuration manuelle GitHub** (à faire une fois) :
>
> 1. GitHub repo → Settings → Pages → Source : "GitHub Actions".
> 2. Settings → Secrets and variables → Actions → "New repository secret" :
>    - `VITE_RSVP_URL` (URL Apps Script de la Task 11)
>    - `VITE_RSVP_TOKEN` (même token que dans Apps Script)
> 3. Push de cette branche déclenche automatiquement le déploiement.

---

## Task 16 — README et documentation finale

**Files:**
- Create/replace: `README.md`

- [ ] **Step 1: Écrire le README**

Replace the entire content of `README.md`:

```markdown
# Lisbeth & Aurélien — Site du mariage

Site web statique pour notre mariage du **samedi 5 décembre 2026** à Boulogne-sur-Mer.

> Page unique HTML/CSS/JS · build Vite · hébergé sur GitHub Pages · RSVP via Google Apps Script + Sheets.

## Quick start

```bash
npm install
cp .env.example .env.local   # remplir VITE_RSVP_URL et VITE_RSVP_TOKEN
npm run dev                  # http://localhost:5173
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Dev server avec hot-reload |
| `npm run build` | Build production → `dist/` |
| `npm run preview` | Servir le build |
| `npm test` | Tests unitaires Vitest (calendar + rsvp) |
| `npm run test:watch` | Tests en mode watch |

## Architecture

- `index.html` : page unique, 7 sections.
- `src/styles/` : `tokens.css` (variables), `base.css` (reset + typo + utilitaires), `sections.css` (par section).
- `src/scripts/` : `nav.js` (sticky + mobile menu), `calendar.js` (export .ics), `rsvp.js` (validation + fetch).
- `apps-script/rsvp.gs` : code backend RSVP, **déployé manuellement** (cf. `apps-script/README.md`).
- `.github/workflows/deploy.yml` : build + déploiement automatique sur GitHub Pages.

## Configuration RSVP (à faire une fois)

1. Suivre `apps-script/README.md` pour déployer le backend.
2. Côté GitHub repo :
   - Settings → Pages → Source : GitHub Actions.
   - Settings → Secrets → Actions :
     - `VITE_RSVP_URL` = URL Apps Script.
     - `VITE_RSVP_TOKEN` = token partagé.
3. Localement, créer `.env.local` avec les mêmes valeurs.

## Direction visuelle

"Éditorial épuré". Spec complète : [`docs/superpowers/specs/2026-05-01-site-mariage-noel-design.md`](./docs/superpowers/specs/2026-05-01-site-mariage-noel-design.md).

## Historique

L'état antérieur (version Noël plus chargée + scaffold Provence + WIP) est préservé dans la branche `archive/pre-redesign-snapshot`, accessible via le worktree `../lisbeth-et-aurelien-archive`.
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "Task 16: README with setup, scripts, architecture, RSVP config"
```

---

## Task 17 — Polish responsive + audit Lighthouse

**Files:**
- Modify: divers (selon les défauts identifiés)

Pas de TDD pour cette tâche — c'est de l'audit visuel + perf.

- [ ] **Step 1: Tester sur 4 viewports**

Ouvrir `npm run dev` puis dans DevTools, tester :

| Viewport | Largeur | À vérifier |
|---|---|---|
| Mobile S | 320px | Pas de débordement horizontal, lisibilité |
| Mobile L | 414px | Hero, timeline, formulaire RSVP |
| Tablet | 768px | Transition entre versions mobile/desktop |
| Desktop | 1440px | Mise en page éditoriale du hero, grille hôtels |

Lister les défauts dans un fichier temporaire `.responsive-issues.txt` (gitignored), puis les corriger un par un. Tous les fixes vont dans `src/styles/sections.css` ou `src/styles/base.css`.

- [ ] **Step 2: Build production et lancer un audit Lighthouse**

```bash
npm run build
npx serve dist -l 4321 &
SERVER_PID=$!
sleep 2
npx -y lighthouse http://localhost:4321 --quiet --chrome-flags="--headless" --output=json --output-path=./lighthouse-report.json --only-categories=performance,accessibility,best-practices,seo
kill $SERVER_PID
node -e "const r=require('./lighthouse-report.json'); console.log(Object.entries(r.categories).map(([k,v])=>k+': '+Math.round(v.score*100)).join(' · '));"
```

Expected: `performance: 95+ · accessibility: 95+ · best-practices: 95+ · seo: 95+`.

(Si `npx lighthouse` indisponible : utiliser Chrome DevTools → Lighthouse onglet à la main.)

- [ ] **Step 3: Corriger les issues critiques**

Issues fréquentes à corriger :
- **Image hero sans dimensions** → ajouter `width`/`height` explicites quand l'image est ajoutée (T4).
- **Couleur de lien insuffisante en contraste** → vérifier les pairs `--bordeaux` sur `--creme` (ratio doit être >4.5).
- **`<iframe>` sans `title`** → déjà ajouté Task 8, vérifier.
- **`<button>` sans label** → vérifier le burger nav (`aria-label` déjà présent).

Pour chaque correction, edit le fichier concerné (`base.css` ou `sections.css`).

- [ ] **Step 4: Re-builder et re-tester**

```bash
npm run build
# repasser Lighthouse pour vérifier les scores
```

- [ ] **Step 5: Supprimer les fichiers temporaires**

```bash
rm -f lighthouse-report.json .responsive-issues.txt
```

- [ ] **Step 6: Commit final**

```bash
git add -A
git commit -m "Task 17: responsive polish and Lighthouse 95+ on all categories"
```

---

## Self-review notes (ne pas exécuter — juste informatif pour l'engineer)

- **Couverture du spec** : les 7 sections + RSVP backend + déploiement + tests sont tous couverts (Tasks 4, 6, 7, 8, 9–12, 13, 11, 15, 5+10).
- **TDD** : appliqué aux deux modules testables (calendar.js Task 5, rsvp.js Task 10). HTML/CSS vérifiés visuellement.
- **TBD** : T1, T2, T3 (lieux), T4 (photo), T5 (citation), T6 (hôtels — défaut posé), T7 (URL liste), T8 (CNAME), T9 (date limite — défaut 15 oct 2026), T10 (email notif — Script Property), T11 (dress code — défaut posé), T12 (FAQ — défauts posés). Tous documentés en commentaires HTML `<!-- TBD -->`.
- **Risque** : la photo de couple (T4) n'est pas indispensable — le hero fonctionne sans, juste sur typographie + étoile.
- **Pas de placeholder dans le plan** : toutes les étapes ont du code complet.

---

## Suite

Une fois ce plan complété :

1. Toutes les tâches doivent être committées sur `main`.
2. Le déploiement Apps Script (Task 11) doit être fait manuellement.
3. Les secrets GitHub (Task 15) doivent être configurés.
4. Le premier push de `main` déclenche le déploiement.
5. Tester l'URL de production avec un RSVP test.
6. Communiquer l'URL aux invités.

L'archive antérieure reste disponible dans le worktree `../lisbeth-et-aurelien-archive`.
