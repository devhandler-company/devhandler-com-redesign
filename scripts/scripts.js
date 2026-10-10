import {
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  buildBlock,
  toClassName,
} from './aem.js';
import { isBlogArticle, prepareBlogArticle, decorateBlogArticle } from './blog-article.js';

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  const innerTT = window.trustedTypes.createPolicy('tt-inner', {
    createHTML: (s) => s, // avoid stack overflow
  });

  window.trustedTypes.createPolicy('default', {
    createHTML: (input, type, sink) => {
      let processedInput = input;
      if (/srcdoc\s*=/i.test(processedInput)) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('iframe[srcdoc]').forEach((el) => el.removeAttribute('srcdoc'));
        processedInput = doc.body.innerHTML;
      }
      if (sink.includes('createContextualFragment') || sink.includes('Document write')) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('script').forEach((el) => el.remove());
        processedInput = doc.body.innerHTML;
      }
      return processedInput;
    },
    createScriptURL: (input) => input,
    createScript: (input) => input,
  });
}

/**
 * Load font definitions and optionally warm the faces needed before first paint.
 */
async function loadFonts(faces = []) {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  await Promise.all(faces.map((font) => document.fonts.load(font)));
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Turns `/widgets/...` links into widget blocks.
 * @param {Element} main The container element
 */
function buildWidgetAutoBlocks(main) {
  const widgetLinks = [...main.querySelectorAll('a[href*="/widgets/"]')];
  widgetLinks.forEach((link) => {
    if (link.closest('.widget')) return;
    const newLink = link.cloneNode(true);
    const widgetBlock = buildBlock('widget', { elems: [newLink] });
    const p = link.closest('p');
    if (
      p
      && p.querySelectorAll('a').length === 1
      && p.querySelector('a') === link
      && p.textContent.trim() === link.textContent.trim()
    ) {
      p.replaceWith(widgetBlock);
    } else {
      link.replaceWith(widgetBlock);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }
    buildWidgetAutoBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Applies a section's authored metadata — delivered as data-* attributes directly on the
 * section by the rendering pipeline, not as a nested block — to classes and CSS custom
 * properties on the section.
 * @param {Element} main The container element
 */
function decorateSectionMetadata(main) {
  main.querySelectorAll(':scope > .section').forEach((section) => {
    const { dataset } = section;
    if (dataset.style) {
      dataset.style.split(',').forEach((value) => section.classList.add(toClassName(value.trim())));
    }
    if (dataset.grid) {
      section.classList.add('grid');
      section.style.setProperty('--section-grid-columns', dataset.grid.trim());
    }
    if (dataset.id && ['home-page', 'services-page', 'our-work-page', 'service-detail-page', 'case-study-page']
      .some((name) => document.body.classList.contains(name))) {
      section.id = dataset.id.trim();
    }
    Object.keys(dataset).forEach((key) => {
      if (['sectionStatus', 'style', 'grid'].includes(key)) return;
      const value = dataset[key];
      if (value) section.classList.add(`${toClassName(key)}-${toClassName(value)}`);
    });
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateSectionMetadata(main);
  if (document.body.classList.contains('home-page')) {
    const picture = main.querySelector('.home-office picture');
    const image = picture?.querySelector('img');
    if (image) {
      picture.querySelectorAll('source').forEach((source) => source.remove());
      image.removeAttribute('srcset');
      image.removeAttribute('sizes');
      image.src = `${window.hlx.codeBasePath}/icons/office-map.svg`;
      image.width = 1440;
      image.height = 952;
      image.loading = 'lazy';
    }
  }
  decorateBlocks(main);
  decorateButtons(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  if (doc.querySelector('main .hero.home')) doc.body.classList.add('home-page');
  const visualTemplate = ['home-page', 'services-page', 'our-work-page', 'case-study-page']
    .find((name) => doc.body.classList.contains(name));
  if (visualTemplate) {
    ['ample-alt-bold.otf', 'hind-regular.woff2', 'hind-semibold.woff2'].forEach((file) => {
      const preload = doc.createElement('link');
      preload.rel = 'preload';
      preload.as = 'font';
      preload.crossOrigin = 'anonymous';
      preload.href = `${window.hlx.codeBasePath}/fonts/${file}`;
      doc.head.append(preload);
    });
    const caseHero = visualTemplate === 'case-study-page' && doc.querySelector('main .hero.case');
    if (caseHero) {
      const preload = doc.createElement('link');
      preload.rel = 'modulepreload';
      preload.href = `${window.hlx.codeBasePath}/blocks/hero/hero.js`;
      doc.head.append(preload);
    }
    const pageStyle = visualTemplate.replace('-page', '');
    await Promise.all([
      ...['default', 'page-layout', pageStyle].map((name) => loadCSS(`${window.hlx.codeBasePath}/styles/${name}.css`)
        .catch(() => { /* Preserve readable content if styling is unavailable. */ })),
      ...(caseHero ? [loadCSS(`${window.hlx.codeBasePath}/blocks/hero/hero.css`)
        .catch(() => { /* Keep the authored hero readable without block styling. */ })] : []),
      loadFonts(['700 1em ample-alt', '400 1em hind', '600 1em hind'])
        .catch(() => { /* Keep readable fallback text when a font is unavailable. */ }),
    ]);
  }
  const blogArticle = isBlogArticle(doc);
  if (blogArticle) {
    prepareBlogArticle(doc);
    await Promise.all([
      loadCSS(`${window.hlx.codeBasePath}/styles/blog-article.css`).catch(() => {
        /* Preserve readable article content when styling is unavailable. */
      }),
      loadFonts(['700 1em ample-alt', '400 1em hind', '600 1em hind', '700 1em hind'])
        .catch(() => { /* Keep the fallback when an article font is unavailable. */ }),
    ]);
  }
  if (!blogArticle && (doc.querySelector('main .hero.blog, main .blog-cards')
    || (/^\/blog\/?$/.test(window.location.pathname) && doc.querySelector('main .cards.insight')))) {
    const { default: prepareBlogPage } = await import('./blog-page.js');
    prepareBlogPage(doc);
    await loadCSS(`${window.hlx.codeBasePath}/styles/blog.css`).catch(() => {
      /* Keep the authored Blog content readable if page styling fails. */
    });
  }
  const defaultBackground = loadCSS(`${window.hlx.codeBasePath}/styles/default.css`).catch(() => {
    /* Preserve readable content if the page stylesheet is unavailable. */
  });
  await defaultBackground;
  if (doc.body.classList.contains('service-detail-page')) {
    const firstSection = doc.querySelector('main > div');
    const firstBlocks = ['hero', 'stats'].filter((name) => firstSection?.querySelector(`.${name}`));
    firstBlocks.forEach((name) => {
      const preload = doc.createElement('link');
      preload.rel = 'modulepreload';
      preload.href = `${window.hlx.codeBasePath}/blocks/${name}/${name}.js`;
      doc.head.append(preload);
    });
    const fonts = loadFonts(['700 1em ample-alt', '400 1em hind', '600 1em hind'])
      .catch(() => { /* Preserve the normal fallback if a font request fails. */ });
    await Promise.all([
      fonts,
      loadCSS(`${window.hlx.codeBasePath}/styles/service-detail.css`).catch(() => {
        /* Preserve readable content if the page stylesheet is unavailable. */
      }),
      ...firstBlocks.map((name) => loadCSS(`${window.hlx.codeBasePath}/blocks/${name}/${name}.css`)
        .catch(() => { /* Keep content readable when block styling is unavailable. */ })),
    ]);
  }
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    if (blogArticle) decorateBlogArticle(doc);
    // The article's unsectioned sidebar must not paint above a still-hidden hero.
    if (!blogArticle) document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), (section) => {
      // The mobile case starts with text; its phone sits below the first viewport.
      const mobileCase = doc.body.classList.contains('case-study-page')
        && !window.matchMedia('(min-width: 900px)').matches;
      return mobileCase ? undefined : waitForFirstImage(section);
    });
    if (blogArticle) document.body.classList.add('appear');
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('body > header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('body > footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  import('./consent-check.js');
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
