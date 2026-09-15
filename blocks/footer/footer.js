import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function validLink(link) {
  const href = link.getAttribute('href')?.trim();
  if (!href || (/^https?:/i.test(href) && !/^https?:\/\/[^/\s?#]/i.test(href))) return false;
  try {
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(new URL(href, window.location).protocol);
  } catch {
    return false;
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.classList.toggle('footer-home', ['/', '/index', '/index.html'].includes(window.location.pathname));
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  let fragment;
  try {
    const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
    fragment = await loadFragment(footerPath);
  } catch {
    return;
  }
  if (!fragment) return;

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  footer.querySelectorAll('a').forEach((link) => {
    if (!validLink(link)) {
      const text = document.createElement('span');
      text.append(...link.childNodes);
      link.replaceWith(text);
    }
  });
  footer.querySelectorAll('ul').forEach((list) => list.setAttribute('role', 'list'));

  // Named sections remain stable when authors omit or reorder content.
  footer.querySelectorAll(':scope > .section').forEach((section) => {
    const heading = section.querySelector('.default-content-wrapper > h2');
    const name = heading?.textContent.trim().toLowerCase();
    const roles = ['brand', 'social', 'contacts', 'legal'];
    if (roles.includes(name)) {
      section.classList.add(`footer-${name}`);
      heading.remove();
      if (!section.textContent.trim() && !section.querySelector('img, .icon')) section.remove();
    }
  });

  footer.querySelectorAll('.footer-brand .icon-header-logo').forEach((icon) => {
    const link = icon.closest('a');
    if (link) {
      link.href = '/';
      link.setAttribute('aria-label', link.textContent.trim() || 'DevHandler home');
      link.replaceChildren(icon);
    }
  });

  // Use ordinary content in the fragment, not a nested Footer block.
  footer.querySelectorAll('.footer-social, .footer-legal').forEach((section) => {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', section.classList.contains('footer-social')
      ? 'Social media' : 'Legal');
    nav.append(...section.childNodes);
    section.append(nav);
  });

  footer.querySelectorAll('.footer-social li').forEach((item) => {
    if (!item.querySelector('a') && item.querySelector('.icon')) {
      const placeholder = document.createElement('span');
      placeholder.className = 'footer-social-placeholder';
      placeholder.append(...item.childNodes);
      item.append(placeholder);
    }
  });

  footer.querySelectorAll('.footer-social a, .footer-social-placeholder').forEach((link) => {
    const icon = link.querySelector('.icon');
    if (icon) {
      const label = document.createElement('span');
      label.className = 'footer-link-label';
      label.textContent = link.textContent.trim() || link.getAttribute('aria-label')
        || [...icon.classList].find((name) => name.startsWith('icon-footer-'))?.slice(12)
        || link.href || 'Social media';
      link.replaceChildren(icon, label);
    }
  });

  // Google Docs can split a linked address at each soft break.
  footer.querySelectorAll('.footer-contacts li > a').forEach((link) => {
    let separator = link.nextElementSibling;
    while (separator?.tagName === 'BR'
      && separator.nextElementSibling?.matches('a')
      && separator.nextElementSibling.href === link.href) {
      const continuation = separator.nextElementSibling;
      link.append(separator, ...continuation.childNodes);
      continuation.remove();
      separator = link.nextElementSibling;
    }
  });

  footer.querySelectorAll('.footer-contacts a').forEach((link) => {
    const icon = link.querySelector(':scope > .icon');
    if (icon) {
      const text = document.createElement('span');
      text.append(...[...link.childNodes].filter((node) => node !== icon));
      link.replaceChildren(icon, text);
    }
  });

  footer.querySelectorAll('a').forEach((link) => {
    link.classList.remove('button', 'primary', 'secondary');
    if (link.target === '_blank') link.relList.add('noopener', 'noreferrer');
  });
  footer.querySelectorAll('.icon img').forEach((image) => {
    image.alt = '';
  });
  footer.querySelectorAll('.icon').forEach((icon) => icon.setAttribute('aria-hidden', 'true'));

  block.append(footer);
}
