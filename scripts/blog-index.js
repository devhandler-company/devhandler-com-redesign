/** Index records are content, never HTML. Keep normalization independent of the DOM. */
export function safeURL(value, base) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value.trim(), base);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseTags(value) {
  if (Array.isArray(value)) return value.flatMap(parseTags);
  const source = text(value);
  if (!source) return [];
  if (source.startsWith('[')) {
    try {
      const parsed = JSON.parse(source);
      if (Array.isArray(parsed)) return parsed.flatMap(parseTags);
    } catch { /* Plain authored labels remain usable. */ }
  }
  return source.split(/[,;\n]/).map((tag) => tag.trim()).filter(Boolean);
}

function timestamp(value) {
  if (!value) return 0;
  const number = Number(value);
  let parsed = Date.parse(value);
  if (Number.isFinite(number)) parsed = number < 1e12 ? number * 1000 : number;
  return Number.isFinite(parsed) && Math.abs(parsed) <= 8.64e15 ? parsed : 0;
}

export function normalizeArticles(records, source, options = {}) {
  const prefix = options.prefix || '/blog/';
  const seen = new Set();
  return records.flatMap((record) => {
    if (!record || typeof record !== 'object') return [];
    const href = safeURL(record.path, source);
    if (!href) return [];
    const url = new URL(href);
    const path = url.pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const root = prefix.replace(/\/$/, '');
    if (url.origin !== new URL(source).origin || !path.startsWith(`${root}/`)
      || [`${root}/index`, `${root}/search`].includes(path)
      || !text(record.title) || seen.has(path)
      || (options.template && text(record.template) !== options.template)
      || /\bnoindex\b/i.test(text(record.robots))) return [];
    seen.add(path);
    const categories = parseTags(record.category);
    const tags = [...categories, ...parseTags(record.tags)];
    const uniqueTags = [...new Map(tags.map((tag) => [tag.toLowerCase(), tag])).values()];
    const date = timestamp(record.lastModified);
    const readingTime = record.readingTime || record['reading-time'] || record.readTime;
    return [{
      path,
      href,
      title: text(record.title),
      description: text(record.description),
      image: safeURL(record.image, source),
      category: categories[0] || uniqueTags[0] || '',
      tags: uniqueTags,
      date,
      readingTime: typeof readingTime === 'number' || /^\d+$/.test(text(readingTime))
        ? `${readingTime} min read` : text(readingTime),
      sortDate: date,
    }];
  }).sort((a, b) => b.sortDate - a.sortDate);
}

export function matchingArticles(articles, selected) {
  if (!selected.size) return articles;
  return articles.filter((article) => article.tags.some((tag) => selected.has(tag.toLowerCase())));
}

/** Preserve the source order for equal dates and keep undated articles last. */
export function sortArticles(articles, order = 'newest') {
  const direction = order === 'oldest' ? 1 : -1;
  return [...articles].sort((a, b) => {
    if (!a.sortDate) return b.sortDate ? 1 : 0;
    if (!b.sortDate) return -1;
    return direction * (a.sortDate - b.sortDate);
  });
}

/** Fetch every page before filtering; the default JSON response can be truncated at 1000. */
export async function loadIndex(source, fetcher = fetch) {
  const records = [];
  let offset = 0;
  let total = Infinity;
  for (let page = 0; offset < total; page += 1) {
    if (page >= 100) throw new Error('Index exceeds the supported page count.');
    const url = new URL(source);
    url.searchParams.set('limit', '1000');
    url.searchParams.set('offset', String(offset));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let payload;
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url.href, { signal: controller.signal });
      if (!response.ok) throw new Error(`Index request failed (${response.status}).`);
      // eslint-disable-next-line no-await-in-loop
      payload = await response.json();
    } finally {
      clearTimeout(timeout);
    }
    if (!Array.isArray(payload.data)) throw new Error('Index must provide a data array.');
    if (payload.offset !== undefined && Number(payload.offset) !== offset) {
      throw new Error('Index response did not honor the requested offset.');
    }
    total = payload.total === undefined ? offset + payload.data.length : Number(payload.total);
    if (!Number.isFinite(total) || total < 0) throw new Error('Invalid index total.');
    if (!payload.data.length && offset < total) throw new Error('Incomplete index response.');
    records.push(...payload.data);
    offset += payload.data.length;
  }
  return records;
}
