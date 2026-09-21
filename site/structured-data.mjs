// Describe the same site, page, and navigation that visitors can see.
// No fabricated ratings, reviews, credentials, or search functionality.
export function createStructuredData({ siteUrl, pathname, title, description, pageTitle }) {
  const home = `${siteUrl}/`;
  const url = `${siteUrl}${pathname}`;
  const websiteId = `${home}#website`;
  const breadcrumbId = `${url}#breadcrumbs`;
  const graph = [];

  if (pathname === `/`) {
    graph.push({
      '@type': `WebSite`,
      '@id': websiteId,
      url: home,
      name: `Wages Calculator`,
      inLanguage: `en`,
    });
  }

  graph.push({
    '@type': `WebPage`,
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: `en`,
    isPartOf: { '@id': websiteId },
    ...(pageTitle ? { breadcrumb: { '@id': breadcrumbId } } : {}),
  });

  if (pageTitle) {
    graph.push({
      '@type': `BreadcrumbList`,
      '@id': breadcrumbId,
      itemListElement: [
        { '@type': `ListItem`, position: 1, name: `Pay calculator`, item: home },
        { '@type': `ListItem`, position: 2, name: pageTitle, item: url },
      ],
    });
  }

  return { '@context': `https://schema.org`, '@graph': graph };
}
