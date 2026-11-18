/*
 * Everything that needs the visitor's consent (analytics category). Only imported after opt-in,
 * or to clean up after a rejection or withdrawal. Add new tools here, never in head.html.
 */
import { loadScript } from './aem.js';

const GA_ID = 'G-MK7D7VGSZM';
const CLARITY_ID = 'u8imgeq07o';
const COOKIE_NAMES = [/^_ga/, /^_gid$/, /^_gat/, /^_clck$/, /^_clsk$/, /^CLID$/, /^ANONCHK$/, /^SM$/, /^MR$/];

let gaStarted = false;
let clarityStarted = false;

function startGoogleAnalytics() {
  window[`ga-disable-${GA_ID}`] = false;
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  if (gaStarted) return;
  gaStarted = true;
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`).catch(() => {
    gaStarted = false;
  });
}

function startClarity() {
  if (window.clarity) window.clarity('consent');
  if (clarityStarted) return;
  clarityStarted = true;
  window.clarity = window.clarity || function clarity() {
    // Clarity's queue needs the arguments object
    // eslint-disable-next-line prefer-rest-params
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  loadScript(`https://www.clarity.ms/tag/${CLARITY_ID}`).catch(() => {
    clarityStarted = false;
  });
}

export function enableAnalytics() {
  startGoogleAnalytics();
  startClarity();
}

function clearCookies() {
  const parts = window.location.hostname.split('.');
  const domains = ['', window.location.hostname];
  for (let i = 1; i < parts.length - 1; i += 1) domains.push(`.${parts.slice(i).join('.')}`);
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (!COOKIE_NAMES.some((pattern) => pattern.test(name))) return;
    domains.forEach((domain) => {
      const scope = domain ? `; domain=${domain}` : '';
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${scope}`;
    });
  });
}

export function disableAnalytics() {
  window[`ga-disable-${GA_ID}`] = true;
  if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
  if (window.clarity) window.clarity('consent', false);
  clearCookies();
}
