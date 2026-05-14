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
    phone: '',
    attendance: 'oui',
    attendanceNext: 'non',
    participants: 'Jean Dupont, Marie Dupont',
    diet: '',
    message: '',
    website: '',
  };

  it('accepts a valid "oui" RSVP', () => {
    const result = validateRsvp(base);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('accepts a valid "non" RSVP without participants/attendanceNext', () => {
    const result = validateRsvp({
      ...base,
      attendance: 'non',
      attendanceNext: undefined,
      participants: undefined,
    });
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

  it('rejects missing attendanceNext when attendance is oui', () => {
    const result = validateRsvp({ ...base, attendanceNext: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.attendanceNext).toBeDefined();
  });

  it('rejects missing participants when attendance is oui', () => {
    const result = validateRsvp({ ...base, participants: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.participants).toBeDefined();
  });

  it('rejects participants shorter than 2 chars', () => {
    const result = validateRsvp({ ...base, participants: 'a' });
    expect(result.valid).toBe(false);
    expect(result.errors.participants).toBeDefined();
  });

  it('flags honeypot as invalid (silently)', () => {
    const result = validateRsvp({ ...base, website: 'http://spam.example' });
    expect(result.valid).toBe(false);
    expect(result.errors.honeypot).toBeDefined();
  });

  it('does not require attendanceNext when attendance is non', () => {
    const result = validateRsvp({
      ...base,
      attendance: 'non',
      attendanceNext: undefined,
      participants: undefined,
    });
    expect(result.valid).toBe(true);
    expect(result.errors.attendanceNext).toBeUndefined();
  });

  it('does not require participants when attendance is non', () => {
    const result = validateRsvp({
      ...base,
      attendance: 'non',
      attendanceNext: undefined,
      participants: '',
    });
    expect(result.valid).toBe(true);
    expect(result.errors.participants).toBeUndefined();
  });

  it('accepts attendanceNext "oui"', () => {
    const result = validateRsvp({ ...base, attendanceNext: 'oui' });
    expect(result.valid).toBe(true);
  });
});
