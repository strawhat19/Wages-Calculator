import { siteLinks } from './content.mjs';

export { bindHeaderMenus } from '../public/site-navigation.js';

const informationLinks = [
  { href: `/about/`, label: `About` },
  { href: `/contact/`, label: `Contact` },
  { href: `/privacy/`, label: `Privacy Policy` },
  { href: `/terms/`, label: `Terms of Use` },
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    [`&`]: `&amp;`,
    [`<`]: `&lt;`,
    [`>`]: `&gt;`,
    [`"`]: `&quot;`,
    [`'`]: `&#39;`,
  }[character]));
}

export function renderNavigationIcon(prefix, kind) {
  const paths = {
    menu: [`M4 6h16M4 12h16M4 18h16`],
    home: [`m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7`],
    income: [`M6 3h12v18H6zM9 7h6M9 11h1M14 11h1M9 15h1M14 15h1M9 18h1M14 18h1`],
    results: [`M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7M3 20h18`],
    guides: [`M12 5v16M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z`],
    more: [`M5 7h14M5 12h14M5 17h14`],
    arrow: [`M5 12h14m-5-5 5 5-5 5`],
  };

  return `<svg id="${prefix}-icon" class="site-navigation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${(paths[kind] || paths.arrow).map((path, index) => `<path id="${prefix}-icon-path-${index}" class="site-navigation-icon-path" d="${path}"></path>`).join(``)}</svg>`;
}

function renderMenuLink(prefix, link, pathname, icon) {
  const current = link.href === pathname ? ` aria-current="page"` : ``;

  return `<a id="${prefix}-link" class="header-menu-link" href="${escapeHtml(link.href)}"${current}>
    ${renderNavigationIcon(prefix, icon)}
    <span id="${prefix}-label" class="header-menu-link-label">${escapeHtml(link.label)}</span>
  </a>`;
}

export function renderHeaderMenu(prefix, pathname = `/`) {
  return `<details id="${prefix}-menu" class="header-menu">
    <summary id="${prefix}-menu-toggle" class="header-menu-toggle" aria-controls="${prefix}-menu-navigation">
      ${renderNavigationIcon(`${prefix}-menu-toggle`, `menu`)}
      <span id="${prefix}-menu-label" class="header-menu-label">Menu</span>
    </summary>
    <nav id="${prefix}-menu-navigation" class="header-menu-navigation" aria-label="Main navigation">
      ${renderMenuLink(`${prefix}-home`, { href: `/`, label: `Pay calculator` }, pathname, `home`)}
      <div id="${prefix}-guides-group" class="header-menu-group">
        <p id="${prefix}-guides-heading" class="header-menu-heading">Pay guides</p>
        ${siteLinks.map((link, index) => renderMenuLink(`${prefix}-guide-${index}`, link, pathname, `guides`)).join(`\n`)}
      </div>
      <div id="${prefix}-information-group" class="header-menu-group">
        <p id="${prefix}-information-heading" class="header-menu-heading">Site information</p>
        ${informationLinks.map((link, index) => renderMenuLink(`${prefix}-information-${index}`, link, pathname, `arrow`)).join(`\n`)}
      </div>
    </nav>
  </details>`;
}

export function renderDocumentTabs(prefix, pathname) {
  const activeTab = pathname.startsWith(`/guides/`) ? `guides` : `more`;
  const tabs = [
    { id: `income`, label: `Income` },
    { id: `results`, label: `Pay` },
    { id: `guides`, label: `Guides` },
    { id: `more`, label: `More` },
  ];

  return `<nav id="${prefix}-mobile-navigation" class="document-mobile-navigation" aria-label="Calculator sections">
    ${tabs.map((tab) => `<a id="${prefix}-mobile-${tab.id}" class="document-mobile-link" href="/#${tab.id}"${activeTab === tab.id ? ` aria-current="true"` : ``}>
      ${renderNavigationIcon(`${prefix}-mobile-${tab.id}`, tab.id)}
      <span id="${prefix}-mobile-${tab.id}-label" class="document-mobile-label">${tab.label}</span>
    </a>`).join(`\n`)}
  </nav>`;
}
