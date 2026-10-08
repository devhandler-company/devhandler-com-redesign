import { buildBlock } from './aem.js';
import {
  loadIndex, matchingArticles, normalizeArticles, safeURL, sortArticles,
} from './blog-index.js';

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function configOf(block) {
  return Object.fromEntries([...block.children].map((row) => [
    row.firstElementChild?.textContent.toLowerCase().replace(/[^a-z0-9]/g, ''),
    row.children[1]?.querySelector('a[href]')?.getAttribute('href')
      || row.children[1]?.textContent.trim(),
  ]));
}

function cardRow(article) {
  const image = article.image ? node('img') : null;
  if (image) { image.src = article.image; image.alt = article.title; }
  const details = [];
  if (article.date) {
    const formatted = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
    }).formatToParts(article.date)
      .map((part) => (part.type === 'month' ? part.value.slice(0, 3) : part.value)).join('');
    const updated = node('p', formatted);
    updated.title = `Last updated ${formatted}`;
    details.push(updated);
  }
  if (article.readingTime) details.push(node('p', article.readingTime));
  const link = node('a', article.title);
  const articleURL = new URL(article.href);
  link.href = articleURL.origin === window.location.origin ? article.path : article.href;
  return [
    { elems: image ? [image] : [] },
    { elems: [node('p', article.category)] },
    { elems: details },
    { elems: [link] },
    { elems: [node('p', article.description)] },
  ];
}

/** One index-driven list, retaining the existing Insight card renderer. */
export default async function decorate(block, createCard) {
  if (block.querySelector(':scope > .cards-index-content')) return;
  block.classList.add('article-listing');
  const config = configOf(block);
  const source = safeURL(config.queryindexlink || config.source || '/blog/query-index.json', window.location.href);
  const requestedSize = Number(config.countofarticles || config.pagesize || 6);
  const batchSize = Number.isInteger(requestedSize) && requestedSize > 0
    ? Math.min(requestedSize, 100) : 6;
  const content = node('div', '', 'cards-index-content');
  const header = node('div', '', 'cards-index-header');
  const sort = node('button', 'Newest first', 'cards-index-sort');
  sort.type = 'button';
  sort.dataset.order = 'newest';
  sort.setAttribute('aria-label', 'Newest first. Switch to oldest first');
  let sortOrder = 'newest';
  const filters = node('div', '', 'cards-index-filters');
  filters.setAttribute('role', 'group');
  filters.setAttribute('aria-label', 'Filter articles by topic');
  header.append(filters, sort);
  const status = node('p', 'Loading articles…', 'cards-index-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  const host = node('div', '', 'cards-index-grid');
  const more = node('button', config.loadmore || 'Load more articles', 'cards-index-more button secondary');
  more.type = 'button';
  more.hidden = true;
  const retry = node('button', 'Try again', 'cards-index-retry button secondary');
  retry.type = 'button';
  retry.hidden = true;
  content.append(header, status, host, more, retry);
  block.replaceChildren(content);
  let articles = [];
  let items = [];
  let visibleCount = batchSize;
  const selected = new Set();
  const buttons = new Map();
  let matches = [];

  function render() {
    const ordered = sortArticles(articles, sortOrder);
    matches = matchingArticles(ordered, selected);
    const visible = new Set(matches.slice(0, visibleCount));
    items.forEach((item, index) => { item.hidden = !visible.has(articles[index]); });
    // DOM order also controls reading and keyboard order; CSS ordering would not.
    items[0]?.parentElement.append(...ordered.map((article) => items[articles.indexOf(article)]));
    buttons.forEach((button, key) => {
      button.setAttribute('aria-pressed', String(key ? selected.has(key) : selected.size === 0));
    });
    const shown = Math.min(visibleCount, matches.length);
    status.textContent = matches.length
      ? `Showing ${shown} of ${matches.length} articles`
      : 'No articles match these topics. Choose All articles to reset the filters.';
    if (!articles.length) status.textContent = 'No articles are available yet.';
    status.classList.toggle('cards-index-announcement', matches.length > 0);
    more.hidden = shown >= matches.length;
  }

  sort.addEventListener('click', () => {
    sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    sort.dataset.order = sortOrder;
    sort.textContent = sortOrder === 'newest' ? 'Newest first' : 'Oldest first';
    sort.setAttribute('aria-label', sortOrder === 'newest'
      ? 'Newest first. Switch to oldest first' : 'Oldest first. Switch to newest first');
    visibleCount = batchSize;
    render();
  });

  function addFilter(label, key) {
    const button = node('button', label, 'cards-index-filter');
    button.type = 'button';
    button.addEventListener('click', () => {
      if (!key) selected.clear();
      else if (selected.has(key)) selected.delete(key);
      else selected.add(key);
      visibleCount = batchSize;
      render();
    });
    buttons.set(key, button);
    filters.append(button);
  }

  more.addEventListener('click', () => {
    const previous = Math.min(visibleCount, matches.length);
    visibleCount += batchSize;
    render();
    // Move focus into the newly revealed batch, including when the button disappears.
    const firstNew = matches[previous];
    const item = items[articles.indexOf(firstNew)];
    item?.querySelector('a')?.focus();
  });

  async function load() {
    const retrying = document.activeElement === retry;
    content.setAttribute('aria-busy', 'true');
    sort.disabled = true;
    retry.hidden = true;
    status.classList.remove('cards-index-announcement');
    status.textContent = 'Loading articles…';
    try {
      if (!source) throw new Error('Invalid index URL.');
      const records = await loadIndex(source);
      articles = normalizeArticles(records, source, {
        template: config.pagetemplate, prefix: config.pathprefix || '/blog/',
      });
      const rows = buildBlock('cards', articles.map(cardRow));
      const list = node('ul', '', 'cards-list');
      list.setAttribute('role', 'list');
      items = [...rows.children].map((row) => {
        const item = createCard(row);
        const updated = row.children[2]?.querySelector('[title]');
        const details = item?.querySelector('.cards-editorial-details');
        if (updated && details) details.title = updated.title;
        return item;
      });
      if (items.some((item) => !item)) throw new Error('Article cards could not be rendered.');
      list.append(...items);
      filters.replaceChildren();
      buttons.clear();
      selected.clear();
      visibleCount = batchSize;
      addFilter('All articles', '');
      const tags = new Map();
      articles.forEach((article) => {
        article.tags.forEach((tag) => tags.set(tag.toLowerCase(), tag));
      });
      [...tags].sort((a, b) => a[1].localeCompare(b[1]))
        .forEach(([key, label]) => addFilter(label, key));
      render();
      host.replaceChildren(list);
      sort.disabled = articles.length === 0;
      if (retrying) buttons.get('')?.focus();
    } catch (error) {
      host.replaceChildren();
      filters.replaceChildren();
      more.hidden = true;
      status.textContent = 'Articles could not be loaded. Please try again.';
      retry.hidden = false;
      if (retrying) retry.focus();
      // eslint-disable-next-line no-console
      console.error('Blog index loading failed', error);
    } finally {
      content.removeAttribute('aria-busy');
    }
  }
  retry.addEventListener('click', load);
  await load();
}
