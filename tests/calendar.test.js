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
