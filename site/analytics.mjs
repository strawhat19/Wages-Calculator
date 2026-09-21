export function isAnalyticsEnabled() {
  if (typeof window === `undefined`) return false;

  const config = window.wagesSiteConfig;
  return Boolean(config?.productionBuild && window.location.origin === config.siteUrl);
}

export function sanitizeAnalyticsEvent(event) {
  if (event.type !== `pageview`) return null;

  try {
    const url = new URL(event.url);
    url.search = ``;
    url.hash = ``;
    return { ...event, url: url.href };
  } catch {
    return null;
  }
}

// Generated documents have no React root. The calculator uses <Analytics />.
if (typeof document !== `undefined`
  && document.body?.classList.contains(`document-page--article`)
  && isAnalyticsEnabled()) {
  window.va = window.va || ((...args) => {
    (window.vaq = window.vaq || []).push(args);
  });
  window.va(`beforeSend`, sanitizeAnalyticsEvent);

  const script = document.createElement(`script`);
  script.defer = true;
  script.id = `site-vercel-analytics`;
  script.className = `site-vercel-analytics`;
  script.src = `/_vercel/insights/script.js`;
  document.head.appendChild(script);
}
