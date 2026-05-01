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

// ----- Wiring DOM -----
const FORM_ID = 'rsvp-form';
const STATUS_ID = 'rsvp-status';
const SUBMIT_ID = 'rsvp-submit';
const ATTENDANCE_ID = 'rsvp-attendance';

const RSVP_URL = import.meta.env?.VITE_RSVP_URL;
const RSVP_TOKEN = import.meta.env?.VITE_RSVP_TOKEN;

if (typeof document !== 'undefined') {
  const form = document.getElementById(FORM_ID);
  const status = document.getElementById(STATUS_ID);
  const submit = document.getElementById(SUBMIT_ID);
  const attendance = document.getElementById(ATTENDANCE_ID);

  function toggleConditionalFields() {
    if (!form) return;
    const value = attendance?.value || '';
    form.querySelectorAll('[data-show-when]').forEach(el => {
      const cond = el.dataset.showWhen;
      const [key, expected] = cond.split(':');
      const visible = key === 'attendance' && value === expected;
      el.classList.toggle('is-visible', visible);
    });
  }

  function readForm() {
    if (!form) return null;
    const fd = new FormData(form);
    const obj = Object.fromEntries(fd.entries());
    if (obj.guests) obj.guests = Number(obj.guests);
    return obj;
  }

  function setStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.className = 'rsvp-status' + (kind ? ` is-${kind}` : '');
  }

  function markInvalidFields(errors) {
    if (!form) return;
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    Object.keys(errors).forEach(field => {
      const el = form.elements[field];
      if (el && el.classList) el.classList.add('is-invalid');
    });
  }

  if (form) {
    attendance?.addEventListener('change', toggleConditionalFields);
    toggleConditionalFields();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setStatus('', null);

      const data = readForm();
      const { valid, errors } = validateRsvp(data);

      if (!valid) {
        // Honeypot rempli → faire semblant d'avoir réussi (pas d'indice au bot)
        if (errors.honeypot) {
          setStatus('Merci, votre réponse a bien été enregistrée.', 'success');
          form.reset();
          return;
        }
        markInvalidFields(errors);
        const firstError = Object.values(errors)[0];
        setStatus(firstError || 'Merci de vérifier le formulaire.', 'error');
        return;
      }

      if (!RSVP_URL || !RSVP_TOKEN) {
        console.warn('RSVP : VITE_RSVP_URL ou VITE_RSVP_TOKEN manquant.');
        setStatus('Configuration manquante côté front. Merci de prévenir les mariés.', 'error');
        return;
      }

      if (submit) submit.disabled = true;
      setStatus('Envoi en cours…', null);

      try {
        const response = await fetch(RSVP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          // Apps Script GAS Web App reçoit du text/plain — Content-Type évite le preflight CORS
          body: JSON.stringify({ ...data, token: RSVP_TOKEN }),
        });

        const result = await response.json().catch(() => ({ ok: false, error: 'invalid_response' }));

        if (result.ok) {
          setStatus('Merci, votre réponse a bien été reçue 🤍', 'success');
          form.reset();
          toggleConditionalFields();
        } else if (result.error === 'duplicate_recent') {
          setStatus('Cette adresse a déjà répondu il y a moins d\'une heure.', 'error');
        } else {
          setStatus('Une erreur est survenue. Merci de réessayer ou de prévenir les mariés.', 'error');
        }
      } catch (err) {
        console.error(err);
        setStatus('Réseau indisponible. Réessayez dans un instant ?', 'error');
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }
}
