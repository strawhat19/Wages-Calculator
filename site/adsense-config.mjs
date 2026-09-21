export const SITE_URL = `https://wages-calculator.com`;

const publisherPattern = /^ca-pub-\d{16}$/;
const verificationPattern = /^[A-Za-z0-9_-]{10,256}$/;

function readBoolean(env, name) {
  const value = env[name]?.trim() || `false`;

  if (value !== `true` && value !== `false`) {
    throw new Error(`${name} must be true or false.`);
  }

  return value === `true`;
}

function readSiteUrl(value) {
  let url;

  try {
    url = new URL(value || SITE_URL);
  } catch {
    throw new Error(`SITE_URL must be a valid HTTPS origin, such as ${SITE_URL}.`);
  }

  const labels = url.hostname.split(`.`);
  const publicDomain = labels.length > 1
    && labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))
    && /^[a-z]{2,63}$/i.test(labels.at(-1))
    && !/\.(?:localhost|local|internal|test|invalid)$/i.test(url.hostname);

  if (!publicDomain || url.protocol !== `https:` || url.port || url.username
    || url.password || url.pathname !== `/` || url.search || url.hash) {
    throw new Error(`SITE_URL must be a public HTTPS domain without a port, credentials, path, query, or fragment.`);
  }

  return url.origin;
}

export function readSiteConfig(env = process.env) {
  const siteUrl = readSiteUrl(env.SITE_URL?.trim());
  const adSlot = env.ADSENSE_SLOT?.trim() || ``;
  const adMode = env.ADSENSE_MODE?.trim() || `manual`;
  const adsRequested = readBoolean(env, `ADSENSE_ENABLED`);
  const consentReady = readBoolean(env, `ADSENSE_CONSENT_READY`);
  const publisherId = env.ADSENSE_PUBLISHER_ID?.trim() || ``;
  const searchConsoleVerification = env.GOOGLE_SITE_VERIFICATION?.trim() || ``;
  const productionBuild = env.VERCEL_ENV === undefined
    ? ![`development`, `test`].includes(env.NODE_ENV)
    : env.VERCEL_ENV === `production`;

  if (publisherId && (!publisherPattern.test(publisherId) || /^ca-pub-0+$/.test(publisherId))) {
    throw new Error(`ADSENSE_PUBLISHER_ID must be your real ca-pub- ID followed by 16 digits.`);
  }

  if (adMode !== `manual` && adMode !== `auto`) {
    throw new Error(`ADSENSE_MODE must be manual or auto.`);
  }

  if (adSlot && !/^[1-9]\d{0,19}$/.test(adSlot)) {
    throw new Error(`ADSENSE_SLOT must be the numeric ad unit ID from AdSense.`);
  }

  if (searchConsoleVerification && !verificationPattern.test(searchConsoleVerification)) {
    throw new Error(`GOOGLE_SITE_VERIFICATION must contain only the Search Console verification token, not an HTML tag.`);
  }

  if (adsRequested && (!publisherId || !consentReady)) {
    throw new Error(`To enable ads, provide ADSENSE_PUBLISHER_ID and set ADSENSE_CONSENT_READY=true after publishing the required Google Privacy & messaging consent messages.`);
  }

  if (adsRequested && adMode === `manual` && !adSlot) {
    throw new Error(`Manual ads require ADSENSE_SLOT. Copy the ad unit ID from your approved AdSense account.`);
  }

  return {
    adMode,
    adSlot,
    siteUrl,
    publisherId,
    consentReady,
    productionBuild,
    searchConsoleVerification,
    adsEnabled: adsRequested && productionBuild,
  };
}
