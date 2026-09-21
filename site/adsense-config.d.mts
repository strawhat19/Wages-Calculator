export const SITE_URL: string;
export const ADSENSE_PUBLISHER_ID: string;

export interface SiteConfig {
  siteUrl: string;
  adSlot: string;
  publisherId: string;
  adsEnabled: boolean;
  consentReady: boolean;
  productionBuild: boolean;
  adMode: `manual` | `auto`;
  searchConsoleVerification: string;
}

export interface PublicSiteConfig extends SiteConfig {
  pageMonetizable: boolean;
}

export function readSiteConfig(env?: Record<string, string | undefined>): SiteConfig;

declare global {
  interface Window {
    wagesSiteConfig?: PublicSiteConfig;
  }
}
