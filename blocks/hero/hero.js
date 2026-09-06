/** One authored hero, with layout differences handled by CSS. */
export default function decorate(block) {
  if (!block.classList.contains('home')) return;
  if (block.querySelector(':scope > .hero-content')) return;

  const content = document.createElement('div');
  content.className = 'hero-content';
  const background = document.createElement('div');
  background.className = 'hero-background';
  const badges = document.createElement('div');
  badges.className = 'hero-badges';
  const trust = document.createElement('ul');
  trust.className = 'hero-trust';
  // Preserve list semantics in Safari when CSS removes the list markers.
  trust.setAttribute('role', 'list');
  let legacy = true;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const label = cells.length > 1 ? cells[0].textContent.trim().replace(/\s+/g, ' ').toLowerCase() : '';
    const targets = { background, content, badges };
    if (Object.hasOwn(targets, label)) {
      legacy = false;
      cells.slice(1).forEach((cell) => targets[label].append(...cell.childNodes));
    } else if (label === 'trust' || label === 'trust (desktop)') {
      legacy = false;
      const item = document.createElement('li');
      if (label === 'trust (desktop)') item.className = 'hero-trust-desktop';
      cells.slice(1).forEach((cell) => item.append(...cell.childNodes));
      if (item.textContent.trim() || item.querySelector('img')) trust.append(item);
    } else {
      // Retain the original single-cell EDS hero and unknown authored content.
      cells.forEach((cell) => content.append(...cell.childNodes));
    }
  });

  // A single-cell legacy hero puts its background before the heading.
  if (legacy && !background.hasChildNodes() && content.firstElementChild?.querySelector('picture')) {
    background.append(content.firstElementChild.querySelector('picture'));
  }

  const backgroundLink = background.querySelector('a[href]');
  const authoredImage = background.querySelector('img');
  const path = background.textContent.trim();
  const plainURL = /^(https?:\/\/|\/(?!\/))\S+$/.test(path) ? path : '';
  const url = authoredImage?.src || backgroundLink?.href || plainURL;
  const backgroundImage = url ? authoredImage || document.createElement('img') : null;
  if (backgroundImage) {
    const picture = document.createElement('picture');
    const emptyImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>')}`;
    // A URL row avoids the HTML preload scanner fetching a desktop image on mobile.
    const mobile = document.createElement('source');
    mobile.media = '(width < 900px)';
    mobile.srcset = emptyImage;
    picture.append(mobile);
    authoredImage?.closest('picture')?.querySelectorAll('source').forEach((source) => {
      picture.append(source);
    });
    const desktop = document.createElement('source');
    desktop.media = '(width >= 900px)';
    desktop.srcset = url;
    picture.append(desktop);
    backgroundImage.removeAttribute('srcset');
    backgroundImage.src = emptyImage;
    backgroundImage.alt = '';
    backgroundImage.loading = 'eager';
    backgroundImage.setAttribute('fetchpriority', 'high');
    background.setAttribute('aria-hidden', 'true');
    picture.append(backgroundImage);
    background.replaceChildren(picture);
  }

  const actions = document.createElement('div');
  actions.className = 'hero-actions';
  content.querySelectorAll('p').forEach((paragraph) => {
    const links = [...paragraph.querySelectorAll('a[href]')];
    const text = links.map((link) => link.textContent.trim()).join('');
    if (links.length && text && paragraph.textContent.replace(/\s/g, '') === text.replace(/\s/g, '')) {
      links.forEach((link) => {
        if (!link.textContent.trim()) return;
        const primary = link.classList.contains('primary')
          || link.classList.contains('accent') || Boolean(link.closest('strong') || link.querySelector('strong'));
        link.classList.add('button', primary ? 'primary' : 'secondary');
        actions.append(link);
      });
      paragraph.remove();
    }
  });
  content.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('img')) p.remove();
  });
  if (actions.hasChildNodes()) content.append(actions);

  badges.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; });
  block.replaceChildren();
  block.append(content);
  if (badges.textContent.trim() || badges.querySelector('img')) block.append(badges);
  if (trust.hasChildNodes()) block.append(trust);
  // Do not make EDS wait for the decorative background before loading fonts/header.
  if (backgroundImage) block.append(background);
  block.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.relList.add('noopener', 'noreferrer');
  });
}
