import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');
const mediaChangeRegistrationKey = Symbol.for('devhandler.header.mediaChangeRegistration');
const scrollRegistrationKey = Symbol.for('devhandler.header.scrollRegistration');

function setSubmenuExpanded(item, expanded) {
  const toggle = item.querySelector(':scope > .nav-submenu-toggle');
  if (!toggle) return;

  item.dataset.expanded = String(expanded);
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute(
    'aria-label',
    `${expanded ? 'Close' : 'Open'} ${toggle.dataset.label} submenu`,
  );
}

function closeSubmenus(root, exception = null) {
  if (!root) return;
  root.querySelectorAll('.nav-drop[data-expanded="true"]').forEach((item) => {
    if (item !== exception) setSubmenuExpanded(item, false);
  });
}

function setBodyScrollLocked(nav, locked) {
  if (locked) {
    if (nav.dataset.bodyOverflowY === undefined) {
      nav.dataset.bodyOverflowY = document.body.style.overflowY;
    }
    document.body.style.overflowY = 'hidden';
  } else if (nav.dataset.bodyOverflowY !== undefined) {
    if (document.body.style.overflowY === 'hidden') {
      document.body.style.overflowY = nav.dataset.bodyOverflowY;
    }
    delete nav.dataset.bodyOverflowY;
  }
}

function setMenuExpanded(nav, expanded) {
  const menuButton = nav.querySelector('.nav-hamburger button');
  const mobileExpanded = expanded && !isDesktop.matches;

  nav.dataset.expanded = String(mobileExpanded);
  menuButton.setAttribute('aria-expanded', String(mobileExpanded));
  menuButton.setAttribute('aria-label', mobileExpanded ? 'Close navigation' : 'Open navigation');
  const navWrapper = nav.closest('.nav-wrapper');
  if (navWrapper) {
    navWrapper.classList.toggle('nav-menu-expanded', mobileExpanded);
    if (mobileExpanded) {
      if (navWrapper.dataset.menuTop === undefined) {
        navWrapper.dataset.menuTop = navWrapper.style.top;
      }
      navWrapper.style.top = '0px';
    } else if (navWrapper.dataset.menuTop !== undefined) {
      navWrapper.style.top = navWrapper.dataset.menuTop;
      delete navWrapper.dataset.menuTop;
    }
  }
  setBodyScrollLocked(nav, mobileExpanded);

  if (!mobileExpanded) closeSubmenus(nav);
}

function createLogoLink() {
  const link = document.createElement('a');
  const image = document.createElement('img');

  link.href = '/';
  image.src = '/icons/header-logo.svg';
  image.alt = '';
  link.append(image);
  return link;
}

function decorateBrand(navBrand, navigationSections) {
  const logoIcons = navigationSections
    .flatMap((section) => [...section.querySelectorAll('.icon-header-logo')]);
  const logoItems = logoIcons.map((icon) => icon.closest('li')).filter(Boolean);
  const logoIcon = navBrand.querySelector('.icon-header-logo') || logoIcons[0];
  const authoredLogoLink = logoIcon?.closest('a');
  const brandContainer = navBrand.querySelector('.default-content-wrapper') || navBrand;
  const logoLink = authoredLogoLink || navBrand.querySelector('a') || createLogoLink();

  brandContainer.replaceChildren(logoLink);
  logoItems.forEach((item) => item.remove());

  logoLink.className = 'nav-logo-link';
  logoLink.setAttribute('aria-label', 'DevHandler home');
  let logoImage = logoLink.querySelector('img');
  if (!logoImage) {
    logoImage = document.createElement('img');
    logoLink.replaceChildren(logoImage);
  }
  logoImage.src = '/icons/header-logo.svg';
  logoImage.alt = '';
  logoImage.width = 163;
  logoImage.height = 36;
  logoImage.loading = 'eager';
  logoImage.decoding = 'async';
}

function ensureSafeLinks(nav) {
  const currentUrl = new URL(window.location.href);

  nav.querySelectorAll('a').forEach((link) => {
    if (link.target === '_blank') link.relList.add('noopener', 'noreferrer');

    const linkUrl = new URL(link.href, window.location.href);
    if (linkUrl.origin === currentUrl.origin && linkUrl.pathname === currentUrl.pathname) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

function createSubmenuToggle(item, submenu, index, variant) {
  const directLink = item.querySelector(':scope > a');
  const label = directLink?.textContent.trim()
    || [...item.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent.trim())
      .join(' ')
      .trim()
    || `Navigation item ${index + 1}`;
  const toggle = document.createElement('button');
  const icon = document.createElement('span');
  const submenuId = `nav-${variant}-submenu-${index + 1}`;

  item.classList.add('nav-drop');
  item.dataset.expanded = 'false';
  submenu.id = submenuId;

  toggle.type = 'button';
  toggle.className = 'nav-submenu-toggle';
  toggle.dataset.label = label;
  toggle.setAttribute('aria-controls', submenuId);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', `Open ${label} submenu`);

  if (!directLink) {
    [...item.childNodes]
      .filter((node) => node !== submenu && node.nodeType === Node.TEXT_NODE)
      .forEach((node) => node.remove());
    const text = document.createElement('span');
    text.className = 'nav-submenu-label';
    text.textContent = label;
    toggle.append(text);
  }

  icon.className = 'nav-submenu-icon';
  icon.setAttribute('aria-hidden', 'true');
  toggle.append(icon);
  item.insertBefore(toggle, submenu);
}

function removeEmptyDuplicateLinks(navSections) {
  navSections.querySelectorAll('li > a[href]').forEach((link) => {
    const duplicate = link.nextElementSibling;
    const hasAccessibleContent = link.textContent.trim()
      || link.querySelector('img, svg, .icon')
      || link.getAttribute('aria-label');

    if (!hasAccessibleContent
      && duplicate?.matches('a[href]')
      && duplicate.href === link.href) {
      link.remove();
    }
  });
}

function decorateNavigation(navSections, navTools, variant) {
  if (!navSections) return;

  removeEmptyDuplicateLinks(navSections);

  let toolsList = navTools.querySelector('ul');
  let actionIndex = toolsList?.children.length || 0;
  const items = [...navSections.querySelectorAll(':scope .default-content-wrapper > ul > li')];

  items.forEach((item, index) => {
    const emphasized = item.querySelector(':scope > strong');
    const actionLink = emphasized?.querySelector(':scope > a');

    if (actionLink) {
      if (!toolsList) {
        toolsList = document.createElement('ul');
        navTools.append(toolsList);
      }
      emphasized.replaceWith(actionLink);
      item.classList.add('nav-action');
      actionLink.classList.add('nav-action-link');
      actionLink.classList.add(actionIndex === 0 ? 'nav-action-primary' : 'nav-action-secondary');
      toolsList.append(item);
      actionIndex += 1;
      return;
    }

    item.classList.add('nav-item');
    const submenu = item.querySelector(':scope > ul');
    if (submenu) createSubmenuToggle(item, submenu, index, variant);
  });
}

function handleNavKeydown(event, nav) {
  if (event.code === 'Escape') {
    const expandedItem = nav.querySelector('.nav-drop[data-expanded="true"]');
    if (expandedItem) {
      const toggle = expandedItem.querySelector(':scope > .nav-submenu-toggle');
      setSubmenuExpanded(expandedItem, false);
      toggle.focus();
    } else if (!isDesktop.matches && nav.dataset.expanded === 'true') {
      setMenuExpanded(nav, false);
      nav.querySelector('.nav-hamburger button').focus();
    }
    return;
  }

  const toggle = event.target.closest('.nav-submenu-toggle');
  if (toggle && event.code === 'ArrowDown') {
    event.preventDefault();
    const item = toggle.closest('.nav-drop');
    closeSubmenus(nav, item);
    setSubmenuExpanded(item, true);
    item.querySelector(':scope > ul a, :scope > ul button')?.focus();
  }
}

function bindNavigation(nav) {
  const menuButton = nav.querySelector('.nav-hamburger button');

  menuButton.addEventListener('click', () => {
    const expanded = nav.dataset.expanded === 'true';
    setMenuExpanded(nav, !expanded);
  });

  nav.addEventListener('click', (event) => {
    const toggle = event.target.closest('.nav-submenu-toggle');
    if (!toggle) return;

    const item = toggle.closest('.nav-drop');
    const expanded = item.dataset.expanded === 'true';
    closeSubmenus(nav, item);
    setSubmenuExpanded(item, !expanded);
  });

  nav.addEventListener('keydown', (event) => handleNavKeydown(event, nav));
  nav.addEventListener('focusout', (event) => {
    if (!nav.contains(event.relatedTarget)) {
      closeSubmenus(nav);
      if (!isDesktop.matches) setMenuExpanded(nav, false);
    }
  });
}

function bindScrollBehavior(block, navWrapper, nav) {
  let animationFrame = 0;
  let lastScrollTop = Math.max(window.scrollY, 0);

  const update = () => {
    animationFrame = 0;

    const scrollTop = Math.max(window.scrollY, 0);
    const headerHeight = nav.offsetHeight;
    const pastHeader = scrollTop > headerHeight;
    const compact = scrollTop > document.documentElement.clientHeight;

    navWrapper.classList.toggle('nav-scroll-transition', pastHeader);
    navWrapper.classList.toggle('nav-compact', compact);

    if (nav.dataset.expanded === 'true' && !isDesktop.matches) {
      navWrapper.style.top = '0px';
    } else if (!pastHeader) {
      navWrapper.style.top = `${-scrollTop}px`;
    } else if (scrollTop > lastScrollTop) {
      navWrapper.style.top = `${-headerHeight}px`;
    } else {
      navWrapper.style.top = compact ? '24px' : '0px';
    }

    lastScrollTop = scrollTop;
  };

  const scheduleUpdate = () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  update();

  block[scrollRegistrationKey] = () => {
    window.removeEventListener('scroll', scheduleUpdate);
    window.removeEventListener('resize', scheduleUpdate);
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
  };
}

function getNavigationList(row) {
  return row?.querySelector(':scope > .default-content-wrapper > ul');
}

function getNavigationMarkers(row) {
  const wrapper = row.querySelector(':scope > .default-content-wrapper') || row;
  return [...wrapper.children].filter((child) => {
    if (!child.matches('h1, h2, h3, h4, h5, h6, p')) return false;
    const label = child.textContent.trim().toLowerCase();
    return label === 'desktop navigation' || label === 'mobile navigation';
  });
}

function getNavigationMarker(row) {
  return getNavigationMarkers(row)[0];
}

function getNavigationVariant(row) {
  if (row.classList.contains('desktop-navigation')) return 'desktop';
  if (row.classList.contains('mobile-navigation')) return 'mobile';

  const label = getNavigationMarker(row)?.textContent.trim().toLowerCase();
  if (label === 'desktop navigation') return 'desktop';
  if (label === 'mobile navigation') return 'mobile';
  return null;
}

function cloneNavigationRange(row, firstMarker, nextMarker = null) {
  const sourceWrapper = row.querySelector(':scope > .default-content-wrapper') || row;
  const sourceChildren = [...sourceWrapper.children];
  const firstIndex = sourceChildren.indexOf(firstMarker);
  const nextIndex = nextMarker ? sourceChildren.indexOf(nextMarker) : sourceChildren.length;
  const clone = row.cloneNode(true);
  const cloneWrapper = clone.querySelector(':scope > .default-content-wrapper') || clone;

  [...cloneWrapper.children].forEach((child, index) => {
    const isSeparator = child.textContent.trim() === '---';
    if (index < firstIndex || index >= nextIndex || isSeparator) child.remove();
  });

  return clone;
}

function splitCombinedNavigation(row) {
  const markers = getNavigationMarkers(row);
  const desktopMarker = markers.find(
    (marker) => marker.textContent.trim().toLowerCase() === 'desktop navigation',
  );
  const mobileMarker = markers.find(
    (marker) => marker.textContent.trim().toLowerCase() === 'mobile navigation',
  );

  if (!desktopMarker || !mobileMarker) return null;

  const desktopSections = cloneNavigationRange(row, desktopMarker, mobileMarker);
  const mobileSections = cloneNavigationRange(row, mobileMarker);
  if (!getNavigationList(desktopSections) || !getNavigationList(mobileSections)) return null;

  return { desktopSections, mobileSections };
}

function resolveNavigation(navRows) {
  const navigationRows = navRows.filter((row) => getNavigationList(row));
  const combinedSource = navigationRows.find((row) => getNavigationMarkers(row).length > 1);
  const combinedNavigation = combinedSource && splitCombinedNavigation(combinedSource);

  if (combinedNavigation) {
    const { desktopSections, mobileSections } = combinedNavigation;
    getNavigationMarker(desktopSections)?.remove();
    getNavigationMarker(mobileSections)?.remove();
    return { desktopSections, mobileSections, sourceRows: navigationRows };
  }

  const unlabelledRows = navigationRows.filter((row) => !getNavigationVariant(row));
  const desktopSource = navigationRows.find((row) => getNavigationVariant(row) === 'desktop')
    || unlabelledRows[0]
    || navigationRows[0];
  const mobileSource = navigationRows.find((row) => getNavigationVariant(row) === 'mobile')
    || unlabelledRows.find((row) => row !== desktopSource)
    || desktopSource;

  if (!desktopSource) return {};

  const desktopSections = desktopSource;
  const mobileSections = mobileSource === desktopSource
    ? desktopSource.cloneNode(true)
    : mobileSource;

  getNavigationMarker(desktopSections)?.remove();
  getNavigationMarker(mobileSections)?.remove();

  return {
    desktopSections,
    mobileSections,
    sourceRows: navigationRows,
  };
}

/**
 * Loads and decorates the authored navigation fragment.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const existingNav = block.querySelector('nav');
  if (existingNav) setMenuExpanded(existingNav, false);

  const previousMediaRegistration = block[mediaChangeRegistrationKey];
  if (previousMediaRegistration) {
    previousMediaRegistration.mediaQuery.removeEventListener(
      'change',
      previousMediaRegistration.handler,
    );
    delete block[mediaChangeRegistrationKey];
  }

  const previousScrollRegistration = block[scrollRegistrationKey];
  if (previousScrollRegistration) {
    previousScrollRegistration();
    delete block[scrollRegistrationKey];
  }

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const navRows = [...nav.children];
  const { desktopSections, mobileSections, sourceRows = [] } = resolveNavigation(navRows);
  const firstNavigationIndex = sourceRows.length
    ? Math.min(...sourceRows.map((row) => navRows.indexOf(row)))
    : -1;
  let navBrand = firstNavigationIndex > 0
    ? [...navRows.slice(0, firstNavigationIndex)].reverse()
      .find((row) => !getNavigationList(row))
    : null;
  if (!navBrand) {
    navBrand = document.createElement('div');
  }
  navBrand.classList.add('nav-brand');

  const desktopTools = document.createElement('div');
  const mobileTools = document.createElement('div');
  desktopTools.className = 'nav-tools nav-tools-desktop';
  mobileTools.className = 'nav-tools nav-tools-mobile';
  mobileTools.id = 'nav-tools-mobile';

  if (desktopSections) {
    desktopSections.id = 'nav-sections-desktop';
    desktopSections.classList.add('nav-sections', 'nav-sections-desktop');
  }
  if (mobileSections) {
    mobileSections.id = 'nav-sections-mobile';
    mobileSections.classList.add('nav-sections', 'nav-sections-mobile');
  }

  const navigationSections = [desktopSections, mobileSections].filter(Boolean);
  nav.replaceChildren(navBrand, ...navigationSections, desktopTools, mobileTools);

  decorateBrand(navBrand, navigationSections);
  decorateNavigation(desktopSections, desktopTools, 'desktop');
  decorateNavigation(mobileSections, mobileTools, 'mobile');
  ensureSafeLinks(nav);

  const hamburger = document.createElement('div');
  const menuButton = document.createElement('button');
  const hamburgerIcon = document.createElement('span');
  hamburger.className = 'nav-hamburger';
  menuButton.type = 'button';
  menuButton.setAttribute('aria-controls', 'nav-sections-mobile nav-tools-mobile');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  hamburgerIcon.className = 'nav-hamburger-icon';
  hamburgerIcon.setAttribute('aria-hidden', 'true');
  menuButton.append(hamburgerIcon);
  hamburger.append(menuButton);
  const hasMobileNavigation = Boolean(
    mobileSections?.querySelector('a, button') || mobileTools.querySelector('a, button'),
  );
  menuButton.hidden = !mobileSections || !hasMobileNavigation;
  navBrand.after(hamburger);

  bindNavigation(nav);
  setMenuExpanded(nav, false);

  const mediaChangeHandler = () => setMenuExpanded(nav, false);
  block[mediaChangeRegistrationKey] = { mediaQuery: isDesktop, handler: mediaChangeHandler };
  isDesktop.addEventListener('change', mediaChangeHandler);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
  bindScrollBehavior(block, navWrapper, nav);
}
