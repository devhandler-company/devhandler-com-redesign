/*
 * Cookie banner and preferences dialog. Built with DOM APIs only (Trusted Types is enforced).
 * Accept all and Reject all are the same size and weight on purpose.
 */
import { loadCSS } from './aem.js';

const COOKIE_POLICY_URL = '/privacy#tracking-technologies-and-cookies';

const CATEGORIES = [
  {
    id: 'necessary',
    title: 'Necessary',
    required: true,
    text: 'Needed for the site to work, for example to remember your cookie choice. These are always on.',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    required: false,
    text: 'Help us understand how the site is used, with Google Analytics and Microsoft Clarity (including anonymised session recordings). Off unless you allow it.',
  },
];

let banner = null;
let dialog = null;

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([name, value]) => {
    if (value === false || value === null || value === undefined) return;
    node.setAttribute(name, value === true ? '' : value);
  });
  node.append(...children);
  return node;
}

function button(label, action, variant = '') {
  return el('button', {
    type: 'button',
    class: `consent-button${variant ? ` consent-button-${variant}` : ''}`,
    'data-action': action,
  }, label);
}

function policyLink() {
  return el('a', { class: 'consent-link', href: COOKIE_POLICY_URL }, 'Cookie Policy');
}

function stylesReady() {
  return loadCSS(`${window.hlx.codeBasePath}/styles/consent.css`).catch(() => {
    /* The banner stays usable without styling. */
  });
}

function closeDialog() {
  if (!dialog) return;
  if (dialog.open) dialog.close();
  dialog.remove();
  dialog = null;
}

function decide(save, categories) {
  save(categories);
  banner?.remove();
  banner = null;
  closeDialog();
}

function buildCategory(category, checked) {
  const id = `consent-${category.id}`;
  const input = el('input', {
    type: 'checkbox',
    role: 'switch',
    class: 'consent-switch',
    id,
    name: category.id,
    checked: checked || category.required,
    disabled: category.required,
    'aria-describedby': `${id}-text`,
  });
  return el(
    'div',
    { class: 'consent-category' },
    el(
      'div',
      { class: 'consent-category-copy' },
      el('label', { class: 'consent-category-title', for: id }, category.title),
      el('p', { class: 'consent-category-text', id: `${id}-text` }, category.text),
    ),
    input,
  );
}

export async function openSettings(current, save) {
  await stylesReady();
  closeDialog();
  dialog = el('dialog', { class: 'consent consent-dialog', 'aria-labelledby': 'consent-dialog-title' });
  const close = el('button', { type: 'button', class: 'consent-close', 'aria-label': 'Close cookie settings' }, '×');
  const list = el('div', { class: 'consent-categories' }, ...CATEGORIES.map((c) => buildCategory(c, Boolean(current[c.id]))));
  const actions = el(
    'div',
    { class: 'consent-actions' },
    button('Reject all', 'reject'),
    button('Save preferences', 'save', 'ghost'),
    button('Accept all', 'accept'),
  );
  dialog.append(
    close,
    el('h2', { class: 'consent-title', id: 'consent-dialog-title' }, 'Cookie settings'),
    el('p', { class: 'consent-text' }, 'Choose which cookies we may use. You can change or withdraw your choice at any time from the Cookie settings link in the footer. More in our ', policyLink(), '.'),
    list,
    actions,
  );

  const selected = () => Object.fromEntries(
    CATEGORIES.filter((c) => !c.required).map((c) => [c.id, dialog.querySelector(`#consent-${c.id}`).checked]),
  );
  const none = Object.fromEntries(CATEGORIES.filter((c) => !c.required).map((c) => [c.id, false]));
  const all = Object.fromEntries(CATEGORIES.filter((c) => !c.required).map((c) => [c.id, true]));
  close.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeDialog(); });
  dialog.addEventListener('close', () => { dialog?.remove(); dialog = null; });
  actions.addEventListener('click', (e) => {
    const action = e.target.closest('button')?.dataset.action;
    if (action === 'reject') decide(save, none);
    if (action === 'accept') decide(save, all);
    if (action === 'save') decide(save, selected());
  });
  document.body.append(dialog);
  dialog.showModal();
}

export async function showBanner(save, customize) {
  await stylesReady();
  if (banner) return;
  const none = Object.fromEntries(CATEGORIES.filter((c) => !c.required).map((c) => [c.id, false]));
  const all = Object.fromEntries(CATEGORIES.filter((c) => !c.required).map((c) => [c.id, true]));
  banner = el(
    'section',
    { class: 'consent consent-banner', role: 'region', 'aria-label': 'Cookie consent' },
    el(
      'div',
      { class: 'consent-copy' },
      el('h2', { class: 'consent-title' }, 'Cookies and privacy'),
      el('p', { class: 'consent-text' }, 'We use necessary cookies to run this site. With your permission we also use analytics cookies to understand how it is used and to improve it. Read our ', policyLink(), '.'),
    ),
    el(
      'div',
      { class: 'consent-actions' },
      button('Reject all', 'reject'),
      button('Customize', 'customize', 'ghost'),
      button('Accept all', 'accept'),
    ),
  );
  banner.addEventListener('click', (e) => {
    const action = e.target.closest('button')?.dataset.action;
    if (action === 'reject') decide(save, none);
    if (action === 'accept') decide(save, all);
    if (action === 'customize') customize();
  });
  // First in the DOM so keyboard users reach it first; it is fixed to the bottom visually.
  document.body.prepend(banner);
}
