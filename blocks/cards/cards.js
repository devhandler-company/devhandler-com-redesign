import { createOptimizedPicture } from '../../scripts/aem.js';

const TEXT_ELEMENTS = 'p, li, h1, h2, h3, h4, h5, h6';
const CARD_VARIANTS = ['case', 'service', 'insight', 'featured', 'model'];
const CARD_MEDIA_WIDTHS = [{ width: '750' }];

function textParts(cell) {
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

  return parts.filter((part, index) => index === 0 || part !== parts[index - 1]);
}

function findTextLink(cell) {
  if (!cell) return null;
  return [...cell.querySelectorAll('a[href]')]
    .find((link) => !link.querySelector('picture, img')) || null;
}

function createCard() {
  const item = document.createElement('li');
  item.className = 'cards-item';
  const article = document.createElement('article');
  article.className = 'cards-card';
  item.append(article);
  return { item, article };
}

function appendMedia(article, cell, fallbackAlt) {
  const sourceImage = cell?.querySelector('picture img, img');
  if (!sourceImage?.src) return null;

  const media = document.createElement('div');
  media.className = 'cards-media';
  const alt = sourceImage.getAttribute('alt')?.trim() || fallbackAlt;
  media.append(createOptimizedPicture(sourceImage.src, alt, false, CARD_MEDIA_WIDTHS));
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
  if (!source) return null;

  const link = source.cloneNode(false);
  link.className = className;
  link.textContent = textParts(cell).join(' ') || source.textContent;
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

function createCaseMetadata(cells) {
  const entries = cells.map((cell) => textParts(cell)).filter((parts) => parts.length).slice(0, 2);
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
  const resolvedTitleIndex = titleCellIndex >= 0 ? titleCellIndex : fallbackTitleIndex;
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

function createEditorialHeading(cell) {
  const titleLink = findTextLink(cell);
  const title = (textParts(cell).join(' ') || titleLink?.textContent || '').trim();
  if (!title) return null;

  const heading = document.createElement('h3');
  heading.className = 'cards-title';
  if (titleLink) {
    const fullTitleLink = titleLink.cloneNode(false);
    fullTitleLink.classList.add('cards-title-link');
    fullTitleLink.textContent = title;
    heading.append(fullTitleLink);
  } else {
    heading.textContent = title;
  }
  return { heading, title };
}

function createInsightCard(row) {
  const cells = [...row.children];
  const titleData = createEditorialHeading(cells[3]);
  if (!titleData) return null;

  const { item, article } = createCard();
  appendMedia(article, cells[0], `${titleData.title} article image`);

  const content = document.createElement('div');
  content.className = 'cards-editorial-content';
  const meta = createEditorialMeta(cells[1], cells[2]);
  if (meta) content.append(meta);
  content.append(titleData.heading);
  appendText(content, 'cards-editorial-summary', textParts(cells[4]).join(' '));
  article.append(content);
  return item;
}

function createFeaturedCard(row) {
  const cells = [...row.children];
  const compact = cells.length < 7;
  const titleData = createEditorialHeading(cells[compact ? 2 : 3]);
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

  const benefits = textParts(cells[3]);
  if (benefits.length) {
    const list = document.createElement('ul');
    list.className = 'cards-model-benefits';
    benefits.forEach((benefit) => appendText(list, '', benefit, 'li'));
    article.append(list);
  }

  appendLink(article, cells[4], 'cards-model-link');

  return item;
}

function decorateVariant(block, buildCard) {
  const list = document.createElement('ul');
  list.className = 'cards-list';
  [...block.children].forEach((row) => {
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

export default function decorate(block) {
  const variant = CARD_VARIANTS.find((name) => block.classList.contains(name));

  switch (variant) {
    case 'case':
      decorateVariant(block, createCaseCard);
      break;
    case 'service':
      decorateVariant(block, createServiceCard);
      break;
    case 'insight':
      decorateVariant(block, createInsightCard);
      break;
    case 'featured':
      decorateVariant(block, createFeaturedCard);
      break;
    case 'model':
      decorateVariant(block, createModelCard);
      break;
    default:
      decorateDefault(block);
  }
}
