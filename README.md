# Wages Calculator

A wage calculator using Expo SDK 57, React Native, and TypeScript, with original calculation guides and supporting website pages. The original logo appears in the header and supplies the app icon and favicon.

## Run

Use Node 24.3+ or Node 22.13+; `.nvmrc` targets Node 24. The terminal used for setup had Node 22.9, so npm reported engine warnings even though dependency installation completed.

```sh
npm install
npm run web
```

Use `npm start` to open Expo and scan its QR code with an SDK 57-compatible Expo Go client or development build. Use `npm run android` for Android. The iOS simulator requires macOS; a physical iOS device can connect through a compatible client.

`npm run build:web` exports the calculator and then prepares the complete static website in `dist`, including guides, policies, metadata, sitemap, and AdSense integration. The static support pages are generated during export, so Expo's development server only provides the calculator. See the [Expo SDK 57 notes](https://expo.dev/changelog/sdk-57) for client compatibility.

## Features And Calculations

- Hourly rate and annual salary inputs visible together, with weekly hours, days per week, and paid weeks per year.
- Gross pay, estimated tax, and take-home pay across hourly, daily, weekly, monthly, and yearly periods.
- An adjustable flat tax estimate, initially 24%.
- Desktop inputs and results together, with Income, Pay, Guides, and More bottom navigation on phone browsers.
- Clickable logo and brand name return home; the shared header menu includes every guide and information page.
- Header dark-mode toggle with a locally saved preference, plus confirmation before resetting income.
- Example inputs of $25 per hour and 40 hours per week.

The last edited pay field is authoritative; the other shows its calculated equivalent rounded to cents. Hourly income is annualized as rate × weekly hours × paid weeks per year. Monthly income is annual income divided by 12; weekly and daily figures use the entered paid schedule. Calculation results retain precision and round only for display. Tax is a user-entered flat estimate; there are no tax tables, automatic overtime calculations, or country-specific tax rules.

Inputs are saved locally with AsyncStorage after a short delay and restored on browser reload or app reopening. Existing saved income is retained; older bill data is ignored. Data stays in that device or browser; there is no account, backend, or synchronization. The interface reports input storage failures and remains usable when local storage is unavailable. Theme preference is stored separately, so resetting income keeps your chosen appearance.

Below 768px, the website keeps a compact header and bottom navigation visible around one scrollable view. Income contains the inputs, Pay the live breakdown, Guides the reading material, and More the policy links and preferences. Tabs preserve the mounted calculator and its values; the logo returns to Income without resetting them. Browser back/forward and `/#income`, `/#results`, `/#guides`, and `/#more` restore the selected view. Long articles, small viewports, and the on-screen keyboard use internal scrolling. Native apps retain their existing calculator layout.

Exported guides and policy pages use the same logo/home link, header menu, and mobile navigation. Their content remains readable without JavaScript. The header menu supports keyboard operation, Escape, and outside-click dismissal; it contains ordinary crawlable links to all pages.

## Styling

Shared React Native styles support the native and web interfaces. `src/styles/web.scss` adds browser-specific enhancements; SCSS is not treated as a universal native styling system. See [Expo’s Sass documentation](https://docs.expo.dev/versions/latest/config/metro/#sass).

Website text uses the shared `--wages-font-family` setting in `site/content.scss`, including the brand, navigation, calculator, controls, and static documents. The React Native web font setting refers to the same variable; native platforms keep their existing system fonts.

## Organic Search

The homepage title is `Wages Calculator | Pay & Hourly Calculator`, keeping the app name first while describing its purpose. The heading, introduction, formula examples, and visible answers address pay calculator, hourly pay calculator, and wage calculator searches. Related pages cover specific conversion and pay-period questions:

| Page | Search intent |
| --- | --- |
| `/` | Pay calculator, hourly calculator, wage calculator |
| `/guides/hourly-to-salary/` | Hourly to salary, hourly to annual income |
| `/guides/salary-to-hourly/` | Salary to hourly, annual salary divided by hours |
| `/guides/gross-and-take-home/` | Gross pay versus estimated take-home pay |
| `/guides/work-schedules/` | Weekly to monthly pay, paid weeks, biweekly versus twice-monthly pay |

The calculator and pre-JavaScript homepage share the `homePage` copy in `site/content.mjs`. The export produces unique page metadata, canonical URLs, a shared favicon, `WebSite`/`WebPage` structured data, and visible breadcrumbs with matching `BreadcrumbList` markup. Existing guide URLs remain stable. The content accurately describes a flat-rate estimate rather than promising jurisdiction-specific payroll or tax calculations.

After publishing, verify the production property in [Google Search Console](https://search.google.com/search-console), submit `https://wages-calculator.com/sitemap.xml`, and request indexing for the homepage and guides through URL Inspection. Review impressions, queries, clicks, and indexing reports to decide which genuinely useful explanations to improve. The setup does not submit URLs to Google automatically. Preview deployments remain noindex.

These changes follow Google's [Search Essentials](https://developers.google.com/search/docs/essentials), [title guidance](https://developers.google.com/search/docs/appearance/title-link), and [crawlable link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable). Google decides whether to index a page and where to rank it; there is no guaranteed placement for a keyword.

## Website Content And Advertising

The website includes About, Privacy Policy, Terms of Service, Contact, and four calculation guides: hourly to salary, salary to hourly, gross versus estimated take-home pay, and work schedules/pay periods. The homepage explains the formulas, assumptions, and limitations. Content lives in `site/content.mjs`; the calculator and static export share it.

Production exports include the owner's AdSense script for `ca-pub-8379301195677583` in the homepage and four guide pages, plus ownership metadata and `/ads.txt`. Preview builds, policy/error pages, and native apps omit the script. The publisher ID can be overridden with `ADSENSE_PUBLISHER_ID`; setting it explicitly blank removes the script, verification metadata, and `ads.txt`.

The script may activate Auto ads according to the Google dashboard, independently of `ADSENSE_ENABLED` and `ADSENSE_CONSENT_READY`. Those flags gate manual placements, which remain off by default. When enabled on the configured production hostname, manual ads appear after the homepage explanation and guide content; the mobile homepage placement is in Guides. Approval and consent messages require account-side setup. A production export retains its script when served on an alternative hostname or locally. Google Analytics is not installed.

Follow [ADSENSE-SETUP.md](./ADSENSE-SETUP.md) for environment variables, the review process, consent configuration, deployment, and account steps. AdSense approval is decided by Google, and source changes alone do not activate an account.

## Web Analytics

Vercel Web Analytics is integrated for the production website, including the calculator, guides, and policy pages. The Expo web app uses `@vercel/analytics/react`; `/next` is for Next.js applications. Static documents load the same analytics service separately. Native apps and preview/development builds do not send page views.

The integration removes query parameters and fragments from analytics page URLs and sends no calculator values or custom events. Vercel reports aggregate traffic without third-party cookies; see its [analytics privacy documentation](https://vercel.com/docs/analytics/privacy-policy). Google Analytics is not installed.

In the Vercel project's **Analytics** tab, enable **Web Analytics** if it is not already enabled, then deploy the reviewed changes. Traffic appears after visitors load the deployed site. No analytics ID or additional environment variable is required.

## Deployment

The documented production site is https://wages-calculator.com on Vercel under `piratechs/wages-calculator`. The GitHub `main` branch is connected for automatic production deployments. Vercel runs `npm ci` and `npm run build:web` and serves `dist`. Supporting pages have their own static files; unknown routes return a 404 instead of displaying the calculator.

The existing deployment documentation identifies Hostinger as the DNS provider, an apex A record of `76.76.21.21`, and `www` as a CNAME to the apex, with both domains assigned to Vercel and HTTPS. Keep the canonical hostname in `SITE_URL` aligned with the host's domain redirects. No environment variables are needed to run the calculator or include the supplied AdSense snippet in a production export. Advertising and Search Console configuration are described in `.env.example` and the setup guide.

Local tests, builds, and UI verification are intentionally left to the owner under `AGENTS.md`. This AdSense preparation has not been deployed or submitted to Google for review.
