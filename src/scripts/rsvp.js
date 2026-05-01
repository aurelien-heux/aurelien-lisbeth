const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_RE.test(value.trim());
}

export function validateRsvp(input) {
  const errors = {};

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: { form: 'invalid' } };
  }

  // Honeypot — n'importe quelle valeur non vide est suspecte
  if (input.website && String(input.website).trim() !== '') {
    errors.honeypot = 'spam';
  }

  if (typeof input.name !== 'string' || input.name.trim().length < 2) {
    errors.name = 'Nom requis (au moins 2 caractères).';
  }

  if (!isValidEmail(input.email)) {
    errors.email = 'Email invalide.';
  }

  if (input.attendance !== 'oui' && input.attendance !== 'non') {
    errors.attendance = 'Merci d\'indiquer votre présence.';
  }

  if (input.attendance === 'oui') {
    const guests = Number(input.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 6) {
      errors.guests = 'Nombre de personnes : 1 à 6.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
