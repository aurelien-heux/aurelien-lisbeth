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

// ----- Wiring du bouton "Ajouter à mon agenda" -----
if (typeof document !== 'undefined') {
  const ADD_BTN_ID = 'add-to-calendar';

  const WEDDING_EVENT = {
    title: 'Mariage Lisbeth & Aurélien',
    start: new Date('2026-12-05T14:00:00+01:00'), // 14h Paris time
    end:   new Date('2026-12-06T02:00:00+01:00'), // 2h du matin (cohérent avec FAQ)
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
}
