/*
 * First-party cookie consent (GDPR / ePrivacy). No third-party CMP.
 *
 * - Nothing non-essential loads until the visitor opts in (consented.js is imported on opt-in).
 * - The choice is stored in localStorage for 12 months, then asked again.
 * - Bump VERSION when categories or the tools behind them change to ask everybody again.
 * - Any link ending in #cookie-settings (the footer's "Cookie settings") reopens the preferences.
 * - Fires `consent.update` on window with { consented, decided, categories }.
 */
const STORAGE_KEY = 'dh-consent';
const VERSION = 1;
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
const SETTINGS_HASH = '#cookie-settings';

let memory = null; // fallback when localStorage is blocked
let current = { analytics: false };
let decided = false;
let analyticsLoaded = false;

function read() {
  let raw = memory;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY) ?? memory;
  } catch { /* storage blocked: use the in-memory copy */ }
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data.version !== VERSION || Date.now() - data.timestamp > MAX_AGE_MS) return null;
    return { analytics: data.analytics === true };
  } catch {
    return null;
  }
}

function write(categories) {
  memory = JSON.stringify({ version: VERSION, timestamp: Date.now(), ...categories });
  try {
    window.localStorage.setItem(STORAGE_KEY, memory);
  } catch { /* kept in memory for this page view only */ }
}

/** Google Consent Mode v2: everything denied until the visitor decides. */
function setConsentDefaults() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // gtag.js needs the arguments object itself, not an array
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });
}

async function apply(categories) {
  current = categories;
  if (categories.analytics) {
    analyticsLoaded = true;
    const { enableAnalytics } = await import('./consented.js');
    enableAnalytics();
    return;
  }
  // Withdrawn, rejected, or cookies left over from before this banner existed.
  if (analyticsLoaded || /(^|;\s*)(_ga|_gid|_clck|_clsk)/.test(document.cookie)) {
    const { disableAnalytics } = await import('./consented.js');
    disableAnalytics();
  }
}

function notify() {
  window.dispatchEvent(new CustomEvent('consent.update', {
    detail: { consented: current.analytics, decided, categories: { ...current } },
  }));
}

async function save(categories) {
  decided = true;
  write(categories);
  await apply(categories);
  notify();
}

async function openSettings() {
  const { openSettings: open } = await import('./consent-ui.js');
  open(current, save);
}

function init() {
  setConsentDefaults();
  document.addEventListener('click', (e) => {
    const link = e.target.closest?.('a[href]');
    if (link?.hash !== SETTINGS_HASH) return;
    e.preventDefault();
    openSettings();
  });

  const stored = read();
  if (stored) {
    decided = true;
    apply(stored).then(notify);
    return;
  }
  apply({ analytics: false }).then(notify);
  import('./consent-ui.js').then(({ showBanner }) => showBanner(save, openSettings));
}

init();
