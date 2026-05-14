# Apps Script — RSVP backend

Ce code reçoit les RSVP du site et les écrit dans une Google Sheet.
Le déploiement est **manuel** (l'API Apps Script ne s'automatise pas trivialement).

## Colonnes écrites dans la Sheet

`timestamp`, `name`, `email`, `phone`, `attendance`, `attendanceNext`, `participants`, `diet`, `message`

> Les en-têtes sont créés automatiquement à la première ligne quand l'onglet est nouveau. Si tu as déjà une feuille avec les anciennes colonnes (`guests`, `guestNames`, `childrenCount`, etc.), supprime l'onglet ou recrée-en un avec le nom configuré dans `SHEET_TAB`.

## 1. Préparer la Google Sheet

1. Créer une Google Sheet vide nommée `Mariage RSVP` (ou autre).
2. Récupérer son ID (dans l'URL : `https://docs.google.com/spreadsheets/d/<ID>/edit`).

## 2. Créer le projet Apps Script

1. Aller sur https://script.google.com → **Nouveau projet**.
2. Nommer le projet `Mariage RSVP API`.
3. Coller l'intégralité de `rsvp.gs` dans `Code.gs`. Sauvegarder.

## 3. Définir les Script Properties

Dans Apps Script → **Project Settings** → **Script Properties** → **Add property** :

| Clé | Valeur |
|---|---|
| `SHEET_ID` | ID de la Sheet (étape 1) |
| `SHEET_TAB` | `RSVP` |
| `RSVP_TOKEN` | Token aléatoire (ex: `openssl rand -hex 16`) — doit matcher `VITE_RSVP_TOKEN` côté front |
| `NOTIF_EMAIL` | Adresse email à notifier (ou laisser vide pour désactiver) |
| `RSVP_LABEL` | (optionnel) Nom du label Gmail à appliquer aux notifications. Défaut : `Mariage RSVP` |

Les mails de notification sont envoyés avec le sujet `[Mariage RSVP] <nom> — <oui|non>` et le label Gmail configuré est appliqué automatiquement au thread (best-effort, fonctionne quand le compte qui exécute le script reçoit aussi le mail).

## 4. Déployer en Web App

1. Apps Script → **Deploy** → **New deployment** → Type : `Web app`.
2. Description : `v1`.
3. Execute as : **Me**.
4. Who has access : **Anyone**.
5. Deploy. Autoriser les accès demandés (Sheet + Gmail). Au passage de `MailApp` à `GmailApp`, Apps Script demandera une nouvelle autorisation à la première exécution.
6. **Copier l'URL de déploiement** (forme : `https://script.google.com/macros/s/.../exec`) — elle servira pour `VITE_RSVP_URL`.

## 5. Configurer le front

À la racine du projet, créer un `.env.local` (gitignored) avec les valeurs obtenues :

```
VITE_RSVP_URL=https://script.google.com/macros/s/<ID>/exec
VITE_RSVP_TOKEN=<même valeur que RSVP_TOKEN dans Script Properties>
```

Puis relancer `npm run dev`.

## 6. Tester manuellement

```bash
curl -L -X POST -H "Content-Type: application/json" \
  -d '{"token":"<TOKEN>","name":"Test","email":"test@example.com","phone":"0612345678","attendance":"oui","attendanceNext":"non","participants":"Test","diet":"","message":"Hello"}' \
  '<URL>'
```

> **`-L` est obligatoire** : Apps Script Web Apps renvoient un HTTP 302 vers `script.googleusercontent.com`. Sans `-L`, curl s'arrête sur le HTML `Document has moved` et tu ne verras pas la vraie réponse JSON.

Devrait retourner `{"ok":true}` et créer une ligne dans la Sheet.

## 7. Si vous modifiez le code plus tard

Apps Script → **Deploy** → **Manage deployments** → ✏️ → **New version** → **Deploy**.
**L'URL ne change pas** entre les versions d'un même déploiement.

## Codes d'erreur retournés

| `error` | Sens |
|---|---|
| `unauthorized` | Token absent ou incorrect |
| `invalid_json` | Le body POST n'est pas du JSON valide |
| `duplicate_recent` | Un RSVP avec le même email a été enregistré il y a moins de 60 min |
| `server_error` | Erreur côté serveur (ex: Sheet inaccessible) |
