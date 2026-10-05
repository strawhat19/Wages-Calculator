import { homeContent, siteLinks } from '../../site/content.mjs';

const footerLinks = [
  { href: `/about/`, label: `About` },
  { href: `/privacy/`, label: `Privacy Policy` },
  { href: `/terms/`, label: `Terms of Use` },
  { href: `/contact/`, label: `Contact` },
  { href: `/methodology/`, label: `Calculation methodology` },
];

const resultHelpLinks = [
  { href: `/methodology/`, label: `Calculation method` },
  { href: `/guides/check-your-paycheck/`, label: `Compare a paycheck` },
  { href: `/guides/work-schedules/#schedule-paycheck`, label: `Monthly averages and pay dates` },
];

export const SiteResultHelp = () => (
  <details
    id={`calculator-result-help`}
    className={`site-results-help`}
    aria-label={`Understand your pay results`}
  >
    <summary id={`calculator-result-help-toggle`} className={`site-results-help-toggle`}>
      {`How these results are calculated`}
      <span
        aria-hidden
        id={`calculator-result-help-toggle-icon`}
        className={`site-results-help-toggle-icon`}
      >
        {`＋`}
      </span>
    </summary>
    <div id={`calculator-result-help-content`} className={`site-results-help-content`}>
      <p id={`calculator-result-help-copy`} className={`site-results-help-copy`}>
        {`Monthly pay is an annual average. Weekly pay is per paid week. Take-home uses only your entered percentage.`}
      </p>
      <nav id={`calculator-result-help-nav`} className={`site-nav`} aria-label={`Pay result explanations`}>
        {resultHelpLinks.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            className={`site-result-help-link`}
            id={`calculator-result-help-link-${index}`}
          >
            {link.label}{` →`}
          </a>
        ))}
      </nav>
    </div>
  </details>
);

export const SiteGuideDirectory = () => (
  <nav id={`mobile-guide-directory`} className={`mobile-guide-directory`} aria-label={`Pay guides`}>
    <h2 id={`mobile-guide-directory-title`} className={`mobile-guide-directory-title`}>
      {`Pay guides`}
    </h2>
    {siteLinks.map((link, index) => (
      <a
        key={link.href}
        href={link.href}
        className={`mobile-guide-directory-link`}
        id={`mobile-guide-directory-link-${index}`}
      >
        {link.label}{` →`}
      </a>
    ))}
  </nav>
);

export const SiteNavigation = () => (
  <header id={`calculator-introduction`} className={`calculator-introduction`}>
    <div id={`calculator-intro-copy`} className={`calculator-intro-copy`}>
      <p id={`calculator-eyebrow`} className={`calculator-eyebrow`}>
        {`A little clarity goes a long way`}
      </p>
      <h1 id={`calculator-page-title`} className={`calculator-page-title`}>
        {`Wages calculator`}
      </h1>
      <p id={`calculator-page-description`} className={`calculator-page-description`}>
        {`Turn your hourly pay or salary into a clear picture of what you earn.`}
      </p>
    </div>
    <div
      id={`calculator-intro-trust`}
      className={`calculator-intro-trust`}
      aria-label={`Free calculator with instant results, no sign-up`}
    >
      <span aria-hidden id={`calculator-trust-icon`} className={`calculator-trust-icon`}>
        <svg
          fill={`none`}
          viewBox={`0 0 24 24`}
          stroke={`currentColor`}
          strokeWidth={1.8}
          strokeLinecap={`round`}
          strokeLinejoin={`round`}
          id={`calculator-trust-zap`}
          className={`calculator-trust-zap`}
        >
          <path
            id={`calculator-trust-zap-path`}
            className={`calculator-trust-zap-path`}
            d={`M13 2 3 14h8l-1 8L21 10h-8l1-8Z`}
          />
        </svg>
      </span>
      <span id={`calculator-trust-label`} className={`calculator-trust-label`}>
        {`Free to use. Yours to keep.`}
      </span>
    </div>
  </header>
);

// This markup comes only from the repository's original editorial content.
// The export step uses the same source to provide readable HTML before JavaScript loads.
export const SiteContent = () => (
  <section
    id={`calculator-supporting-content`}
    className={`site-copy calculator-supporting-content`}
    aria-label={`How to use the wages calculator`}
    dangerouslySetInnerHTML={{ __html: homeContent }}
  />
);

export const SiteFooterLinks = () => (
  <footer id={`calculator-site-footer`} className={`site-footer-links`}>
    <nav id={`calculator-policy-nav`} className={`site-nav`} aria-label={`About and policies`}>
      {footerLinks.map((link, index) => (
        <a
          href={link.href}
          key={link.href}
          className={`site-footer-link`}
          id={`calculator-policy-link-${index}`}
        >
          {link.label}
        </a>
      ))}
    </nav>
    <button
      hidden
      type={`button`}
      data-wages-privacy-settings
      id={`calculator-ad-privacy-settings`}
      className={`site-privacy-settings`}
    >
      {`⚙ Ad privacy choices`}
    </button>
  </footer>
);
