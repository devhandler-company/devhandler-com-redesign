import { buildBlock } from './aem.js';

function labeledFields(block) {
  return new Map([...block.children].map((row) => [
    row.firstElementChild?.textContent.trim().toLowerCase(), row.children[1],
  ]));
}

function element(tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
}

/** Shared migration for the authored legacy CTA on listing and article pages. */
export function prepareBlogCTA(main) {
  main.querySelectorAll('.blog-lets-talk').forEach((legacy) => {
    const fields = labeledFields(legacy);
    const content = document.createElement('div');
    const heading = document.createElement('h2');
    ['headline', 'highlighted-text'].forEach((name) => {
      const value = fields.get(name)?.textContent.trim();
      if (!value) return;
      if (heading.hasChildNodes()) heading.append(document.createElement('br'));
      heading.append(document.createTextNode(value));
    });
    if (heading.hasChildNodes()) content.append(heading);
    const copy = fields.get('text')?.textContent.trim();
    if (copy) content.append(element('p', copy));
    fields.get('button')?.querySelectorAll('a[href]').forEach((link) => {
      const paragraph = document.createElement('p');
      const strong = document.createElement('strong');
      strong.append(link);
      paragraph.append(strong);
      content.append(paragraph);
    });
    const cta = buildBlock('cta', { elems: [...content.children] });
    legacy.replaceWith(cta);
  });
}

/** Migrate the existing listing's document contracts without affecting article pages. */
export default function prepareBlogPage(doc) {
  doc.body.classList.add('blog-listing-page');
  const main = doc.querySelector('main');
  main.querySelectorAll(':scope > div').forEach((section) => {
    if (!section.children.length && !section.textContent.trim()) section.remove();
  });
  main.querySelectorAll('.blog-hero').forEach((legacy) => {
    const cells = [...legacy.children].map((row) => row.firstElementChild);
    const title = cells[2]?.textContent.trim() || 'Blog';
    const home = element('a', 'Home');
    home.href = '/';
    const hero = buildBlock('hero', [
      ['Breadcrumbs', { elems: [home, element('p', 'Blog')] }],
      ['Eyebrow', { elems: [element('p', cells[1]?.textContent.trim() || 'Blog')] }],
      ['Content', { elems: [element('h1', title), element('p', cells[3]?.textContent.trim() || '')] }],
    ]);
    hero.classList.add('blog');
    legacy.replaceWith(hero);
  });
  main.querySelectorAll('.blog-cards.mobile-hidden').forEach((duplicate) => {
    const fields = labeledFields(duplicate);
    const first = duplicate.parentElement.querySelector('.blog-cards:not(.mobile-hidden)');
    if (first && fields.get('queryindexlink')?.textContent.trim()
      === labeledFields(first).get('queryindexlink')?.textContent.trim()) duplicate.remove();
  });
  main.querySelectorAll('.blog-cards').forEach((legacy) => {
    legacy.classList.remove('blog-cards', 'mobile-hidden');
    legacy.classList.add('cards', 'insight');
  });
  prepareBlogCTA(main);
}
