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
  'guests', 'guestNames', 'childrenCount', 'childrenAges', 'childcare',
  'diet', 'message', 'ipHash',
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
      data.childrenCount === 0 || data.childrenCount ? data.childrenCount : '',
      data.childrenAges || '',
      data.childcare || '',
      data.diet || '',
      data.message || '',
      hashIp(e.parameter && e.parameter.userIp),
    ]);

    if (notifEmail) {
      const subject = `RSVP: ${data.name || 'anonyme'} — ${data.attendance || ''}`;
      const body = [
        `Nom      : ${data.name || ''}`,
        `Email    : ${data.email || ''}`,
        `Tel      : ${data.phone || ''}`,
        `Présence : ${data.attendance || ''}`,
        `Adultes  : ${data.guests || ''}`,
        `Accomp.  : ${data.guestNames || ''}`,
        `Enfants  : ${data.childrenCount === 0 || data.childrenCount ? data.childrenCount : ''}`,
        `Âges     : ${data.childrenAges || ''}`,
        `Garde    : ${data.childcare || ''}`,
        `Régime   : ${data.diet || ''}`,
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
