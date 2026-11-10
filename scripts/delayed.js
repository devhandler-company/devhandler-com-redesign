/*
 * Motion that no content depends on. Loaded three seconds after the page, skipped entirely under
 * prefers-reduced-motion. Without it the site is complete.
 */
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* cursor light on cards: writes the pointer position into --mx and --my on the card */
function spotlight() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest?.('.cards .cards-card');
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - box.left}px`);
    card.style.setProperty('--my', `${e.clientY - box.top}px`);
  }, { passive: true });
}

if (!calm) {
  spotlight();
}
