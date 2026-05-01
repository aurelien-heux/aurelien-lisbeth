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
