import { createOptimizedPicture } from '../../scripts/aem.js';

const TEXT_ELEMENTS = 'p, li, h1, h2, h3, h4, h5, h6';
const CARD_VARIANTS = ['case', 'service', 'insight', 'featured', 'model', 'challenge', 'outcome', 'reason', 'panel', 'team'];
const CARD_MEDIA_WIDTHS = [{ width: '750' }];

function textParts(cell, deduplicate = true) {
  if (!cell) return [];

  const listItems = [...cell.querySelectorAll('li')];
  const elements = listItems.length ? listItems : [...cell.querySelectorAll(TEXT_ELEMENTS)]
    .filter((element) => !element.closest('li'));
  const sources = elements.length ? elements : [cell];

  const parts = sources.flatMap((source) => {
    const copy = source.cloneNode(true);
    copy.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
    return copy.textContent.split(/\r?\n/);
  }).map((text) => text.trim()).filter(Boolean);

  return deduplicate
    ? parts.filter((part, index) => index === 0 || part !== parts[index - 1]) : parts;
}

function findTextLink(cell) {
  if (!cell) return null;
  return [...cell.querySelectorAll('a[href]')]
    .find((link) => {
      if (link.querySelector('picture, img')) return false;
      const href = link.getAttribute('href')?.trim();
      if (!href || (/^https?:/i.test(href) && !/^https?:\/\/[^/\s?#]/i.test(href))) return false;
      try {
        return ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(href, document.baseURI).protocol);
      } catch { return false; }
    }) || null;
}

function createCard() {
  const item = document.createElement('li');
  item.className = 'cards-item';
  const article = document.createElement('article');
  article.className = 'cards-card';
  item.append(article);
  return { item, article };
}

/** An image cell holds an inline image or, as a fallback, one repo path to an image. */
function mediaSource(cell) {
  const sourceImage = cell?.querySelector('picture img, img');
  if (sourceImage?.src) return { src: sourceImage.src, alt: sourceImage.getAttribute('alt')?.trim() };
  const path = cell?.textContent.trim() || '';
  const isImagePath = /^\/(?!\/)\S+\.(?:jpe?g|png|webp|avif|svg)$/i.test(path);
  return isImagePath ? { src: path, alt: '' } : null;
}

function appendMedia(article, cell, fallbackAlt, reserveSpace = false) {
  const source = mediaSource(cell);
  if (!source && !reserveSpace) return null;

  const media = document.createElement('div');
  media.className = 'cards-media';
  if (source) {
    const alt = source.alt || fallbackAlt;
    media.append(createOptimizedPicture(source.src, alt, false, CARD_MEDIA_WIDTHS));
  } else {
    media.setAttribute('aria-hidden', 'true');
  }
  article.append(media);
  return media;
}

function appendText(parent, className, text, tagName = 'p') {
  if (!text) return null;
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function appendLink(parent, cell, className) {
  const source = findTextLink(cell);
  if (!source) return appendText(parent, className, textParts(cell).join(' '), 'span');

  const link = source.cloneNode(false);
  link.className = className;
  link.textContent = textParts(cell).join(' ') || source.textContent;
  if (link.target === '_blank') link.relList.add('noopener', 'noreferrer');
  parent.append(link);
  return link;
}

function createCaseTags(cells) {
  const tags = cells.flatMap((cell) => textParts(cell)
    .flatMap((text) => text.split(',').map((tag) => tag.trim()).filter(Boolean)));
  if (!tags.length) return null;

  const list = document.createElement('ul');
  list.className = 'cards-case-tags';
  list.setAttribute('aria-label', 'Article topics');
  tags.forEach((tag) => {
    const item = document.createElement('li');
    item.textContent = tag;
    list.append(item);
  });
  return list;
}

function createCaseMetadata(cells, limit = 2) {
  const entries = cells.map((cell) => textParts(cell))
    .filter((parts) => parts.length).slice(0, limit);
  if (!entries.length) return null;

  const metadata = document.createElement('dl');
  metadata.className = 'cards-case-metadata';
  entries.forEach(([value, label = '']) => {
    const entry = document.createElement('div');
    entry.className = 'cards-case-metadata-item';

    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    description.textContent = value;

    entry.append(term, description);
    metadata.append(entry);
  });
  return metadata;
}

function createCaseCard(row) {
  const cells = [...row.children];
  const imageCellIndex = cells.findIndex((cell) => cell.querySelector('picture img, img'));
  let titleCellIndex = -1;
  cells.forEach((cell, index) => {
    if (findTextLink(cell)) titleCellIndex = index;
  });

  const fallbackTitleIndex = cells.findIndex((cell, index) => (
    index !== imageCellIndex && textParts(cell).length
  ));
  // The two statistic cells are optional; the title remains in the third cell.
  const unlinkedTitleIndex = cells.length >= 3 ? 2 : fallbackTitleIndex;
  const resolvedTitleIndex = titleCellIndex >= 0 ? titleCellIndex : unlinkedTitleIndex;
  if (resolvedTitleIndex < 0) return null;

  const titleCell = cells[resolvedTitleIndex];
  const titleLink = findTextLink(titleCell);
  const titleText = (titleLink?.textContent || textParts(titleCell)[0] || '').trim();
  if (!titleText) return null;

  const { item, article } = createCard();

  if (imageCellIndex >= 0) {
    appendMedia(article, cells[imageCellIndex], `${titleText} case study image`);
  }

  const content = document.createElement('div');
  content.className = 'cards-case-content';

  const tagCells = cells.slice(0, resolvedTitleIndex)
    .filter((cell, index) => index !== imageCellIndex && textParts(cell).length);
  const tags = createCaseTags(tagCells);
  if (tags) content.append(tags);

  const heading = document.createElement('h3');
  heading.className = 'cards-title';
  if (titleLink) {
    const link = titleLink.cloneNode(false);
    link.className = 'cards-title-link';
    link.textContent = titleText;
    if (link.target === '_blank') link.relList.add('noopener', 'noreferrer');
    heading.append(link);
  } else {
    heading.textContent = titleText;
  }
  content.append(heading);

  const metadata = createCaseMetadata(cells.slice(resolvedTitleIndex + 1));
  if (metadata) content.append(metadata);

  article.append(content);
  return item;
}

function createServiceCard(row) {
  const cells = [...row.children];
  const index = textParts(cells[0])[0] || '';
  const title = textParts(cells[1])[0] || '';
  if (!title) return null;

  const { item, article } = createCard();
  const heading = document.createElement('div');
  heading.className = 'cards-service-heading';
  appendText(heading, 'cards-service-index', index, 'span');
  appendText(heading, 'cards-title', title, 'h3');
  article.append(heading);

  appendText(article, 'cards-service-description', textParts(cells[2]).join(' '));

  const relevanceParts = textParts(cells[3]);
  if (relevanceParts.length) {
    const relevance = document.createElement('div');
    relevance.className = 'cards-service-relevance';
    appendText(relevance, 'cards-service-relevance-label', relevanceParts[0]);
    appendText(relevance, 'cards-service-relevance-body', relevanceParts.slice(1).join(' '));
    article.append(relevance);
  }

  appendLink(article, cells[4], 'cards-service-link');

  return item;
}

/** Label/value, heading, description, optional impact. All copy stays authored. */
function createInfoCard(row) {
  const cells = [...row.children];
  const title = textParts(cells[1]).join(' ');
  if (!title) return null;
  const { item, article } = createCard();
  appendText(article, 'cards-info-label', textParts(cells[0]).join(' '));
  appendText(article, 'cards-title', title, 'h3');
  appendText(article, 'cards-info-description', textParts(cells[2]).join(' '));
  appendText(article, 'cards-info-impact', textParts(cells[3]).join(' '));
  return item;
}

/** Team member: photo (placeholder space is always reserved), name, role. */
function createTeamCard(row) {
  const cells = [...row.children];
  const name = textParts(cells[1]).join(' ');
  if (!name) return null;
  const { item, article } = createCard();
  appendMedia(article, cells[0], name, true);
  const body = document.createElement('div');
  body.className = 'cards-team-body';
  appendText(body, 'cards-title', name, 'h3');
  appendText(body, 'cards-team-role', textParts(cells[2]).join(' '));
  article.append(body);
  return item;
}

/** Panel: a heading and a short paragraph on a large rounded surface. */
function createPanelCard(row) {
  const cells = [...row.children];
  const title = textParts(cells[0]).join(' ');
  if (!title) return null;
  const { item, article } = createCard();
  appendText(article, 'cards-title', title, 'h3');
  appendText(article, 'cards-panel-description', textParts(cells[1]).join(' '));
  return item;
}

function createEditorialMetaParts(category, details) {
  if (!category && !details) return null;

  const meta = document.createElement('div');
  meta.className = 'cards-editorial-meta';
  appendText(meta, 'cards-editorial-category', category, 'span');
  appendText(meta, 'cards-editorial-details', details, 'span');
  return meta;
}

function createEditorialMeta(categoryCell, detailsCell) {
  return createEditorialMetaParts(
    textParts(categoryCell).join(' '),
    textParts(detailsCell).join(' · '),
  );
}

function createEditorialHeading(cell, headingTag = 'h3') {
  const titleLink = findTextLink(cell);
  const title = (textParts(cell).join(' ') || titleLink?.textContent || '').trim();
  if (!title) return null;

  const heading = document.createElement(headingTag);
  heading.className = 'cards-title';
  if (titleLink) {
    const fullTitleLink = titleLink.cloneNode(false);
    fullTitleLink.classList.add('cards-title-link');
    fullTitleLink.textContent = title;
    if (fullTitleLink.target === '_blank') fullTitleLink.relList.add('noopener', 'noreferrer');
    heading.append(fullTitleLink);
  } else {
    heading.textContent = title;
  }
  return { heading, title };
}

/** A single proof card authored as labelled rows, with repeated Metric rows. */
function createFeaturedCaseCard(block) {
  const rows = [...block.children];
  const fields = new Map(rows.map((row) => [
    row.firstElementChild?.textContent.trim().replace(/\s+/g, ' ').toLowerCase(),
    row.children[1],
  ]));
  const titleData = createEditorialHeading(fields.get('title'));
  if (!titleData) return null;
  const { item, article } = createCard();
  appendMedia(article, fields.get('image'), `${titleData.title} case study image`);
  const content = document.createElement('div');
  content.className = 'cards-case-content';
  appendText(content, 'cards-proof-topics', textParts(fields.get('topics')).join(' '));
  content.append(titleData.heading);
  appendText(content, 'cards-proof-summary', textParts(fields.get('summary')).join(' '));
  const metricCells = rows.filter((row) => (
    row.firstElementChild?.textContent.trim().toLowerCase() === 'metric'
  )).map((row) => row.children[1]).filter((cell) => textParts(cell).length > 1);
  const metrics = createCaseMetadata(metricCells, metricCells.length);
  if (metrics) content.append(metrics);
  appendLink(content, fields.get('link'), 'cards-proof-link');
  article.append(content);
  return item;
}

function createInsightCard(row) {
  const cells = [...row.children];
  const noImageCell = cells.length === 3
    && !cells[0].querySelector('picture img, img') && textParts(cells[0]).length > 0;
  const compact = cells.length < 5;
  const metadataIndex = noImageCell ? 0 : 1;
  const titleIndex = compact ? metadataIndex + 1 : 3;
  const titleData = createEditorialHeading(cells[titleIndex]);
  if (!titleData) return null;

  const { item, article } = createCard();
  appendMedia(article, noImageCell ? null : cells[0], `${titleData.title} article image`, true);

  const content = document.createElement('div');
  content.className = 'cards-editorial-content';
  const metadata = compact ? textParts(cells[metadataIndex]) : [];
  const meta = compact
    ? createEditorialMetaParts(metadata[0] || '', metadata.slice(1).join(' · '))
    : createEditorialMeta(cells[1], cells[2]);
  if (meta) content.append(meta);
  content.append(titleData.heading);
  appendText(content, 'cards-editorial-summary', textParts(cells[titleIndex + 1]).join(' '));
  article.append(content);
  return item;
}

function createFeaturedCard(row) {
  const cells = [...row.children];
  const compact = cells.length < 7;
  const titleData = createEditorialHeading(cells[compact ? 2 : 3], 'h2');
  if (!titleData) return null;

  const { item, article } = createCard();
  appendMedia(article, cells[0], `${titleData.title} featured article image`);

  const content = document.createElement('div');
  content.className = 'cards-editorial-content';
  const compactMeta = compact ? textParts(cells[1]) : [];
  const meta = compact
    ? createEditorialMetaParts(compactMeta[0] || '', compactMeta.slice(1).join(' · '))
    : createEditorialMeta(cells[1], cells[2]);
  if (meta) content.append(meta);
  content.append(titleData.heading);
  appendText(content, 'cards-editorial-summary', textParts(cells[compact ? 3 : 4]).join(' '));

  const authorCell = cells[compact ? 4 : 5];
  const authorParts = textParts(authorCell);
  const authorImage = authorCell?.querySelector('picture img, img');
  if (authorParts.length || authorImage) {
    const author = document.createElement('div');
    author.className = 'cards-featured-author';
    if (authorImage?.src) {
      author.append(createOptimizedPicture(
        authorImage.src,
        authorImage.getAttribute('alt')?.trim() || '',
        false,
        [{ width: '80' }],
      ));
    }
    appendText(author, 'cards-featured-author-name', authorParts.join(' '), 'span');
    content.append(author);
  }

  const ctaCell = cells[compact ? 5 : 6];
  appendLink(content, ctaCell, 'cards-featured-link');

  article.append(content);
  return item;
}

function createModelCard(row) {
  const cells = [...row.children];
  const title = textParts(cells[1])[0] || '';
  if (!title) return null;

  const { item, article } = createCard();
  appendText(article, 'cards-model-label', textParts(cells[0]).join(' '));
  appendText(article, 'cards-title', title, 'h3');
  appendText(article, 'cards-model-description', textParts(cells[2]).join(' '));

  const benefits = textParts(cells[3], false);
  if (benefits.length) {
    const list = document.createElement('ul');
    list.className = 'cards-model-benefits';
    list.setAttribute('role', 'list');
    benefits.forEach((benefit) => appendText(list, '', benefit, 'li'));
    article.append(list);
  }

  appendLink(article, cells[4], 'cards-model-link');

  return item;
}

function decorateVariant(block, buildCard, rows = [...block.children]) {
  const list = document.createElement('ul');
  list.className = 'cards-list';
  list.setAttribute('role', 'list');
  rows.forEach((row) => {
    const card = buildCard(row);
    if (card) list.append(card);
  });
  block.replaceChildren(list);
}

function decorateDefault(block) {
  const list = document.createElement('ul');
  [...block.children].forEach((row) => {
    const item = document.createElement('li');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    list.append(item);
  });
  list.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(
    createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
  ));
  block.replaceChildren(list);
}

/** Counts every number in a metric up from zero once the metric scrolls into view. */
function animateMetrics(block) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const values = block.querySelectorAll('.cards-case-metadata dd');
  if (!values.length || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach(({ target }) => {
      observer.unobserve(target);
      const text = target.textContent;
      const numbers = [...text.matchAll(/\d[\d,]*(?:\.\d+)?/g)];
      if (!numbers.length) {
        // Letters only: scramble them, then settle left to right on the real text.
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const scrambleDuration = 900;
        const scrambleBegin = performance.now();
        const scramble = (now) => {
          const done = Math.min((now - scrambleBegin) / scrambleDuration, 1);
          const settled = Math.floor(done * text.length);
          target.textContent = [...text].map((char, i) => {
            if (i < settled || !/\p{L}/u.test(char)) return char;
            const random = letters[Math.floor(Math.random() * letters.length)];
            return char === char.toUpperCase() ? random.toUpperCase() : random;
          }).join('');
          if (done < 1) requestAnimationFrame(scramble);
          else target.textContent = text;
        };
        requestAnimationFrame(scramble);
        return;
      }
      const targets = numbers.map(([match]) => Number(match.replace(/,/g, '')));
      const render = (progress) => {
        let index = 0;
        target.textContent = text.replace(/\d[\d,]*(?:\.\d+)?/g, (match) => {
          const decimals = match.includes('.') ? match.split('.')[1].length : 0;
          const value = (targets[index] * progress);
          index += 1;
          return value.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            useGrouping: match.includes(','),
          });
        });
      };
      const duration = 1200;
      const begin = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - begin) / duration, 1);
        render(1 - (1 - progress) ** 3);
        if (progress < 1) requestAnimationFrame(tick);
        else target.textContent = text;
      };
      render(0);
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  values.forEach((value) => observer.observe(value));
}

export default async function decorate(block) {
  if (block.querySelector(':scope > .cards-list, :scope > .cards-index-content')) return;
  const variant = CARD_VARIANTS.find((name) => block.classList.contains(name));

  switch (variant) {
    case 'case':
      if (block.classList.contains('featured-case')) {
        decorateVariant(block, createFeaturedCaseCard, [block]);
      } else {
        decorateVariant(block, createCaseCard);
      }
      break;
    case 'service':
      decorateVariant(block, createServiceCard);
      break;
    case 'insight':
      if (block.classList.contains('latest')) {
        const { decorateLatest } = await import('../../scripts/cards-index.js');
        await decorateLatest(block, createInsightCard);
      } else if ([...block.children].some((row) => row.children.length === 2
        && /^(queryindexlink|source)$/.test(row.firstElementChild.textContent
          .trim().toLowerCase().replace(/[^a-z0-9]/g, '')))) {
        const { default: decorateIndex } = await import('../../scripts/cards-index.js');
        await decorateIndex(block, createInsightCard);
      } else {
        decorateVariant(block, createInsightCard);
      }
      break;
    case 'featured':
      decorateVariant(block, createFeaturedCard);
      break;
    case 'model':
      decorateVariant(block, createModelCard);
      break;
    case 'challenge':
    case 'outcome':
    case 'reason':
      decorateVariant(block, createInfoCard);
      break;
    case 'panel':
      decorateVariant(block, createPanelCard);
      break;
    case 'team':
      decorateVariant(block, createTeamCard);
      break;
    default:
      decorateDefault(block);
  }
  if (variant === 'case') animateMetrics(block);
}
