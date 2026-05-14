/**
 * Recharge l'iframe de la carte avec un viewport centré sur le lieu cliqué.
 *
 * Les liens avec `data-ll="lat,lng"` (et `data-z="zoom"` optionnel) ajoutent
 * `&ll=…&z=…` à l'URL de l'iframe Google MyMaps avant de scroller la page.
 * Sans JS, le lien reste une ancre `#carte` fonctionnelle (fallback).
 */
const iframe = document.querySelector('#carte iframe');
const baseSrc = iframe?.getAttribute('src');

if (iframe && baseSrc) {
  document.querySelectorAll('a[data-ll][href="#carte"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const ll = link.dataset.ll;
      const z  = link.dataset.z || '16';
      // On reconstruit l'URL en virant un éventuel ll/z précédent.
      const url = new URL(baseSrc, window.location.href);
      url.searchParams.set('ll', ll);
      url.searchParams.set('z', z);
      iframe.setAttribute('src', url.toString());
      document.getElementById('carte')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
