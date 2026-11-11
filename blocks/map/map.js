/** One image of the world map (inline image or a repo path) and an optional Description row. */
export default function decorate(block) {
  if (block.querySelector(':scope > .map-figure')) return;
  let source = '';
  let description = '';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const label = cells.length > 1 ? cells[0].textContent.trim().toLowerCase() : '';
    if (label === 'description') {
      description = cells[1].textContent.trim().replace(/\s+/g, ' ');
      return;
    }
    if (source) return;
    const cell = cells.at(-1);
    const image = cell?.querySelector('img');
    const path = cell?.textContent.trim() || '';
    if (image?.src) source = image.src;
    else if (/^\/(?!\/)\S+\.(?:svg|png|webp|jpe?g)$/i.test(path)) source = path;
  });
  if (!source) {
    block.replaceChildren();
    return;
  }
  const figure = document.createElement('div');
  figure.className = 'map-figure';
  if (description) {
    figure.setAttribute('role', 'img');
    figure.setAttribute('aria-label', description);
  }
  const image = document.createElement('img');
  image.src = source;
  image.alt = '';
  image.loading = 'lazy';
  image.decoding = 'async';
  figure.append(image);
  block.replaceChildren(figure);
}
