# Aurélien & Lisbeth — Site du mariage

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
