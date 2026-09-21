import { homeContent, siteLinks } from '../../site/content.mjs';

const footerLinks = [
  { href: `/about/`, label: `About` },
  { href: `/privacy/`, label: `Privacy Policy` },
  { href: `/terms/`, label: `Terms of Service` },
  { href: `/contact/`, label: `Contact` },
];

export const SiteNavigation = () => (
  <header id={`calculator-introduction`} className={`calculator-introduction`}>
    <h1 id={`calculator-page-title`} className={`calculator-page-title`}>
      {`Hourly and salary calculator`}
    </h1>
    <p id={`calculator-page-description`} className={`calculator-page-description`}>
      {`Compare gross pay and a flat-rate take-home estimate across your working schedule.`}
    </p>
    <nav id={`calculator-site-nav`} className={`site-nav`} aria-label={`Calculator and guides`}>
      {siteLinks.map((link, index) => (
        <a
          href={link.href}
          key={link.href}
          className={`site-nav-link`}
          id={`calculator-site-nav-link-${index}`}
        >
          {link.label}
        </a>
      ))}
    </nav>
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
