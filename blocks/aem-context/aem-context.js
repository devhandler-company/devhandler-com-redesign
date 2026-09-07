/** Authored problem/solution panels, engagement steps and a company quote. */
export default function decorate(block) {
  if (block.querySelector(':scope > .aem-context-panels')) return;

  const details = document.createElement('div');
  details.className = 'aem-context-details';
  const steps = document.createElement('ol');
  steps.className = 'aem-context-steps';
  steps.setAttribute('role', 'list');
  const quote = document.createElement('blockquote');
  const caption = document.createElement('figcaption');
  const portrait = document.createElement('div');
  const action = document.createElement('div');
  const extras = document.createElement('div');
  extras.className = 'aem-context-extra';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const label = cells.length > 1 ? cells[0].textContent.trim().replace(/\s+/g, ' ').toLowerCase() : '';
    const content = cells.slice(1);
    if (['problem', 'solution', 'step'].includes(label)) {
      if (!content.some((cell) => cell.textContent.trim() || cell.querySelector('img'))) return;
      const card = document.createElement(label === 'step' ? 'li' : 'article');
      card.className = `aem-context-${label}`;
      content.forEach((cell) => card.append(...cell.childNodes));
      if (label === 'step') {
        const number = document.createElement('span');
        number.className = 'aem-context-number';
        number.setAttribute('aria-hidden', 'true');
        number.textContent = String(steps.children.length + 1).padStart(2, '0');
        card.prepend(number);
        steps.append(card);
      } else {
        const eyebrow = card.querySelector('p');
        if (eyebrow && (!card.querySelector('h3') || eyebrow === card.firstElementChild)) {
          eyebrow.classList.add('aem-context-eyebrow');
        }
        details.append(card);
      }
    } else {
      const targets = {
        quote, attribution: caption, portrait, link: action,
      };
      if (Object.hasOwn(targets, label)) {
        content.forEach((cell) => targets[label].append(...cell.childNodes));
      } else {
        // Keep unexpected authored content visible rather than silently losing it.
        cells.forEach((cell) => extras.append(...cell.childNodes));
      }
    }
  });

  const panels = document.createElement('div');
  panels.className = 'aem-context-panels';
  if (details.hasChildNodes()) panels.append(details);
  if (steps.hasChildNodes()) panels.append(steps);
  const figure = document.createElement('div');
  figure.className = 'aem-context-quote';
  const statement = document.createElement('figure');
  statement.className = 'aem-context-statement';
  if (quote.textContent.trim()) statement.append(quote);
  if (caption.textContent.trim()) statement.append(caption);
  if (statement.hasChildNodes()) figure.append(statement);

  const image = portrait.querySelector('img');
  const imageLink = portrait.querySelector('a[href]');
  const path = portrait.textContent.trim();
  const url = image?.src || imageLink?.href || (/^(https?:\/\/|\/(?!\/))\S+$/.test(path) ? path : '');
  if (url && statement.hasChildNodes()) {
    const picture = document.createElement('picture');
    picture.className = 'aem-context-portrait';
    const blank = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>')}`;
    const mobile = document.createElement('source');
    mobile.media = '(width < 900px)';
    mobile.srcset = blank;
    picture.append(mobile);
    image?.closest('picture')?.querySelectorAll('source').forEach((source) => picture.append(source));
    const desktop = document.createElement('source');
    desktop.media = '(width >= 900px)';
    const bundledPortrait = '/blocks/aem-context/ceo-portrait.webp';
    const bundledUrl = new URL(bundledPortrait, window.location.href).href;
    desktop.srcset = url === bundledPortrait || url === bundledUrl
      ? `${url} 1x, ${url.replace('.webp', '-2x.webp')} 2x, ${url.replace('.webp', '-3x.webp')} 3x`
      : url;
    picture.append(desktop);
    const img = image || document.createElement('img');
    img.removeAttribute('srcset');
    img.src = blank;
    // The adjacent attribution identifies the person; this illustration adds no new text.
    img.alt = '';
    img.width = 1169;
    img.height = 1370;
    img.loading = 'lazy';
    img.decoding = 'async';
    picture.append(img);
    figure.append(picture);
    figure.classList.add('aem-context-with-portrait');
  }

  const link = [...action.querySelectorAll('a[href]')].find((a) => a.textContent.trim());
  if (link) {
    link.className = 'aem-context-link';
    if (!link.hasAttribute('aria-label') && caption.textContent.trim()) {
      link.setAttribute('aria-label', `${link.textContent.trim()}: ${caption.textContent.trim().replace(/^[–—-]\s*/, '')}`);
    }
    figure.append(link);
  }
  block.replaceChildren(panels);
  if (figure.hasChildNodes()) block.append(figure);
  if (extras.textContent.trim() || extras.querySelector('img')) block.append(extras);
  block.querySelectorAll('a[target="_blank"]').forEach((a) => a.relList.add('noopener', 'noreferrer'));
}
