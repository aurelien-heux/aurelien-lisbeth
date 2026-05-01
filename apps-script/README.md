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
