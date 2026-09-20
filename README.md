# Wages Calculator

A modern, single-page remake of Angular-Ionic-Calculator using Expo SDK 57, React Native, and TypeScript. The original logo appears in the header and supplies the app icon and favicon.

## Run

Use Node 24.3+ or Node 22.13+; `.nvmrc` targets Node 24. The terminal used for setup had Node 22.9, so npm reported engine warnings even though dependency installation completed.

```sh
npm install
npm run web
```

Use `npm start` to open Expo and scan its QR code with an SDK 57-compatible Expo Go client or development build. Use `npm run android` for Android. The iOS simulator requires macOS; a physical iOS device can connect through a compatible client.

`npm run build:web` exports a static web build to `dist` for deployment. See the [Expo SDK 57 notes](https://expo.dev/changelog/sdk-57) for client compatibility.

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

## Display Ad Space

The website reserves a 300 × 250 sidebar space at widths of 1280px and above. Smaller screens get a banner below the calculator: up to 728 × 90 on tablets and 320 × 50 on phones. These are non-interactive placeholders in `src/components/AdSpace.tsx`; no ad network or tracking scripts are connected. Native iOS and Android layouts omit these website ad spaces.

## Deployment

The website is hosted at https://wages-calculator.com on Vercel under `piratechs/wages-calculator`. The GitHub `main` branch is connected for automatic production deployments. Vercel runs `npm ci` and `npm run build:web`, serves `dist`, and uses the SPA fallback in `vercel.json`.

Hostinger manages the domain's DNS. The apex A record points to `76.76.21.21`, and `www` is a CNAME to the apex; both domains are assigned to the Vercel project with HTTPS. No environment variables are required.

Local tests, builds, and UI verification were skipped during development following `AGENTS.md`. The production build and public HTTPS response were checked as part of the requested deployment.
