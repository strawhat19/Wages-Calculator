export type SiteLink = {
  href: string;
  label: string;
};

export type SitePage = {
  slug: string;
  title: string;
  body: string;
  description: string;
  kind: `guide` | `policy`;
};

export const homePage: {
  title: string;
  intro: string;
  heading: string;
  description: string;
};
export const homeContent: string;
export const siteLinks: SiteLink[];
export const sitePages: SitePage[];
