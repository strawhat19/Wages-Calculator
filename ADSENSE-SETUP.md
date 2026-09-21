# AdSense launch guide

The code is prepared for `https://wages-calculator.com`. Ads remain off until the site owner supplies a real publisher ID, completes Google's review, publishes the appropriate consent messages, and explicitly enables serving. No AdSense account, publisher ID, analytics property, or contact email has been invented.

## What the website provides

- The existing hourly/salary calculator, with a clear flat-tax estimate disclaimer.
- Original formula explanations, worked examples, and four dedicated guides.
- About, Privacy Policy, Terms of Service, and Contact pages. Contact uses the project's actual GitHub issue tracker and Piratechs website; public issues must not include personal pay records.
- Static HTML documents, canonical metadata, a sitemap, robots instructions, and a real 404 page.
- Optional AdSense verification metadata, root `ads.txt`, and Search Console verification metadata.
- A responsive manual ad placement below the calculator or at the end of a guide. Supporting policies and error pages have no ad requests.
- Ad serving disabled by default and on preview/localhost hosts. Native app screens have no web advertising.

Google's [readiness guidance](https://support.google.com/adsense/answer/7299563?hl=en) focuses on useful original content and clear navigation. It does not prescribe a 15–20-page minimum. These changes cannot guarantee acceptance or a review time.

## 1. Review and publish the prepared site

Review the diff, especially the publisher identity, Contact page, and Privacy Policy. The disclosures describe local storage for calculator inputs/theme, hosting logs, and optional Google advertising. Google Analytics is not installed. If your hosting configuration or other services collect additional data, update the policy to match.

For local export configuration, copy `.env.example` to `.env.local` and fill only the values you have. Hosting and shell variables take precedence over local environment files. Production configuration belongs in Vercel's environment settings; do not commit local environment files.

The repository's `AGENTS.md` requests no agent-run tests, builds, or verification. Before publishing, the owner should run the existing type check and full export:

```sh
npm ci
npm run typecheck
npm run build:web
```

Preview the exported `dist` directory with a static server; Expo's development server does not generate the support pages. Check the calculator at phone and desktop sizes, policy/guide navigation, default-off ad behavior, unknown-route 404s, and a reload of each direct page URL. Check the output's title, canonical URL, sitemap, and robots file.

The existing Vercel project deploys GitHub `main` automatically. Review and commit/push through your usual workflow or deploy the reviewed branch first. This change has not pushed a commit or deployed production. Confirm that the public domain loads over HTTPS without authentication and redirects alternative domain versions to the canonical hostname.

## 2. Add the site in AdSense, with serving still disabled

Sign in to [Google AdSense](https://www.google.com/adsense/), add `wages-calculator.com`, and copy the publisher ID issued to your account. In Vercel's **Production** environment, set:

| Variable | Value |
| --- | --- |
| `SITE_URL` | `https://wages-calculator.com` |
| `ADSENSE_PUBLISHER_ID` | Your actual `ca-pub-` ID followed by 16 digits |
| `ADSENSE_ENABLED` | `false` |
| `ADSENSE_CONSENT_READY` | `false` |

Redeploy after changing build-time variables. The exported pages include the `google-adsense-account` meta tag, and `/ads.txt` contains the matching seller ID. No publisher line or verification tag is generated when the ID is absent. Invalid settings fail the export instead of publishing a dummy integration.

Choose AdSense's **Meta tag** site-verification option and request review. Google [supports meta-tag ownership verification](https://support.google.com/adsense/answer/7584263?hl=en), so you can verify the site without requesting advertisements. Check that `/ads.txt` is a plain-text response at the root of the domain. Google [recommends ads.txt](https://support.google.com/adsense/answer/12171612?hl=en); it is not itself an approval guarantee.

Never click your own advertisements or ask visitors to click them. Do not buy artificial traffic.

## 3. Publish the consent messages before enabling ads

In AdSense **Privacy & messaging**, create and publish Google's European regulations message for this site, using the live Privacy Policy URL. Configure applicable US state messages and any other messages appropriate to the audience. Google's [certified CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en) apply to relevant EEA, UK, and Swiss traffic. A custom cookie notice alone is not a replacement for the required CMP.

This integration uses Google's published Privacy & messaging messages, which are delivered through the AdSense script. The **Ad privacy choices** control appears when Google's API reports that the European consent message applies. Google's own US privacy opt-out controls remain in place. Follow Google's [message preview instructions](https://developers.google.com/funding-choices/fc-api-docs#testing_and_debugging_on_your_site) to check the relevant regions and consent choices.

`ADSENSE_CONSENT_READY=true` records your confirmation that the account-side messages are published; it does not configure the CMP or prove legal compliance. Do not set it just to bypass the export guard.

## 4. Enable a manual ad unit after approval

Wait until AdSense shows the site's status as **Ready**. Create a responsive **Display ad** under **Ads → By ad unit**, then copy the numeric `data-ad-slot` value. Set:

| Variable | Value |
| --- | --- |
| `ADSENSE_ENABLED` | `true` |
| `ADSENSE_CONSENT_READY` | `true` after completing the consent setup |
| `ADSENSE_MODE` | `manual` |
| `ADSENSE_SLOT` | The numeric slot from your real display ad unit |

Redeploy. Manual mode needs both publisher and slot IDs. Keep **Auto ads off in the AdSense dashboard** when using this placement: the common AdSense script can also activate Auto ads according to your account settings. The code cannot override those dashboard controls.

Manual placements appear after the calculator on the homepage and after the guide text. Keep ads distinct from inputs, results, and navigation. An unfilled or blocked ad should not stop the calculator from working. Never use a live ad click as a test.

## 5. Optional Auto ads

Set `ADSENSE_MODE=auto` instead of manual, keep the publisher/consent/activation settings, and redeploy. The manual placement is then omitted. In AdSense enable Auto ads and review its preview before applying settings.

Exclude the calculator inputs/results and the area above the tool. Exclude policy/contact pages and avoid disruptive overlay formats. Use banner Advanced settings for ad count and spacing, along with excluded areas and page exclusions. Google [updated these controls in 2026](https://support.google.com/adsense/answer/16683740?hl=en-GB); the older Ad Balance/ad-load advice is not the current workflow. JavaScript cannot guarantee where dashboard-configured Auto ads will appear.

## 6. Search and performance

Add a Domain property in [Search Console](https://search.google.com/search-console) and verify it through the DNS record Google provides. Alternatively, add a URL-prefix property and put its HTML meta verification token in `GOOGLE_SITE_VERIFICATION`, then redeploy. Submit `https://wages-calculator.com/sitemap.xml` and inspect the homepage and guide URLs. Verification and sitemap generation do not automatically submit the sitemap or guarantee indexing.

Use Search Console for search queries and indexing, and AdSense reports for impressions, earnings, and page RPM. Review ad density and user experience once you have representative traffic; no performance history is created by installing the script.

Google Analytics is an optional separate account/integration step. If you add GA4, first choose an appropriate consent setup, update the privacy disclosures, and disable or carefully configure automatic collection that could send form values, query parameters, or other personal information. Calculator income values must not become analytics events. Google's [Consent Mode guide](https://developers.google.com/tag-platform/security/concepts/consent-mode) explains the difference between delaying tags until consent and sending cookieless measurements before consent.

## Remaining owner actions

Review and publish the changes; provide the real publisher ID; verify/request AdSense review; publish consent messages; wait for Ready status; provide an ad slot or configure Auto ads; explicitly enable serving; and verify/submit the site in Search Console. A direct support email can replace or supplement the current GitHub contact channel once you have one to publish.
