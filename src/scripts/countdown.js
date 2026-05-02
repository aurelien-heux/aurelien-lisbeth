const daysEl = document.querySelector('[data-countdown-days]');
const unitEl = document.querySelector('[data-countdown-unit]');
const clockEl = document.querySelector('[data-countdown-clock]');

if (daysEl) {
  const target = new Date('2026-12-05T14:00:00+01:00');
  const pad = (n) => n.toString().padStart(2, '0');

  const tick = () => {
    const diff = target - new Date();
    if (diff <= 0) {
      daysEl.textContent = '0';
      if (unitEl) unitEl.textContent = 'jour';
      if (clockEl) clockEl.textContent = "C'est aujourd'hui !";
      return false;
    }
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = days.toLocaleString('fr-FR');
    if (unitEl) unitEl.textContent = days <= 1 ? 'jour' : 'jours';
    if (clockEl) clockEl.textContent = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    return true;
  };

  if (tick()) {
    const timer = setInterval(() => {
      if (!tick()) clearInterval(timer);
    }, 1000);
  }
}
