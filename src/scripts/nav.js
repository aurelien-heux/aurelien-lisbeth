const header = document.querySelector('.site-header');
const nav = document.querySelector('.nav');
const burger = nav?.querySelector('.nav__burger');
const links = nav?.querySelectorAll('.nav__links a');

if (header) {
  // Add scrolled class when page is scrolled
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
}

// Close mobile menu when a link is clicked
if (links && nav) {
  links.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger?.setAttribute('aria-expanded', 'false');
    });
  });
}
