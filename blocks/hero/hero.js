import { createOptimizedPicture } from '../../scripts/aem.js';

/** One authored hero, with layout differences handled by CSS. */
export default function decorate(block) {
  const textHero = block.classList.contains('services') || block.classList.contains('blog');
  const caseStudy = block.classList.contains('case');
  const article = block.classList.contains('blog') && block.classList.contains('article');
  if (!block.classList.contains('home') && !textHero && !caseStudy) return;
  if (block.querySelector(':scope > .hero-content')) return;

  const content = document.createElement('div');
  content.className = 'hero-content';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'hero-eyebrow';
  const background = document.createElement('div');
  background.className = 'hero-background';
  const badges = document.createElement('div');
  badges.className = 'hero-badges';
  const trust = document.createElement('ul');
  const media = document.createElement('div');
  media.className = 'hero-media';
  const metadata = document.createElement('div');
  metadata.className = 'hero-metadata';
  const tags = document.createElement('ul');
  tags.className = 'hero-tags';
  tags.setAttribute('role', 'list');
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'hero-breadcrumbs';
  breadcrumbs.setAttribute('aria-label', 'Breadcrumb');
  trust.className = 'hero-trust';
  // Preserve list semantics in Safari when CSS removes the list markers.
  trust.setAttribute('role', 'list');
  let legacy = true;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const label = cells.length > 1 ? cells[0].textContent.trim().replace(/\s+/g, ' ').toLowerCase() : '';
    const targets = { background, content, badges };
    if (caseStudy || article) targets.image = media;
    if (article) targets.metadata = metadata;
    if ((textHero || caseStudy) && label === 'breadcrumbs') {
      legacy = false;
      const list = document.createElement('ol');
      list.setAttribute('role', 'list');
      cells.slice(1).forEach((cell) => {
        let entries = cell.children.length ? [...cell.children] : [cell];
        if (cell.querySelector('li')) entries = [...cell.querySelectorAll('li')];
        entries.forEach((entry) => {
          if (!entry.textContent.trim()) return;
          const item = document.createElement('li');
          item.append(...entry.childNodes);
          list.append(item);
        });
      });
      list.lastElementChild?.setAttribute('aria-current', 'page');
      list.querySelectorAll('a').forEach((link) => {
        const href = link.getAttribute('href')?.trim();
        let safe = false;
        try {
          safe = Boolean(href) && !(/^https?:/i.test(href) && !/^https?:\/\/[^/\s?#]/i.test(href))
            && ['http:', 'https:'].includes(new URL(href, window.location).protocol);
        } catch { /* Incomplete crumbs remain readable without a link. */ }
        if (!safe) link.replaceWith(...link.childNodes);
      });
      breadcrumbs.append(list);
    } else if ((textHero || caseStudy) && label === 'eyebrow') {
      legacy = false;
      eyebrow.textContent = cells.slice(1).map((cell) => cell.textContent.trim()).join(' ');
    } else if (caseStudy && label === 'tags') {
      legacy = false;
      cells.slice(1).forEach((cell) => {
        const items = cell.querySelectorAll('li');
        const entries = items.length ? items : cell.querySelectorAll('p');
        (entries.length ? [...entries] : [cell]).forEach((entry) => {
          if (!entry.textContent.trim()) return;
          const item = document.createElement('li');
          item.textContent = entry.textContent.trim();
          tags.append(item);
        });
      });
    } else if (Object.hasOwn(targets, label)) {
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

  if (block.classList.contains('home')) {
    const heading = content.querySelector('h1');
    const lastBreak = [...(heading?.querySelectorAll('br') || [])].at(-1);
    if (lastBreak) {
      const lastLine = document.createElement('span');
      lastLine.className = 'hero-lastline';
      while (lastBreak.nextSibling) lastLine.append(lastBreak.nextSibling);
      lastBreak.replaceWith(lastLine);
    }
  }

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

  [content, badges, trust, media, metadata].flatMap((container) => [...container.querySelectorAll('a[href]')])
    .forEach((link) => {
      const href = link.getAttribute('href')?.trim();
      let safe = false;
      try {
        safe = Boolean(href) && !(/^https?:/i.test(href) && !/^https?:\/\/[^/\s?#]/i.test(href))
          && ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(href, window.location).protocol);
      } catch { /* Invalid authored destinations remain readable without a link. */ }
      if (!safe) link.replaceWith(...link.childNodes);
    });

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
        if (textHero || caseStudy || block.classList.contains('home')) {
          link.querySelectorAll('strong, em').forEach((format) => format.replaceWith(...format.childNodes));
        }
        link.classList.add('button', primary ? 'primary' : 'secondary');
        actions.append(link);
      });
      paragraph.remove();
    }
  });
  content.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('img')) p.remove();
  });
  if (tags.hasChildNodes()) content.append(tags);
  if (actions.hasChildNodes()) content.append(actions);
  if (eyebrow.textContent.trim()) content.prepend(eyebrow);
  if (breadcrumbs.textContent.trim()) content.prepend(breadcrumbs);
  if (article && metadata.hasChildNodes()) content.append(metadata);

  badges.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; });
  block.replaceChildren();
  block.append(content);
  if (article && media.hasChildNodes()) {
    media.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager';
      image.setAttribute('fetchpriority', 'high');
    });
    content.append(media);
  }
  if (caseStudy && (media.hasChildNodes() || block.classList.contains('placeholder-media'))) {
    const eager = window.matchMedia('(min-width: 900px)').matches;
    media.querySelectorAll('img').forEach((image) => {
      const picture = createOptimizedPicture(image.src, image.alt, eager, [
        { media: '(min-width: 900px)', width: '450' }, { width: '400' },
      ]);
      picture.querySelector('img').setAttribute('fetchpriority', eager ? 'high' : 'auto');
      (image.closest('picture') || image).replaceWith(picture);
    });
    block.append(media);
  }
  if (badges.textContent.trim() || badges.querySelector('img')) block.append(badges);
  if (trust.hasChildNodes()) block.append(trust);
  // Do not make EDS wait for the decorative background before loading fonts/header.
  if (backgroundImage) block.append(background);
  block.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.relList.add('noopener', 'noreferrer');
  });
}
