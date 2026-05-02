# Site de mariage Aurélien & Lisbeth — Design

**Date** : 2026-05-01
**Auteur** : Aurélien Heux (avec assistance Claude)
**Statut** : Validé brainstorming, en attente revue avant plan d'implémentation
**Branche de référence des archives** : `archive/pre-redesign-snapshot` (worktree à `../aurelien-lisbeth-archive`)

---

## 1. Objectif

Construire un site web statique pour le mariage de **Aurélien & Lisbeth**, célébré le **samedi 5 décembre 2026** à **Boulogne-sur-Mer** (62), sur une thématique **Noël élégant** (palette bordeaux / vert sapin / doré), permettant aux invités de :

1. Consulter le programme et les informations pratiques.
2. Trouver des suggestions d'hébergement.
3. Confirmer leur présence via un formulaire RSVP relié à une feuille Google Sheet.
4. Accéder à la liste de mariage / cagnotte.
5. Trouver les réponses aux questions fréquentes.

Le site est une **page unique à scroll vertical**, pensée mobile-first, hébergée gratuitement sur GitHub Pages.

## 2. Contraintes & non-objectifs

**Contraintes :**

- Coût d'hébergement et de backend : 0 €.
- Aucun compte / login pour les invités.
- Le formulaire RSVP doit aboutir dans une Google Sheet appartenant aux mariés.
- Site en français uniquement.
- Performant sur connexion mobile médiocre (Lighthouse > 95).

**Non-objectifs (volontairement exclus) :**

- Pas de section "Notre histoire" narrative (retirée du périmètre).
- Pas de galerie photo (avant ni après mariage) dans la v1.
- Pas de multilingue.
- Pas de comptes invités, pas de listes nominatives par invité.
- Pas de live (cérémonie en streaming, etc.).

## 3. Périmètre fonctionnel — sections du site

| # | Section | Rôle |
|---|---|---|
| 1 | **Hero / Accueil** | Annonce visuelle : prénoms, date, lieu, citation. |
| 2 | **Programme du jour J** | Timeline 14h / 17h / 19h, lieu sous chaque ligne, bouton "Ajouter à mon agenda". |
| 3 | **Hébergements** | Grille de 2 à 4 hôtels recommandés à proximité, mention Airbnb. |
| 4 | **Infos pratiques** | Carte Google Maps, accès (train, voiture, parking), dress code, météo. |
| 5 | **RSVP** | Formulaire confirmant la présence, envoyé à une Google Sheet. |
| 6 | **Liste de mariage** | Bloc court avec lien externe vers la cagnotte/liste. |
| 7 | **FAQ** | Accordéon de 5 à 7 questions / réponses fréquentes. |

L'ordre dans le scroll suit cette numérotation. La navigation top contient des ancres vers chaque section.

## 4. Direction visuelle — "éditorial épuré"

### 4.1 Identité

Inspiration **magazine de mode haut-de-gamme** : beaucoup d'espace blanc, typographie sérif italique pour les prénoms et titres, sans-serif fin et tracking large pour les labels. La thématique de Noël est **suggérée** (palette, étoile dorée, mention "noces de Noël") plutôt qu'**affirmée** (pas de neige animée, pas de décor de sapin chargé).

### 4.2 Tokens couleur

```css
:root {
  --creme:    #FBF8F2; /* fond principal */
  --crayon:   #2A1F18; /* texte principal */
  --bordeaux: #6F1712; /* accent 1 (eyebrow, esperluette, hover) */
  --sapin:    #123827; /* accent 2 (section RSVP au fond sombre, footer minimal) */
  --dore:     #B8923B; /* ponctuation rare (étoile, place) */
  --ligne:    #E5DFD3; /* séparateurs, bordures fines */
}
```

Le **doré n'est utilisé qu'en ponctuation** (jamais en bloc), pour éviter l'effet "carte de vœux".

### 4.3 Typographie

| Usage | Police | Style |
|---|---|---|
| Prénoms, titres, heures, citations | **Cormorant Garamond** | italique 400 |
| Labels, navigation, dates | **Inter** | 300/500, uppercase, tracking 2-4px |
| Corps de texte | **Inter** | 300/400, line-height 1.6 |

Les deux familles sont chargées via Google Fonts avec `preconnect` pour optimiser le LCP.

### 4.4 Mise en page

- **Hero** : grille deux colonnes séparées par une ligne fine verticale ; prénoms à gauche aligné droite, méta (date / lieu / heure) à droite aligné gauche, point doré central. En mobile : stack vertical centré.
- **Sections** : padding vertical 6-7rem, séparateurs `border-top` 1px en `--ligne`.
- **Eyebrow** systématique (petit label uppercase bordeaux) avant chaque titre de section.
- **Titres de section** : sérif italique, ~3rem desktop, centrés.

### 4.5 Iconographie & ornement

- **Aucun emoji** dans le rendu final.
- Une seule étoile dorée (point ou SVG simple) utilisée comme **détail décoratif unique** au centre du hero. Aucune autre ornementation décorative ailleurs dans la page.
- Pas de flocon, pas de branche de sapin, pas de boules de Noël.

## 5. Architecture du projet

```
aurelien-lisbeth/
├── index.html                       # Page unique
├── public/
│   ├── CNAME                        # (si domaine custom)
│   ├── og-cover.jpg                 # Open Graph 1200x630
│   └── favicon.svg
├── src/
│   ├── styles/
│   │   ├── tokens.css               # Variables CSS (couleurs, typo, espacements)
│   │   ├── base.css                 # Reset, typo de base, layout primitifs
│   │   └── sections.css             # Styles spécifiques par section
│   ├── scripts/
│   │   ├── main.js                  # Bootstrap, smooth scroll, sticky nav
│   │   ├── rsvp.js                  # Validation + fetch Apps Script
│   │   └── calendar.js              # Génération .ics téléchargeable
│   │   # FAQ : élément <details> natif HTML, pas de JS dédié.
│   └── assets/
│       └── hero.{webp,jpg}          # Photo de couple ou illustration sobre
├── apps-script/
│   └── rsvp.gs                      # Code Apps Script versionné (déploiement manuel)
├── .github/
│   └── workflows/
│       └── deploy.yml               # Build Vite + publish sur GitHub Pages
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-01-site-mariage-noel-design.md   # ce fichier
├── package.json                     # Vite déjà présent
├── vite.config.js                   # Config minimale (base path, build output)
├── .gitignore
└── README.md                        # Instructions setup + déploiement RSVP
```

### Pourquoi cette structure

- `tokens.css` séparé pour pouvoir ajuster un seul fichier quand on change un détail visuel.
- `apps-script/rsvp.gs` versionné dans le repo malgré son déploiement manuel via l'interface Apps Script — l'historique est traçable.
- Pas de framework JS : 3 scripts vanilla bien isolés (rsvp, faq, calendar) suffisent.

## 6. Détail des sections

### 6.1 Hero

- Eyebrow `Save the date` en bordeaux, tracking 4px.
- Prénoms en sérif italique, taille `clamp(3.5rem, 7vw, 6.5rem)`, esperluette bordeaux entre les deux.
- Citation italique courte sous les prénoms (TBD T5).
- Bloc droit : trois lignes méta — Le jour, Le lieu, L'heure — chaque ligne avec un label uppercase bordeaux + valeur sérif (avec mots-clés en bordeaux italique).
- Étoile dorée discrète au centre de la grille comme point d'union visuel.

### 6.2 Programme

- Timeline en grille 2 colonnes : `heure | description`.
- Heures en sérif italique, taille 1.8rem, couleur bordeaux.
- Chaque entrée : titre sérif (1.4rem), description en corps (0.85rem, opacité 0.7), lieu en label uppercase doré.
- Bouton final **"Ajouter à mon agenda"** qui télécharge un fichier `.ics` généré côté client (`calendar.js`).

| Heure | Événement | Lieu (TBD) |
|---|---|---|
| 14h00 | Cérémonie religieuse | Église de Boulogne-sur-Mer (T1) |
| 17h00 | Vin d'honneur | TBD (T2) |
| 19h00 | Dîner de Noël | TBD (T3) |

### 6.3 Hébergements

- Grille auto-fit, minmax 260px.
- Chaque hôtel : nom (sérif), étoiles (texte unicode ★), description courte (1 ligne), bouton lien sortant souligné bordeaux.
- Note finale "Vous pouvez aussi consulter Airbnb" en italique.
- Liste par défaut (de l'archive, à valider — T6) :
  - Hôtel de la Matelote (4★, face à la mer)
  - Ibis Styles Centre Cathédrale (3★, vieille ville)
  - Opal'Inn (3★, face à la plage)

### 6.4 Infos pratiques

- Bloc carte : iframe Google Maps centrée Boulogne-sur-Mer, hauteur 350px, bordure crème + ombre légère.
- Trois sous-blocs en colonnes : **Accès**, **Tenue**, **Météo**.
  - Accès : train (gare Boulogne-Ville depuis Paris-Nord ~2h30), voiture (A16 sortie 32), parking.
  - Tenue : dress code (TBD T11). Suggestion : "tenue chic, touche de rouge bordeaux ou vert sapin bienvenue. L'église n'est pas chauffée — prévoir un manteau élégant."
  - Météo : "5 décembre à Boulogne — entre 3 et 8°C, prévoir une tenue chaude pour les déplacements."

### 6.5 RSVP

#### 6.5.1 Champs du formulaire

| Champ | Type | Requis | Notes |
|---|---|---|---|
| Nom complet | text | ✓ | |
| Email | email | ✓ | Pour confirmation |
| Téléphone | tel | – | Optionnel |
| Présence | select (Oui/Non) | ✓ | |
| Nombre d'accompagnant·es | number (0-5) | si Oui | |
| Prénoms des accompagnant·es | text | si > 0 | Champ texte libre |
| Allergies / régime | textarea (court) | – | |
| Message | textarea | – | |
| Honeypot `website` | text caché | – | Anti-spam : si rempli → silencieusement ignoré |

#### 6.5.2 Flux d'envoi

```
[Front rsvp.js]                       [Apps Script Web App]              [Google Sheet "RSVP"]
       │                                       │                                   │
       │  fetch POST application/json          │                                   │
       │ ───────────────────────────────────▶ │                                   │
       │  { fields..., token: "..." }          │                                   │
       │                                       │ 1. valide token                   │
       │                                       │ 2. vérifie honeypot vide          │
       │                                       │ 3. SpreadsheetApp.openById()      │
       │                                       │ 4. appendRow([...])               │
       │                                       │ ─────────────────────────────────▶│
       │                                       │ 5. (option) MailApp.sendEmail     │
       │                                       │                                   │
       │  ◀──────────────────────── { ok: true }                                   │
       │                                                                           │
   afficher message succès / shake si erreur
```

#### 6.5.3 Apps Script

- Web App déployée en exécution "Moi", accès "Tout le monde" (anonyme).
- URL Apps Script et token partagé injectés via variables d'environnement Vite (`import.meta.env.VITE_RSVP_URL`, `VITE_RSVP_TOKEN`). À noter : ces valeurs sont **inlinées dans le bundle JS public** — donc visibles par toute personne qui inspecte le site. Le token sert d'**obfuscation anti-bot** (un scraper aveugle ne le devinera pas), pas de sécurité cryptographique. Côté Apps Script, le token attendu est stocké dans `PropertiesService.getScriptProperties().getProperty('RSVP_TOKEN')`.
- Notifie par email les mariés à chaque RSVP (T10).
- Code committé dans `apps-script/rsvp.gs`.

#### 6.5.4 Sécurité

- **Token partagé** : obfuscation anti-bot (cf. 6.5.3 — ce n'est pas un secret cryptographique).
- **Honeypot** : champ `website` invisible — si rempli, on jette silencieusement.
- **Rate limit applicatif** : Apps Script vérifie qu'aucun email identique n'a déjà soumis dans la dernière heure (anti double-clic, anti spam basique).
- **Pas de reCAPTCHA** : friction excessive pour le volume attendu (~150 RSVP). Si spam constaté en production, ajouter reCAPTCHA en v2.

### 6.6 Liste de mariage

- Texte court (3-4 lignes) expliquant l'intention (cagnotte voyage de noces, par ex.).
- Bouton sortant unique vers la plateforme (TBD T7).

### 6.7 FAQ

- Composant accordéon : élément HTML natif `<details>`/`<summary>`, restylé en CSS pur (aucun JavaScript requis).
- 5-7 entrées proposées (T12 — réponses à valider) :
  1. Les enfants sont-ils les bienvenus ?
  2. Quel est le dress code ?
  3. Que faire si je ne peux pas venir ?
  4. Y a-t-il un parking ?
  5. À quelle heure se termine la soirée ?
  6. Plan B en cas de météo extrême ?
  7. Comment faire un cadeau ?

## 7. Build, hébergement, déploiement

- **Local** : `npm run dev` → Vite sur port 5173, hot-reload.
- **Build** : `npm run build` → `dist/`.
- **CI/CD** : GitHub Action `.github/workflows/deploy.yml` — sur push `main`, build Vite et publication via `actions/deploy-pages@v4`.
- **Domaine** : si custom (T8), `public/CNAME` contient le domaine et la config DNS pointe vers `aurelien-heux.github.io`.

## 8. Tests & vérifications avant publication

- **Visuel** : check responsive sur 4 viewports (375px, 768px, 1024px, 1440px).
- **Lighthouse** : score >95 Performance / Accessibilité / Best Practices / SEO.
- **RSVP end-to-end** : envoi de 3 réponses test → vérifier ligne dans Sheet + email reçu.
- **Open Graph** : prévisualiser sur WhatsApp, iMessage, Facebook.
- **Vérification cross-browser** : Chrome, Safari iOS, Firefox.
- **Accessibilité** : navigation clavier, contrastes WCAG AA, alt sur image hero.

## 9. Risques & mitigations

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Apps Script tombe en panne ou Google modifie l'API | Faible | Élevé | Backup quotidien manuel de la Sheet ; option de fallback `mailto:` documentée |
| Spam massif sur le RSVP | Moyenne | Faible | Token + honeypot ; si saturé, ajouter reCAPTCHA en v2 |
| Photo hero non disponible | Élevée | Moyen | Démarrer avec illustration sobre (étoile + texte) ; remplacer dès que photo dispo |
| Lieux à confirmer (T1, T2, T3) | Élevée | Faible | Afficher "à confirmer" tant que TBD ; mise à jour facile dans `index.html` |

## 10. Points en suspens (TBD à clarifier avant ou pendant l'implémentation)

| ID | Sujet | À fournir par l'utilisateur |
|---|---|---|
| T1 | Cérémonie religieuse — église | Nom + adresse |
| T2 | Lieu vin d'honneur | Adresse |
| T3 | Lieu dîner de Noël | Nom + adresse |
| T4 | Photo de couple en hero | Fichier image (ou décision : illustration uniquement) |
| T5 | Citation au hero | Phrase courte (ou aucune) |
| T6 | Liste hôtels finale | Reprendre les 3 de l'archive ou nouvelle sélection ? |
| T7 | URL liste de mariage / cagnotte | Lien |
| T8 | Domaine custom | Nom de domaine ou GitHub Pages par défaut |
| T9 | Date limite RSVP | Date (suggestion : 15 octobre 2026) |
| T10 | Email destinataire RSVP | Adresse pour notifications |
| T11 | Dress code exact | Phrase courte |
| T12 | FAQ — réponses | Validation des réponses proposées |

Ces points ne bloquent pas l'écriture du plan d'implémentation : on peut développer avec des **placeholders explicites** (`<!-- TBD T1 -->`) et les remplacer ensuite.

## 11. Suite

Une fois cette spec validée → écriture du plan d'implémentation détaillé (skill `superpowers:writing-plans`), puis exécution.

L'archive (Christmas-themed précédente, scaffold Provence, WIP) est préservée dans la branche `archive/pre-redesign-snapshot` accessible via le worktree `../aurelien-lisbeth-archive` — utile pour récupérer du contenu factuel (Apps Script existant, listes d'hôtels, polices, etc.).
