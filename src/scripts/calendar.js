const PROD_ID = '-//Aurélien & Lisbeth//Mariage 2026//FR';

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

export function buildGoogleCalendarUrl({ title, start, end, location, description }) {
  if (start >= end) {
    throw new RangeError('buildGoogleCalendarUrl: start must be before end');
  }
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatIcsDate(start)}/${formatIcsDate(end)}`,
    location: location ?? '',
    details: description ?? '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ----- Wiring du bouton "Ajouter à mon agenda" -----
if (typeof document !== 'undefined') {
  const WEDDING_EVENT = {
    title: 'Mariage Aurélien & Lisbeth',
    start: new Date('2026-12-05T14:00:00+01:00'), // 14h Paris time
    end:   new Date('2026-12-06T02:00:00+01:00'),
    location: 'Boulogne-sur-Mer, France',
    description: 'Cérémonie religieuse à la Basilique Notre-Dame de Boulogne, puis festivités à la Maloterie',
    uid: 'wedding-aurelien-lisbeth-20261205@aurelien-lisbeth',
  };

  const trigger = document.getElementById('add-to-calendar');
  const menu    = document.getElementById('add-to-calendar-menu');

  function closeMenu() {
    if (!menu) return;
    menu.hidden = true;
    trigger?.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    trigger?.setAttribute('aria-expanded', 'true');
  }

  if (trigger && menu) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.hidden ? openMenu() : closeMenu();
    });
    document.addEventListener('click', (e) => {
      if (!menu.hidden && !menu.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    menu.addEventListener('click', (e) => {
      const action = e.target.closest('[data-cal-type]')?.dataset.calType;
      if (!action) return;
      if (action === 'google') {
        window.open(buildGoogleCalendarUrl(WEDDING_EVENT), '_blank', 'noopener');
      } else if (action === 'ics') {
        const ics = buildIcs(WEDDING_EVENT);
        downloadIcs('mariage-aurelien-lisbeth.ics', ics);
      }
      closeMenu();
    });
  }
}
