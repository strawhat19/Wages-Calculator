# Wages Calculator

A wage calculator using Expo SDK 57, React Native, and TypeScript, with original calculation guides and supporting website pages. The original logo appears in the header and supplies the app icon and favicon.

## Run

Use Node 24.3+ or Node 22.13+; `.nvmrc` targets Node 24. The terminal used for setup had Node 22.9, so npm reported engine warnings even though dependency installation completed.

```sh
npm install
npm run web
```

Use `npm start` to open Expo and scan its QR code with an SDK 57-compatible Expo Go client or development build. Use `npm run android` for Android. The iOS simulator requires macOS; a physical iOS device can connect through a compatible client.

`npm run build:web` exports the calculator and then prepares the complete static website in `dist`, including guides, policies, metadata, sitemap, and optional AdSense verification. The static support pages are generated during export, so Expo's development server only provides the calculator. See the [Expo SDK 57 notes](https://expo.dev/changelog/sdk-57) for client compatibility.

## Features And Calculations

- Hourly rate and annual salary inputs visible together, with weekly hours, days per week, and paid weeks per year.
- Gross pay, estimated tax, and take-home pay across hourly, daily, weekly, monthly, and yearly periods.
- An adjustable flat tax estimate, initially 24%.
- Full-width calculator with plain input and result panels; compact stacking on phones.
- Header dark-mode toggle with a locally saved preference, plus confirmation before resetting income.
- Example inputs of $25 per hour and 40 hours per week.

The last edited pay field is authoritative; the other shows its calculated equivalent rounded to cents. Hourly income is annualized as rate × weekly hours × paid weeks per year. Monthly income is annual income divided by 12; weekly and daily figures use the entered paid schedule. Calculation results retain precision and round only for display. Tax is a user-entered flat estimate; there are no tax tables, automatic overtime calculations, or country-specific tax rules.

Inputs are saved locally with AsyncStorage after a short delay and restored on browser reload or app reopening. Existing saved income is retained; older bill data is ignored. Data stays in that device or browser; there is no account, backend, or synchronization. The interface reports input storage failures and remains usable when local storage is unavailable. Theme preference is stored separately, so resetting income keeps your chosen appearance.

## Styling

Shared React Native styles support the native and web interfaces. `src/styles/web.scss` adds browser-specific enhancements; SCSS is not treated as a universal native styling system. See [Expo’s Sass documentation](https://docs.expo.dev/versions/latest/config/metro/#sass).

## Website Content And Advertising

The website includes About, Privacy Policy, Terms of Service, Contact, and four calculation guides: hourly to salary, salary to hourly, gross versus estimated take-home pay, and work schedules/pay periods. The homepage explains the formulas, assumptions, and limitations. Content lives in `site/content.mjs`; the calculator and static export share it.

AdSense is disabled by default. Once configured, manual ads have a labeled responsive placement below the calculator and after guide content. Empty placeholders do not appear. Native iOS and Android layouts omit web content and advertising.

The export can publish AdSense ownership verification and `/ads.txt` using a real publisher ID while ad serving remains off. Live ad delivery requires explicit activation and confirmation of a published consent setup; it is limited to the configured production hostname. Policy and error pages do not request ads. Google Analytics is not installed.

Follow [ADSENSE-SETUP.md](./ADSENSE-SETUP.md) for environment variables, the review process, consent configuration, deployment, and account steps. AdSense approval is decided by Google, and source changes alone do not activate an account.

## Deployment

The documented production site is https://wages-calculator.com on Vercel under `piratechs/wages-calculator`. The GitHub `main` branch is connected for automatic production deployments. Vercel runs `npm ci` and `npm run build:web` and serves `dist`. Supporting pages have their own static files; unknown routes return a 404 instead of displaying the calculator.

The existing deployment documentation identifies Hostinger as the DNS provider, an apex A record of `76.76.21.21`, and `www` as a CNAME to the apex, with both domains assigned to Vercel and HTTPS. Keep the canonical hostname in `SITE_URL` aligned with the host's domain redirects. No environment variables are needed to run the calculator with ads disabled. Advertising and Search Console configuration are described in `.env.example` and the setup guide.

Local tests, builds, and UI verification are intentionally left to the owner under `AGENTS.md`. This AdSense preparation has not been deployed or submitted to Google for review.
