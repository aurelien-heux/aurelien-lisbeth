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
  'timestamp', 'name', 'email', 'phone',
  'attendance', 'attendanceNext',
  'participants', 'diet', 'message',
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
  }
  // Pose l'en-tête à la première ligne si l'onglet est vide (couvre à la
  // fois la création d'un nouvel onglet et un onglet créé manuellement
  // mais encore vierge).
  if (sheet.getLastRow() === 0) {
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

/**
 * Envoie l'email de notification puis applique le label Gmail "Mariage RSVP"
 * sur son thread. Approche déterministe : on passe par un Draft → send()
 * pour récupérer directement le GmailMessage envoyé (pas de search async qui
 * pourrait rater l'email pas encore indexé).
 * Label name configurable via la Script Property RSVP_LABEL (défaut : "Mariage RSVP").
 */
function sendRsvpNotification(notifEmail, subject, body) {
  console.log('sendRsvpNotification: start, notifEmail=' + notifEmail);
  const draft = GmailApp.createDraft(notifEmail, subject, body);
  console.log('sendRsvpNotification: draft created');
  const sentMessage = draft.send();
  console.log('sendRsvpNotification: draft sent, messageId=' + sentMessage.getId());

  try {
    const labelName = getProps().getProperty('RSVP_LABEL') || 'Mariage RSVP';
    let label = GmailApp.getUserLabelByName(labelName);
    if (!label) {
      label = GmailApp.createLabel(labelName);
      console.log('sendRsvpNotification: created new label "' + labelName + '"');
    }
    sentMessage.getThread().addLabel(label);
    console.log('sendRsvpNotification: label "' + labelName + '" applied to thread');
  } catch (err) {
    // Best-effort : si le label échoue le mail est déjà parti.
    console.warn('RSVP label apply failed:', err);
  }
}

function doPost(e) {
  console.log('doPost: invoked');
  try {
    const props = getProps();
    const expectedToken = props.getProperty('RSVP_TOKEN');
    const notifEmail = props.getProperty('NOTIF_EMAIL');
    console.log('doPost: NOTIF_EMAIL=' + (notifEmail || '(not set)'));

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (_) {
      console.warn('doPost: invalid JSON body');
      return jsonResponse({ ok: false, error: 'invalid_json' });
    }

    if (!expectedToken || data.token !== expectedToken) {
      console.warn('doPost: unauthorized (token mismatch)');
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
      data.attendanceNext || '',
      data.participants || '',
      data.diet || '',
      data.message || '',
    ]);

    if (notifEmail) {
      const subject = `[Mariage RSVP] ${data.name || 'anonyme'} — ${data.attendance || ''}`;
      const body = [
        `Nom        : ${data.name || ''}`,
        `Email      : ${data.email || ''}`,
        `Tel        : ${data.phone || ''}`,
        `Jour       : ${data.attendance || ''}`,
        `Lendemain  : ${data.attendanceNext || ''}`,
        '',
        'Participants :',
        data.participants || '(non renseigné)',
        '',
        'Allergies / régimes :',
        data.diet || '(aucun)',
        '',
        'Commentaires :',
        data.message || '(aucun)',
      ].join('\n');
      sendRsvpNotification(notifEmail, subject, body);
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
