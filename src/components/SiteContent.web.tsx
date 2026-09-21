import { homePage, homeContent, siteLinks } from '../../site/content.mjs';

const footerLinks = [
  { href: `/about/`, label: `About` },
  { href: `/privacy/`, label: `Privacy Policy` },
  { href: `/terms/`, label: `Terms of Service` },
  { href: `/contact/`, label: `Contact` },
];

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
    <h1 id={`calculator-page-title`} className={`calculator-page-title`}>
      {homePage.heading}
    </h1>
    <p id={`calculator-page-description`} className={`calculator-page-description`}>
      {homePage.intro}
    </p>
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
