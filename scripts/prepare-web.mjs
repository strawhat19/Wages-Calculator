import path from 'node:path';
import * as sass from 'sass';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';
import { readSiteConfig } from '../site/adsense-config.mjs';
import { createStructuredData } from '../site/structured-data.mjs';
import { renderHeaderMenu, renderDocumentTabs } from '../site/navigation.mjs';
import { homePage, homeContent, sitePages } from '../site/content.mjs';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), `..`);
const output = path.join(project, `dist`);
const policyLinks = sitePages.filter((page) => page.kind === `policy`).map((page) => ({
  label: page.title,
  href: `/${page.slug}/`,
}));

// Expo loads dotenv in its own child process. Load the build configuration here
// too, preserving variables explicitly supplied by the shell or hosting service.
const buildEnvironment = process.env.NODE_ENV || `production`;
const envFiles = [`.env.${buildEnvironment}.local`, `.env.local`, `.env.${buildEnvironment}`, `.env`];

for (const filename of envFiles) {
  try {
    const values = parseEnv(await readFile(path.join(project, filename), `utf8`));

    for (const [name, value] of Object.entries(values)) {
      if (process.env[name] === undefined) process.env[name] = value;
    }
  } catch (error) {
    if (error.code !== `ENOENT`) throw error;
  }
}

const config = readSiteConfig();

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    [`&`]: `&amp;`,
    [`<`]: `&lt;`,
    [`>`]: `&gt;`,
    [`"`]: `&quot;`,
    [`'`]: `&#39;`,
  }[character]));
}

function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, `\\u003c`)
    .replace(/\u2028/g, `\\u2028`)
    .replace(/\u2029/g, `\\u2029`);
}

function metadata({ title, description, pathname, pageTitle, monetizable = false, noindex = false }) {
  const canonical = `${config.siteUrl}${pathname}`;
  const publicConfig = { ...config, pageMonetizable: monetizable };
  const structuredData = createStructuredData({ siteUrl: config.siteUrl, pathname, title, description, pageTitle });

  return `
    <title id="site-document-title" class="site-document-title">${escapeHtml(title)}</title>
    <meta id="site-viewport" class="site-viewport" name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta id="site-description" class="site-description" name="description" content="${escapeHtml(description)}">
    <meta id="site-robots" class="site-robots" name="robots" content="${noindex || !config.productionBuild ? `noindex, nofollow` : `index, follow`}">
    <link id="site-canonical" class="site-canonical" rel="canonical" href="${escapeHtml(canonical)}">
    <meta id="site-og-title" class="site-og-title" property="og:title" content="${escapeHtml(title)}">
    <meta id="site-og-type" class="site-og-type" property="og:type" content="website">
    <meta id="site-og-url" class="site-og-url" property="og:url" content="${escapeHtml(canonical)}">
    <meta id="site-og-name" class="site-og-name" property="og:site_name" content="Wages Calculator">
    <meta id="site-og-description" class="site-og-description" property="og:description" content="${escapeHtml(description)}">
    <link id="site-favicon" class="site-favicon" rel="icon" type="image/png" href="/site-icon.png">
    ${noindex || !config.productionBuild ? `` : `<script id="site-structured-data" class="site-structured-data" type="application/ld+json">${safeJson(structuredData)}</script>`}
    ${config.publisherId ? `<meta id="site-adsense-verification" class="site-adsense-verification" name="google-adsense-account" content="${escapeHtml(config.publisherId)}">` : ``}
    ${config.searchConsoleVerification ? `<meta id="site-google-verification" class="site-google-verification" name="google-site-verification" content="${escapeHtml(config.searchConsoleVerification)}">` : ``}
    <link id="site-content-stylesheet" class="site-content-stylesheet" rel="stylesheet" href="/site-content.css">
    <script id="site-runtime-config" class="site-runtime-config">window.wagesSiteConfig = ${safeJson(publicConfig)};</script>
    <script id="site-services" class="site-services" src="/site-services.js" defer></script>
    ${config.productionBuild && monetizable && !noindex && config.publisherId ? `<script id="wages-adsense-script" class="wages-adsense-script" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${escapeHtml(config.publisherId)}" crossorigin="anonymous" onerror="this.dataset.wagesAdState='failed'"></script>` : ``}`;
}

function navigation(prefix, pathname = `/`) {
  return `<header id="${prefix}-header" class="document-header">
    <a id="${prefix}-brand" class="document-brand" href="/" aria-label="Wages Calculator home">
      <img id="${prefix}-brand-logo" class="document-brand-logo" src="/site-icon.png" alt="" width="34" height="34">
      <span id="${prefix}-brand-label" class="document-brand-label">Wages Calculator</span>
    </a>
    ${renderHeaderMenu(prefix, pathname)}
  </header>`;
}

function footer(prefix) {
  return `<footer id="${prefix}-footer" class="document-footer">
    <nav id="${prefix}-footer-navigation" class="site-footer-links" aria-label="Site information">
      ${policyLinks.map((link, index) => `<a id="${prefix}-footer-link-${index}" class="site-footer-link" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join(`\n`)}
    </nav>
    <button id="${prefix}-privacy-settings" class="site-privacy-settings" type="button" data-wages-privacy-settings hidden>⚙ Ad privacy choices</button>
    <p id="${prefix}-disclaimer" class="site-disclaimer">Planning estimates only. Your employer’s payroll and applicable rules determine your actual pay.</p>
  </footer>`;
}

function breadcrumbs(prefix, pageTitle) {
  if (!pageTitle) return ``;

  return `<nav id="${prefix}-breadcrumbs" class="site-breadcrumbs" aria-label="Breadcrumb">
    <ol id="${prefix}-breadcrumb-list" class="site-breadcrumb-list">
      <li id="${prefix}-breadcrumb-home" class="site-breadcrumb-item"><a id="${prefix}-breadcrumb-home-link" class="site-breadcrumb-link" href="/">Pay calculator</a></li>
      <li id="${prefix}-breadcrumb-current" class="site-breadcrumb-item" aria-current="page">${escapeHtml(pageTitle)}</li>
    </ol>
  </nav>`;
}

function documentShell({ title, description, pathname, pageTitle, body, prefix, monetizable = false, noindex = false }) {
  return `<!DOCTYPE html>
<html id="site-html" class="site-html" lang="en">
  <head id="site-head" class="site-head">
    <meta id="site-charset" class="site-charset" charset="utf-8">
    ${metadata({ title, description, pathname, pageTitle, monetizable, noindex })}
    <script id="site-navigation-runtime" class="site-navigation-runtime" type="module" src="/site-navigation.js"></script>
  </head>
  <body id="site-body" class="document-page document-page--article">
    <a id="${prefix}-skip-link" class="site-skip-link" href="#${prefix}-main">Skip to content ↓</a>
    ${navigation(prefix, pathname)}
    <div id="${prefix}-content" class="document-content">
      <main id="${prefix}-main" class="document-main" tabindex="-1">${breadcrumbs(prefix, pageTitle)}${body}</main>
      ${footer(prefix)}
    </div>
    ${renderDocumentTabs(prefix, pathname)}
  </body>
</html>\n`;
}

let exportedIndex;

try {
  exportedIndex = await readFile(path.join(output, `index.html`), `utf8`);
} catch {
  throw new Error(`No dist/index.html found. Run the Expo web export before scripts/prepare-web.mjs.`);
}

const pageSlugs = new Set();

for (const page of sitePages) {
  if (!/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(page.slug) || pageSlugs.has(page.slug)) {
    throw new Error(`Invalid or duplicate support page slug: ${page.slug}`);
  }

  pageSlugs.add(page.slug);
}

const fallback = `<div id="site-home-fallback" class="document-page site-home-fallback" style="height:100%;overflow:auto;min-height:0;">
  ${navigation(`home-fallback`)}
  <main id="home-fallback-main" class="site-copy document-main">
    <h1 id="home-fallback-title" class="site-title">${escapeHtml(homePage.heading)}</h1>
    <p id="home-fallback-description" class="site-intro">${escapeHtml(homePage.intro)}</p>
    <p id="home-fallback-loading" class="site-fallback-message">Enable JavaScript to use the interactive calculator. The explanations and worked examples below are available without JavaScript.</p>
    ${homeContent}
  </main>
  ${footer(`home-fallback`)}
</div>`;

const emptyRoot = /(<div\b(?=[^>]*\bid=["']root["'])[^>]*>)\s*(<\/div>)/i;

if (!emptyRoot.test(exportedIndex)) {
  throw new Error(`Expected an empty Expo #root in dist/index.html; update prepare-web.mjs for the exported HTML before publishing.`);
}

exportedIndex = exportedIndex.replace(emptyRoot, (_, opening, closing) => `${opening}${fallback}${closing}`);
exportedIndex = exportedIndex.replace(/<noscript\b[^>]*>\s*You need to enable JavaScript to run this app\.\s*<\/noscript>/gi, ``);
exportedIndex = exportedIndex.replace(/<head\b([^>]*)>([\s\S]*?)<\/head>/i, (_, attributes, head) => {
  const cleanedHead = head
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, ``)
    .replace(/<meta\b[^>]*(?:name|property)\s*=\s*["'](?:viewport|description|robots|og:[^"']*|google-adsense-account|google-site-verification)["'][^>]*>/gi, ``)
    .replace(/<link\b[^>]*rel\s*=\s*["'](?:canonical|icon|shortcut icon)["'][^>]*>/gi, ``);

  return `<head${attributes}>${cleanedHead}${metadata({
    title: homePage.title,
    pathname: `/`,
    monetizable: true,
    description: homePage.description,
  })}<noscript id="site-fallback-styles" class="site-fallback-styles"><style id="site-noscript-scroll" class="site-noscript-scroll">html,body,#root,#site-home-fallback{height:auto!important;overflow:auto!important;}#root{display:block!important;}</style></noscript></head>`;
});

await writeFile(path.join(output, `index.html`), exportedIndex);
await copyFile(path.join(project, `public`, `site-services.js`), path.join(output, `site-services.js`));
await copyFile(path.join(project, `public`, `site-navigation.js`), path.join(output, `site-navigation.js`));
await copyFile(path.join(project, `angular-ionic-calculator.png`), path.join(output, `site-icon.png`));
// Match the web entry's stylesheet order; Expo compiles each SCSS file separately.
const siteStyles = [`navigation.scss`, `content.scss`].map((filename) => (
  sass.compile(path.join(project, `site`, filename), { style: `compressed` }).css
)).join(`\n`);
await writeFile(path.join(output, `site-content.css`), siteStyles);

for (const page of sitePages) {
  const prefix = page.slug.replaceAll(`/`, `-`);
  const monetizable = page.kind === `guide`;
  const folder = path.join(output, page.slug);
  const body = `${page.body}
  ${monetizable ? `<aside id="${prefix}-ad-slot" class="site-ad-slot" data-wages-ad-slot aria-label="Advertisement" hidden><span id="${prefix}-ad-label" class="site-ad-label">Advertisement</span></aside>` : ``}`;

  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, `index.html`), documentShell({
    body,
    prefix,
    monetizable,
    pageTitle: page.title,
    pathname: `/${page.slug}/`,
    description: page.description,
    title: `${page.title} | Wages Calculator`,
  }));
}

await writeFile(path.join(output, `404.html`), documentShell({
  noindex: true,
  prefix: `not-found`,
  pathname: `/404.html`,
  title: `Page not found | Wages Calculator`,
  description: `This page could not be found. Return to the wages calculator or browse the pay guides.`,
  body: `<section id="not-found-content" class="site-copy"><h1 id="not-found-title" class="site-title">Page not found</h1><p id="not-found-description" class="site-paragraph">This address does not match a page on Wages Calculator.</p><a id="not-found-home-link" class="site-link" href="/">← Return to the calculator</a></section>`,
}));

const sitemapUrls = [`/`, ...sitePages.map((page) => `/${page.slug}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((pathname) => `  <url><loc>${escapeHtml(`${config.siteUrl}${pathname}`)}</loc></url>`).join(`\n`)}\n</urlset>\n`;

await writeFile(path.join(output, `sitemap.xml`), sitemap);
await writeFile(path.join(output, `robots.txt`), config.productionBuild
  ? `User-agent: *\nAllow: /\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`
  : `User-agent: *\nDisallow: /\n`);

if (config.publisherId) {
  const sellerId = config.publisherId.replace(/^ca-/, ``);
  await writeFile(path.join(output, `ads.txt`), `google.com, ${sellerId}, DIRECT, f08c47fec0942fa0\n`);
} else {
  await rm(path.join(output, `ads.txt`), { force: true });
}

console.info(`Prepared ${sitePages.length + 1} public pages and sitemap; AdSense tag ${config.productionBuild && config.publisherId ? `included on calculator and guides` : `omitted`}; manual ads ${config.adsEnabled && config.adMode === `manual` ? `enabled` : `disabled`}.`);
