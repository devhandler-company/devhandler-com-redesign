export const REVIEWS_CAROUSEL_CONFIG = {
  desktopBreakpoint: 900,
  cardWidth: 421,
  cardHeight: 468,
  mobileCardHeight: 360,
  gap: 'var(--spacing-16)',
  fadeWidth: 274,
  fadeHeight: 502,
  mobileFadeWidth: 'var(--spacing-64)',
  mobileSidePeek: 'var(--spacing-32)',
  wideFullCards: 2,
  compactFullCards: 1,
  minimumWideEdgeRatio: 0.5,
  dragThreshold: 2,
};

function applyCarouselConfig(block) {
  const config = REVIEWS_CAROUSEL_CONFIG;
  const properties = {
    '--reviews-card-width': `${config.cardWidth}px`,
    '--reviews-card-height': `${config.cardHeight}px`,
    '--reviews-mobile-card-height': `${config.mobileCardHeight}px`,
    '--reviews-gap': config.gap,
    '--reviews-fade-width': `${config.fadeWidth}px`,
    '--reviews-fade-height': `${config.fadeHeight}px`,
    '--reviews-mobile-fade-width': config.mobileFadeWidth,
    '--reviews-mobile-side-peek': config.mobileSidePeek,
  };

  Object.entries(properties).forEach(([property, value]) => {
    block.style.setProperty(property, value);
  });
}

function updateLayoutMode(block) {
  const isDesktop = block.clientWidth >= REVIEWS_CAROUSEL_CONFIG.desktopBreakpoint;
  block.classList.toggle('is-desktop', isDesktop);
  block.classList.toggle('is-mobile', !isDesktop);
}

function hasContent(element) {
  return Boolean(element?.textContent.trim() || element?.querySelector('img, picture'));
}

function decorateReviewer(cells) {
  const populated = cells.filter(hasContent);
  if (!populated.length) return null;

  const reviewer = document.createElement('div');
  reviewer.className = 'reviews-card-reviewer';
  const image = populated.map((cell) => cell.querySelector('picture, img')).find(Boolean);
  if (image) reviewer.append(image);

  const parts = populated.flatMap((cell) => {
    const copy = cell.cloneNode(true);
    copy.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
    const paragraphs = [...copy.querySelectorAll('p')];
    return (paragraphs.length ? paragraphs : [copy])
      .flatMap((element) => element.textContent.split(/\r?\n|\s+[-–—·]\s+/));
  })
    .map((text) => text.trim()).filter(Boolean);
  if (parts.length) {
    const details = document.createElement('div');
    details.className = 'reviews-card-reviewer-details';
    const name = document.createElement('p');
    name.className = 'reviews-card-reviewer-name';
    [name.textContent] = parts;
    details.append(name);
    if (parts.length > 1) {
      const role = document.createElement('p');
      role.className = 'reviews-card-reviewer-role';
      role.textContent = parts.slice(1).join(' ');
      details.append(role);
    }
    reviewer.append(details);
  }
  return reviewer;
}

function decorateReview(row) {
  const cells = [...row.children];
  const title = cells[0];
  if (!title?.textContent.trim()) return null;

  const item = document.createElement('li');
  item.className = 'reviews-card';

  const header = document.createElement('div');
  header.className = 'reviews-card-header';

  title.className = 'reviews-card-title';
  if (!title.querySelector('h3, h4, h5, h6')) {
    const heading = document.createElement('h3');
    heading.innerHTML = title.innerHTML;
    title.replaceChildren(heading);
  }

  const date = cells[1];
  if (hasContent(date)) {
    date.className = 'reviews-card-date';
    header.append(title, date);
  } else {
    header.append(title);
  }

  item.append(header);

  const quoteCells = cells.slice(2, 3).filter(hasContent);
  if (quoteCells.length) {
    const quote = document.createElement('div');
    quote.className = 'reviews-card-quote';
    quoteCells.forEach((cell) => quote.append(...cell.childNodes));
    item.append(quote);
  }

  const reviewer = decorateReviewer(cells.slice(3));
  if (reviewer) item.append(reviewer);

  return item;
}

function cloneCard(card) {
  const clone = card.cloneNode(true);
  clone.classList.add('is-clone');
  clone.removeAttribute('aria-label');
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
  clone.querySelectorAll('a, button, input, select, textarea, [tabindex]')
    .forEach((element) => element.setAttribute('tabindex', '-1'));
  return clone;
}

function createLoop(track, cards) {
  const block = track.closest('.reviews');
  if (cards.length < 2) return null;

  const leadingClones = cards.map(cloneCard);
  const trailingClones = cards.map(cloneCard);
  track.prepend(...leadingClones);
  track.append(...trailingClones);
  block.classList.add('is-looped');

  let originalStart = 0;
  let segmentWidth = 0;
  let snapFrame;

  const measure = () => {
    originalStart = cards[0].offsetLeft;
    segmentWidth = trailingClones[0].offsetLeft - originalStart;
  };

  const moveWithoutSnap = (position) => {
    track.classList.add('is-loop-adjusting');
    track.scrollLeft = position;
    cancelAnimationFrame(snapFrame);
    snapFrame = requestAnimationFrame(() => {
      track.classList.remove('is-loop-adjusting');
    });
  };

  const normalize = () => {
    if (!segmentWidth) measure();
    const lowerBoundary = originalStart - (segmentWidth / 2);
    const upperBoundary = originalStart + (segmentWidth / 2);
    let shift = 0;

    if (track.scrollLeft < lowerBoundary) shift = segmentWidth;
    if (track.scrollLeft > upperBoundary) shift = -segmentWidth;
    if (shift) moveWithoutSnap(track.scrollLeft + shift);
    return shift;
  };

  const setInitialPosition = () => {
    measure();
    const config = REVIEWS_CAROUSEL_CONFIG;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const isDesktop = block.classList.contains('is-desktop');
    const wideMinimumWidth = (cardWidth * config.wideFullCards)
      + (gap * (config.wideFullCards + 1))
      + (cardWidth * config.minimumWideEdgeRatio * 2);
    const fullCardCount = isDesktop && track.clientWidth >= wideMinimumWidth
      ? config.wideFullCards
      : config.compactFullCards;
    const gapsInView = fullCardCount + 1;
    const peekWidth = Math.max(
      0,
      (track.clientWidth - (cardWidth * fullCardCount) - (gap * gapsInView)) / 2,
    );
    const firstCardInset = peekWidth + gap;
    moveWithoutSnap(originalStart - firstCardInset);
  };

  return { measure, normalize, setInitialPosition };
}

function enableDrag(track, loop) {
  const block = track.closest('.reviews');
  let dragging = false;
  let hasDragged = false;
  let startX = 0;
  let startScroll = 0;

  const markInteracted = () => block.classList.add('has-interacted');

  const stopDragging = () => {
    dragging = false;
    track.classList.remove('is-dragging');
    loop?.normalize();
  };

  track.addEventListener('pointerdown', (event) => {
    hasDragged = false;
    if (event.pointerType === 'touch' || event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startScroll = track.scrollLeft;
  });

  track.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') {
      markInteracted();
      return;
    }
    if (!dragging) return;
    if (Math.abs(event.clientX - startX) > REVIEWS_CAROUSEL_CONFIG.dragThreshold) {
      hasDragged = true;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
      markInteracted();
    }
    if (!hasDragged) return;
    track.scrollLeft = startScroll - (event.clientX - startX);
    startScroll += loop?.normalize() || 0;
  });

  track.addEventListener('pointerup', stopDragging);
  track.addEventListener('pointercancel', stopDragging);
  track.addEventListener('lostpointercapture', stopDragging);

  track.addEventListener('click', (event) => {
    if (hasDragged && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const next = event.target.closest('.reviews-card-next');
    if (!next) return;
    markInteracted();
    const card = next.closest('.reviews-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: card.getBoundingClientRect().width + gap,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  });

  track.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    markInteracted();
    const card = track.querySelector('.reviews-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = (card?.getBoundingClientRect().width || track.clientWidth) + gap;
    track.scrollBy({
      left: event.key === 'ArrowRight' ? distance : -distance,
      behavior: 'smooth',
    });
  });

  track.addEventListener('wheel', markInteracted, { passive: true });
  track.addEventListener('scroll', () => {
    if (!dragging) loop?.normalize();
  }, { passive: true });

  new ResizeObserver(() => {
    updateLayoutMode(block);
    requestAnimationFrame(() => {
      loop?.measure();
      if (!block.classList.contains('has-interacted')) loop?.setInitialPosition();
    });
  }).observe(track);
}

export default function decorate(block) {
  const rows = [...block.children].filter((row) => row.children.length);
  if (!rows.length) return;

  const track = document.createElement('ul');
  track.className = 'reviews-track';
  track.tabIndex = 0;
  // Preserve list semantics in Safari when CSS removes the list markers.
  track.setAttribute('role', 'list');
  track.setAttribute('aria-label', 'Customer reviews carousel');

  const cards = rows.map(decorateReview).filter(Boolean);
  cards.forEach((card, index) => {
    card.setAttribute('aria-posinset', index + 1);
    card.setAttribute('aria-setsize', cards.length);
    if (cards.length > 1) {
      const next = document.createElement('button');
      next.className = 'reviews-card-next';
      next.type = 'button';
      next.setAttribute('aria-label', `Show next review after ${card.querySelector('.reviews-card-title').textContent.trim()}`);
      card.append(next);
    }
  });
  if (!cards.length) {
    block.replaceChildren();
    return;
  }
  track.append(...cards);

  block.replaceChildren(track);
  applyCarouselConfig(block);
  updateLayoutMode(block);
  const loop = createLoop(track, cards);
  enableDrag(track, loop);
  requestAnimationFrame(() => loop?.setInitialPosition());
}
