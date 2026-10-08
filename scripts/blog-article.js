import { buildBlock, toClassName } from './aem.js';
import { prepareBlogCTA } from './blog-page.js';
import { loadIndex, normalizeArticles, parseTags } from './blog-index.js';

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function metadata(doc, ...names) {
  return names.map((name) => doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
    ?.content.trim()).find(Boolean) || '';
}

function safeURL(value) {
  try {
    const url = new URL(value, window.location.href);
    return value && ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function publicationDate(value) {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july',
    'august', 'september', 'october', 'november', 'december'];
  const written = value.match(/^([a-z]+) (\d{1,2}), (\d{4})$/i);
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
  const parts = iso ? [Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])]
    : written && [Number(written[3]), months.indexOf(written[1].toLowerCase()), Number(written[2])];
  if (!parts || parts[1] < 0) return null;
  const date = new Date(Date.UTC(...parts));
  return date.getUTCFullYear() === parts[0] && date.getUTCMonth() === parts[1]
    && date.getUTCDate() === parts[2] ? date : null;
}

async function loadArticleMetadata(doc, info) {
  const source = safeURL(metadata(doc, 'blog-index') || '/blog/query-index.json');
  if (!source) return;
  const canonical = safeURL(doc.querySelector('link[rel="canonical"]')?.getAttribute('href'));
  const path = new URL(canonical || window.location.href).pathname.replace(/\/$/, '').replace(/\.html$/, '');
  try {
    const records = await loadIndex(source);
    const article = normalizeArticles(records, source).find((record) => record.path === path);
    if (article?.category) {
      let category = info.querySelector('.hero-article-category');
      if (!category) {
        category = element('span', '', 'hero-article-category');
        info.prepend(category);
      }
      category.textContent = article.category;
    }
    if (article?.readingTime) info.querySelector('.hero-article-reading-time').textContent = article.readingTime;
  } catch { /* Keep authored metadata and estimated reading time if the index is unavailable. */ }
}

function articleMetadata(doc, main, byline) {
  const info = element('div', '', 'hero-article-meta');
  const legacy = byline?.textContent.trim().match(/^By\s+(.+?)(?:\s*\|\s*Published\s+(.+))?$/i);
  const category = parseTags(metadata(doc, 'category'))[0]
    || [...doc.querySelectorAll('meta[property="article:tag"], meta[name="tags"]')]
      .flatMap((tag) => parseTags(tag.content))[0];
  if (category) info.append(element('span', category, 'hero-article-category'));
  const author = metadata(doc, 'author', 'article:author') || legacy?.[1];
  if (author) {
    const attribution = element('span', '', 'hero-article-author');
    const portrait = safeURL(metadata(doc, 'author-image'));
    if (portrait) {
      const image = element('img');
      image.src = portrait;
      image.alt = '';
      image.width = 40;
      image.height = 40;
      attribution.append(image);
    }
    attribution.append(element('strong', author));
    info.append(attribution);
  }
  const dateText = metadata(doc, 'publication-date', 'published-date', 'article:published_time')
    || legacy?.[2] || '';
  const date = publicationDate(dateText);
  if (date) {
    const time = element('time', new Intl.DateTimeFormat('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
    }).format(date));
    time.dateTime = date.toISOString().slice(0, 10);
    info.append(time);
  } else if (dateText) info.append(element('span', dateText));
  const copy = main.cloneNode(true);
  copy.querySelectorAll('.hero, .blog-hero, .blog-lets-talk, .cta, .blog-table-of-contents')
    .forEach((node) => node.remove());
  const minutes = Math.max(1, Math.ceil(copy.textContent.trim().split(/\s+/).filter(Boolean).length / 200));
  info.append(element('span', `${minutes} min read`, 'hero-article-reading-time'));
  loadArticleMetadata(doc, info);
  return info;
}

function breadcrumbs(title) {
  const home = element('a', 'Home');
  home.href = '/';
  const blog = element('a', 'Blog');
  blog.href = '/blog';
  return [element('p'), element('p'), element('p', title)].map((paragraph, index) => {
    if (index < 2) paragraph.append(index === 0 ? home : blog);
    return paragraph;
  });
}

/** Identify article pages independently of the legacy template shared with the listing. */
export function isBlogArticle(doc) {
  const main = doc.querySelector('main');
  return Boolean(main && (metadata(doc, 'template') === 'blog-article'
    || main.querySelector('.hero.blog.article')
    || (/^\/blog\/.+/.test(window.location.pathname)
      && main.querySelector('.blog-hero, h1'))));
}

/** Normalize old documents before EDS decoration; keep native body content and blocks. */
export function prepareBlogArticle(doc) {
  const main = doc.querySelector('main');
  if (!main || doc.body.classList.contains('blog-article-page')) return;
  doc.body.classList.add('blog-article-page');
  const legacyHero = main.querySelector('.blog-hero');
  const modernHero = main.querySelector('.hero.blog');
  modernHero?.classList.add('article');
  let heading = main.querySelector('h1');
  const title = heading?.textContent.trim() || legacyHero?.children[1]?.textContent.trim()
    || metadata(doc, 'og:title') || doc.title;
  if (!heading) heading = element('h1', title);
  const next = heading.nextElementSibling;
  const byline = next?.matches('p') && /^By\s+.{1,160}(?:\|\s*Published\s+.+)?$/i.test(next.textContent.trim())
    ? next : null;
  const info = articleMetadata(doc, main, byline);
  byline?.remove();
  if (modernHero) {
    if (!modernHero.querySelector('h1')) {
      const contentCell = [...modernHero.children].find((row) => row.firstElementChild
        ?.textContent.trim().toLowerCase() === 'content')?.children[1];
      if (contentCell) contentCell.prepend(heading);
      else modernHero.append(...buildBlock('hero', [['Content', { elems: [heading] }]]).children);
    }
    const fields = new Set([...modernHero.children].map((row) => row.firstElementChild
      ?.textContent.trim().toLowerCase()));
    const rows = [];
    if (!fields.has('breadcrumbs')) rows.push(['Breadcrumbs', { elems: breadcrumbs(title) }]);
    if (!fields.has('metadata')) rows.push(['Metadata', { elems: [info] }]);
    const extra = buildBlock('hero', rows);
    modernHero.append(...extra.children);
  } else {
    const content = [heading];
    const description = metadata(doc, 'description', 'og:description');
    if (description) content.push(element('p', description));
    const rows = [
      ['Breadcrumbs', { elems: breadcrumbs(title) }],
      ['Content', { elems: content }],
      ['Metadata', { elems: [info] }],
    ];
    const cover = legacyHero?.querySelector('picture');
    if (cover) rows.push(['Image', { elems: [cover] }]);
    const hero = buildBlock('hero', rows);
    hero.classList.add('blog', 'article');
    const section = element('div');
    section.append(hero);
    if (legacyHero) legacyHero.replaceWith(hero);
    else main.prepend(section);
    const heroSection = hero.closest('main > div');
    // An old document can put its hero and body in the same section.
    if (heroSection.children.length > 1) {
      hero.before(section);
      section.append(hero);
      main.prepend(section);
    } else main.prepend(heroSection);
  }
  main.querySelectorAll('.blog-table-of-contents').forEach((toc) => toc.remove());
  prepareBlogCTA(main);
  [...main.children].forEach((section) => {
    if (!section.textContent.trim() && !section.querySelector('img, iframe')) section.remove();
    else if (!section.querySelector('.hero.blog.article, .cta')) section.classList.add('blog-article-section');
  });
}

function decorateFigures(article) {
  article.querySelectorAll('.default-content-wrapper > p').forEach((paragraph) => {
    const picture = paragraph.querySelector('picture');
    if (!picture || paragraph.textContent.trim() || paragraph.children.length !== 1) return;
    const caption = paragraph.nextElementSibling;
    const figure = element('figure');
    figure.append(picture);
    if (caption?.matches('p') && /^Figure\s*[:\d]/i.test(caption.textContent.trim())) {
      const text = element('figcaption');
      text.append(...caption.childNodes);
      figure.append(text);
      caption.remove();
    }
    paragraph.replaceWith(figure);
  });
}

/** Older documents author bullets as dash-prefixed paragraphs instead of native lists. */
function decorateLegacyLists(article) {
  article.querySelectorAll('.default-content-wrapper').forEach((wrapper) => {
    let list;
    [...wrapper.children].forEach((paragraph) => {
      const text = paragraph.firstChild;
      if (!paragraph.matches('p') || text?.nodeType !== Node.TEXT_NODE
        || !/^\s*[–—-]\s+/.test(text.textContent)) { list = undefined; return; }
      if (!list) {
        list = element('ul');
        paragraph.before(list);
      }
      text.textContent = text.textContent.replace(/^\s*[–—-]\s+/, '');
      const item = element('li');
      item.append(...paragraph.childNodes);
      list.append(item);
      paragraph.remove();
    });
  });
}

function sharePanel(doc) {
  const share = element('div', '', 'blog-article-share');
  share.append(element('p', 'Share'));
  const actions = element('div', '', 'blog-article-share-actions');
  const canonical = safeURL(doc.querySelector('link[rel="canonical"]')?.getAttribute('href'))
    || window.location.href.split('#')[0];
  const url = encodeURIComponent(canonical);
  const destinations = [
    ['LinkedIn', 'linkedin', `https://www.linkedin.com/sharing/share-offsite/?url=${url}`],
    ['X', 'x', `https://twitter.com/intent/tweet?url=${url}`],
    ['Facebook', 'facebook', `https://www.facebook.com/sharer/sharer.php?u=${url}`],
  ];
  destinations.forEach(([name, icon, href]) => {
    const link = element('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Share on ${name}`);
    const image = element('img');
    image.src = `${window.hlx.codeBasePath}/icons/footer-${icon}.svg`;
    image.alt = '';
    link.append(image);
    actions.append(link);
  });
  const copy = element('button');
  const icon = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('width', '24');
  icon.setAttribute('height', '24');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '1.5');
  icon.setAttribute('aria-hidden', 'true');
  const path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2');
  icon.append(path);
  copy.append(icon);
  copy.type = 'button';
  copy.setAttribute('aria-label', 'Copy article link');
  const status = element('span', '', 'blog-article-share-status');
  status.setAttribute('role', 'status');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(canonical);
      status.textContent = 'Link copied';
    } catch {
      const link = element('a', 'Copy this article URL');
      link.href = canonical;
      status.replaceChildren(link);
    }
  });
  actions.append(copy);
  share.append(actions, status);
  return share;
}

/** Assemble decorated sections without changing the EDS block loading contract. */
export function decorateBlogArticle(doc) {
  const main = doc.querySelector('main');
  if (!doc.body.classList.contains('blog-article-page') || main.querySelector('.blog-article-layout')) return;
  const sections = [...main.querySelectorAll(':scope > .blog-article-section')];
  if (!sections.length) return;
  const layout = element('div', '', 'blog-article-layout');
  const article = element('article', '', 'blog-article-content');
  article.setAttribute('aria-label', 'Article content');
  sections[0].before(layout);
  article.append(...sections);
  decorateFigures(article);
  decorateLegacyLists(article);
  article.querySelectorAll('.table-wrapper').forEach((wrapper) => {
    wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', wrapper.closest('.section')?.querySelector('h2')?.textContent.trim()
      || 'Article table');
  });
  const aside = element('aside', '', 'blog-article-sidebar');
  aside.setAttribute('aria-label', 'Article navigation and sharing');
  const sticky = element('div', '', 'blog-article-sidebar-inner');
  const headings = [...article.querySelectorAll('.default-content-wrapper h2')];
  if (headings.length) {
    const contents = element('details', '', 'blog-article-toc');
    const summary = element('summary', 'Contents', 'blog-article-toc-label');
    const desktop = window.matchMedia('(min-width: 900px)');
    const syncContents = () => {
      contents.open = desktop.matches;
      summary.tabIndex = desktop.matches ? -1 : 0;
    };
    summary.addEventListener('click', (event) => {
      if (desktop.matches) event.preventDefault();
    });
    desktop.addEventListener('change', syncContents);
    syncContents();
    const nav = element('nav');
    nav.setAttribute('aria-label', 'Contents');
    const list = element('ol');
    const used = new Set([...doc.querySelectorAll('[id]')].map((node) => node.id));
    const links = headings.map((heading) => {
      if (!heading.id || doc.getElementById(heading.id) !== heading) {
        const base = toClassName(heading.textContent.trim()) || 'section';
        let id = base;
        let index = 2;
        while (used.has(id)) { id = `${base}-${index}`; index += 1; }
        heading.id = id;
        used.add(id);
      }
      const link = element('a', heading.textContent.trim());
      link.href = `#${encodeURIComponent(heading.id)}`;
      link.addEventListener('click', () => {
        if (desktop.matches) return;
        contents.open = false;
        heading.tabIndex = -1;
        window.requestAnimationFrame(() => heading.focus({ preventScroll: true }));
      });
      const item = element('li');
      item.append(link);
      list.append(item);
      return link;
    });
    const update = () => {
      const offset = parseFloat(getComputedStyle(doc.documentElement).getPropertyValue('--nav-height')) || 76;
      let active = 0;
      headings.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= offset + 48) active = index;
      });
      if (window.scrollY > 0
        && window.scrollY + window.innerHeight >= doc.documentElement.scrollHeight - 4) {
        active = headings.length - 1;
      }
      links.forEach((link, index) => {
        if (index === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    let scheduled = false;
    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => { update(); scheduled = false; });
    }, { passive: true });
    window.addEventListener('resize', update);
    const observer = new MutationObserver(update);
    observer.observe(article, { subtree: true, attributes: true, attributeFilter: ['style', 'data-section-status'] });
    update();
    nav.append(list);
    contents.append(summary, nav);
    sticky.append(contents);
  }
  sticky.append(sharePanel(doc));
  const cta = element('div', '', 'blog-article-contact');
  cta.append(element('h2', 'Talk to an expert'), element('p', 'Discuss your AEM goals with our team.'));
  const contact = element('a', 'Book a free AEM audit', 'button');
  contact.href = '/contact-us';
  cta.append(contact);
  sticky.append(cta);
  aside.append(sticky);
  const mobileAudit = element('div', '', 'blog-article-mobile-audit');
  const auditLink = element('a', 'Book a free AEM audit', 'button');
  auditLink.href = contact.href;
  mobileAudit.append(auditLink);
  layout.append(article, aside, mobileAudit);
}
