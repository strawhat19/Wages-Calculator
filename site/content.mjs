const paragraph = (id, text) => `<p class="site-paragraph" id="${id}">${text}</p>`;
const heading = (id, text) => `<h2 class="site-heading" id="${id}">${text}</h2>`;
const link = (id, href, text) => `<a class="site-link" id="${id}" href="${href}">${text} →</a>`;
const formula = (id, text) => `<p class="site-formula" id="${id}">${text}</p>`;
const note = (id, text) => `<aside class="site-note" id="${id}">${text}</aside>`;
const section = (id, title, content) => `<section class="site-section" id="${id}">${heading(`${id}-title`, title)}${content}</section>`;
const list = (id, items) => `<ul class="site-list" id="${id}">${items.map((item, index) => `<li class="site-list-item" id="${id}-item-${index + 1}">${item}</li>`).join(``)}</ul>`;
const article = (id, title, intro, content) => `<article class="site-copy site-article" id="${id}"><p class="site-eyebrow" id="${id}-eyebrow">Wages Calculator · Piratechs</p><h1 class="site-title" id="${id}-title">${title}</h1><p class="site-intro" id="${id}-intro">${intro}</p>${content}</article>`;
const table = (id, caption, columns, rows) => `<div class="site-table-scroll" id="${id}-scroll"><table class="site-table" id="${id}"><caption class="site-table-caption" id="${id}-caption">${caption}</caption><thead class="site-table-head" id="${id}-head"><tr class="site-table-row" id="${id}-head-row">${columns.map((column, index) => `<th class="site-table-heading" id="${id}-heading-${index + 1}" scope="col">${column}</th>`).join(``)}</tr></thead><tbody class="site-table-body" id="${id}-body">${rows.map((row, index) => `<tr class="site-table-row" id="${id}-row-${index + 1}">${row.map((cell, cellIndex) => cellIndex === 0 ? `<th class="site-table-label" id="${id}-row-${index + 1}-cell-${cellIndex + 1}" scope="row">${cell}</th>` : `<td class="site-table-cell" id="${id}-row-${index + 1}-cell-${cellIndex + 1}">${cell}</td>`).join(``)}</tr>`).join(``)}</tbody></table></div>`;

export const siteLinks = [
  { href: `/guides/hourly-to-salary/`, label: `Hourly to salary` },
  { href: `/guides/salary-to-hourly/`, label: `Salary to hourly` },
  { href: `/guides/gross-and-take-home/`, label: `Gross & take-home` },
  { href: `/guides/work-schedules/`, label: `Schedules & pay periods` },
];

export const homeContent = `<section class="site-copy site-home-copy" id="home-copy">
  <h2 class="site-title" id="home-copy-title">Understand the pay behind the number</h2>
  <p class="site-intro" id="home-copy-intro">Compare hourly pay and annual salary using your own work schedule, then explore gross income and a simple take-home estimate. All amounts are shown in U.S. dollars.</p>
  ${section(`home-how`, `How to use the calculator`, list(`home-steps`, [
    `Enter either your hourly rate or annual salary. The pay field you edit most recently controls the calculation; the other updates to show its equivalent.`,
    `Set hours per week, days per week, and paid weeks per year. Include paid leave in paid weeks; exclude unpaid time.`,
    `Choose a flat tax estimate for a rough scenario. The starting 24% is an example, not a recommended rate or an estimate of your personal tax liability.`,
    `Compare the hourly, daily, weekly, monthly, and yearly results. Monthly means annual income divided by 12; weekly means income per paid week.`,
  ]))}
  ${section(`home-example`, `A worked example`, paragraph(`home-example-input`, `At $25 an hour, 40 hours a week, and 52 paid weeks, gross annual income is $52,000.00. Gross pay is $1,000.00 per paid week and $4,333.33 per average calendar month. With five workdays per week, the average gross day is $200.00.`) + paragraph(`home-example-output`, `A flat 24% estimate subtracts $12,480.00 for the year, leaving $39,520.00, or $3,293.33 per average month. Those figures do not include separate benefit deductions, retirement contributions, overtime premiums, or tax brackets.`))}
  ${section(`home-guides`, `Go further with your comparison`, `<div class="site-guide-grid" id="home-guide-grid">${siteLinks.map((item, index) => `<a class="site-guide-link" id="home-guide-link-${index + 1}" href="${item.href}">${item.label} →</a>`).join(``)}</div>`)}
  ${note(`home-method-note`, `Your inputs and theme are saved in this browser when local storage is available. The calculator does not ask for your name, employer, or bank details. Use the results for comparison and check actual pay against your employer’s records. ${link(`home-privacy-link`, `/privacy/`, `Read the privacy policy`)}`)}
</section>`;

export const sitePages = [
  {
    kind: `guide`,
    slug: `guides/hourly-to-salary`,
    title: `Hourly pay to annual salary`,
    description: `Convert hourly pay into annual and monthly income, with worked examples for paid leave, part-time hours, and unpaid weeks.`,
    body: article(`hourly-guide`, `Hourly pay to annual salary`, `An hourly rate becomes a useful annual comparison only when you include the number of hours and paid weeks behind it.`,
      section(`hourly-formula`, `Start with your paid schedule`,
        formula(`hourly-equation`, `Annual gross income = hourly rate × hours per week × paid weeks per year`) +
        paragraph(`hourly-input-method`, `Enter your hourly rate last to make it the source of the calculation. When you change the work schedule afterward, that hourly rate stays fixed and the annual equivalent updates. The displayed equivalent is rounded to cents; calculation results retain their underlying precision.`) +
        paragraph(`hourly-paid-weeks`, `Paid weeks are the weeks of income you want to include. Someone paid for 50 working weeks plus two weeks of paid leave can use 52. Someone who works 50 weeks and receives no pay for the other two can use 50. Keep the treatment of paid time consistent when comparing offers.`)) +
      section(`hourly-examples`, `What $25 an hour can mean`,
        table(`hourly-scenarios`, `Illustrative gross income at $25 per hour`, [`Schedule`, `Paid weeks`, `Yearly gross`, `Average month`], [
          [`40 hours per week`, `52`, `$52,000.00`, `$4,333.33`],
          [`40 hours per week`, `50`, `$50,000.00`, `$4,166.67`],
          [`30 hours per week`, `52`, `$39,000.00`, `$3,250.00`],
        ]) + paragraph(`hourly-example-explained`, `The first and second scenarios have the same $1,000.00 gross paid week. The two unpaid weeks in the second scenario reduce the annual total by $2,000.00. Monthly results spread that annual total across all 12 calendar months, including months containing unpaid time.`)) +
      section(`hourly-days`, `Where days per week fits`,
        paragraph(`hourly-days-explained`, `Days per week changes the average daily result, not the hourly annualization. At 40 weekly hours, a four-day schedule averages 10 hours per day and a five-day schedule averages eight. At $25 per hour, those average days are $250.00 and $200.00 respectively. Both schedules still produce a $1,000.00 gross paid week.`)) +
      section(`hourly-comparison`, `Compare the whole offer`,
        list(`hourly-comparison-list`, [
          `Use the same paid-week assumption for an initial comparison, then adjust each offer for its actual leave arrangements.`,
          `If your hours vary, run a lower-hours and higher-hours scenario. A single average can hide seasonal gaps.`,
          `Evaluate bonuses, benefits, commuting costs, and unpaid time separately. The calculator does not add these to an hourly rate.`,
          `Overtime hours are multiplied by the entered rate. Overtime premiums are not calculated automatically.`,
        ]) + paragraph(`hourly-next`, `${link(`hourly-open-calculator`, `/`, `Try your hourly rate`)} or ${link(`hourly-schedule-link`, `/guides/work-schedules/`, `learn how paid weeks affect the results`)}.`)) +
      note(`hourly-limits`, `This is a pay conversion, not a payroll calculation or a determination of overtime entitlement. Amounts are displayed in USD; no currency conversion is performed.`)),
  },
  {
    kind: `guide`,
    slug: `guides/salary-to-hourly`,
    title: `Annual salary to hourly pay`,
    description: `Find the effective hourly value of a salary and see how hours, paid weeks, and workdays change your comparison.`,
    body: article(`salary-guide`, `Annual salary to hourly pay`, `The same annual salary can represent very different hourly values. Your schedule supplies the missing part of the comparison.`,
      section(`salary-formula`, `Divide salary by annual hours`,
        formula(`salary-equation`, `Effective hourly rate = annual gross salary ÷ (hours per week × paid weeks per year)`) +
        paragraph(`salary-input-method`, `Enter annual salary last so it remains the source amount. Changing hours or paid weeks then changes the hourly equivalent while keeping the annual salary fixed. Editing the hourly field instead switches the calculation to hourly income.`) +
        paragraph(`salary-standard-example`, `For a $60,000.00 salary with 40 hours per week and 52 paid weeks, annual hours are 2,080. Dividing $60,000.00 by 2,080 gives an effective rate of $28.85 per hour when displayed to cents. This is a comparison rate, not necessarily the rate used on a payslip or for overtime.`)) +
      section(`salary-scenarios`, `More hours change the comparison`,
        table(`salary-hours-table`, `Illustrative $60,000 annual salary with 52 paid weeks`, [`Hours per week`, `Annual hours`, `Hourly equivalent`], [
          [`35`, `1,820`, `$32.97`],
          [`40`, `2,080`, `$28.85`],
          [`45`, `2,340`, `$25.64`],
        ]) + paragraph(`salary-scenarios-context`, `All three rows have the same $5,000.00 average gross month. The hourly equivalent falls as scheduled hours increase. Include the hours you are actually comparing; a nominal schedule can understate a role’s regular time commitment.`)) +
      section(`salary-paid-weeks`, `What happens if you change paid weeks?`,
        paragraph(`salary-paid-weeks-example`, `Keeping a $60,000.00 annual salary fixed while using 40 hours and 50 paid weeks produces 2,000 annual hours and a $30.00 hourly equivalent. The paid-week gross becomes $1,200.00. The annual salary and $5,000.00 average calendar month do not change.`) +
        paragraph(`salary-paid-weeks-warning`, `If unpaid leave will actually reduce the amount you receive in the year, enter that reduced annual income yourself. Salary mode does not reduce an entered annual salary automatically when paid weeks change. If paid vacation is included in the annual salary, normally include it in the paid-week schedule for a consistent pay comparison.`)) +
      section(`salary-compare`, `A useful offer comparison`,
        paragraph(`salary-compare-example`, `An hourly offer of $30.00 for 40 hours and 50 paid weeks produces the same $60,000.00 annual gross as the example salary. It produces $62,400.00 if all 52 weeks are paid. Check schedule and leave assumptions before treating the headline rates as equivalent.`) +
        paragraph(`salary-days-explained`, `Days per week changes the average daily value. It does not change a fixed annual salary or its hourly equivalent when weekly hours and paid weeks stay the same.`) +
        paragraph(`salary-next`, `${link(`salary-open-calculator`, `/`, `Compare a salary`)} or ${link(`salary-net-link`, `/guides/gross-and-take-home/`, `understand the take-home estimate`)}.`)) +
      note(`salary-limits`, `Benefits, bonuses, unpaid extra hours, and employer payroll rules may change the practical value of an offer. The effective hourly rate is a mathematical comparison, not an employment classification or a legal pay rate.`)),
  },
  {
    kind: `guide`,
    slug: `guides/gross-and-take-home`,
    title: `Gross pay and estimated take-home pay`,
    description: `Understand the calculator’s flat tax estimate, why it differs from a payslip, and how to compare gross and estimated take-home income.`,
    body: article(`take-home-guide`, `Gross pay and estimated take-home pay`, `Gross pay is the income before the calculator’s deduction. The take-home result applies one percentage you choose; it does not calculate a tax return or an exact paycheck.`,
      section(`take-home-method`, `One percentage across every period`,
        formula(`take-home-equation`, `Estimated take-home = gross income × (1 − flat tax estimate ÷ 100)`) +
        paragraph(`take-home-default`, `The starting rate of 24% is illustrative. It is not a personal recommendation, a tax bracket lookup, or a claim about what a worker earning this amount owes. The same entered percentage is applied to every displayed period, from hourly through yearly.`) +
        paragraph(`take-home-example`, `For $52,000.00 of annual gross pay and a 24% estimate, the calculated annual deduction is $12,480.00 and estimated take-home is $39,520.00. Dividing by 12 gives $1,040.00 in estimated deductions and $3,293.33 in take-home per average month.`)) +
      section(`take-home-scenarios`, `Use scenarios to see the range`,
        table(`take-home-rate-table`, `Illustrative estimates on $52,000 annual gross pay`, [`Flat estimate`, `Yearly deduction`, `Yearly take-home`, `Average monthly take-home`], [
          [`20%`, `$10,400.00`, `$41,600.00`, `$3,466.67`],
          [`24%`, `$12,480.00`, `$39,520.00`, `$3,293.33`],
          [`30%`, `$15,600.00`, `$36,400.00`, `$3,033.33`],
        ]) + paragraph(`take-home-scenarios-context`, `These are arithmetic scenarios, not forecasts of anyone’s tax bill. Comparing more than one rate helps reveal how sensitive a rough budget is to the assumption. It does not make the underlying estimate more precise.`)) +
      section(`take-home-payslip`, `Why a payslip may look different`,
        list(`take-home-differences`, [
          `The calculator has no filing status, tax brackets, deductions, credits, dependents, or location-based tax rules.`,
          `It does not separately calculate payroll taxes, pension or retirement contributions, insurance, or other benefit deductions.`,
          `A monthly average is not a pay-date forecast. Biweekly paychecks and twice-monthly paychecks have different schedules.`,
          `Bonuses, overtime premiums, commissions, and changes during the year are not modeled automatically.`,
        ]) + paragraph(`take-home-use-payslip`, `For a rough comparison with a recent payslip, compare the same period and the same included income. A total deduction divided by gross pay gives a historical deduction percentage, but that percentage may include items besides tax and may change when pay or benefits change. Do not treat it as a tax bracket.`)) +
      section(`take-home-next-step`, `When you need a more specific number`,
        paragraph(`take-home-irs`, `For U.S. federal income tax withholding, the ${link(`take-home-irs-link`, `https://www.irs.gov/individuals/tax-withholding-estimator`, `IRS Tax Withholding Estimator`)} asks for details that this calculator does not collect. Review its eligibility and required information before using it. Your employer’s payroll team can explain the deductions and schedule on your actual payslip.`) +
        paragraph(`take-home-next`, `${link(`take-home-open-calculator`, `/`, `Explore a flat-rate scenario`)} or ${link(`take-home-schedules-link`, `/guides/work-schedules/`, `compare monthly averages and pay periods`)}.`)) +
      note(`take-home-limits`, `Use this calculator for illustrations and comparisons. It does not provide personalized tax, financial, or payroll advice. Displayed values are rounded to cents, so separately rounded amounts can differ by a cent from a total.`)),
  },
  {
    kind: `guide`,
    slug: `guides/work-schedules`,
    title: `Work schedules, paid weeks, and pay periods`,
    description: `Learn why average monthly pay differs from a paycheck, how paid weeks affect income, and how to enter part-time or compressed schedules.`,
    body: article(`schedule-guide`, `Work schedules, paid weeks, and pay periods`, `A pay rate tells only part of the story. Hours, workdays, paid weeks, and the dates you receive pay answer different questions.`,
      section(`schedule-inputs`, `What each schedule field does`,
        list(`schedule-input-list`, [
          `Hours per week is your total weekly paid-hours assumption. It controls annual income in hourly mode and the hourly equivalent in salary mode.`,
          `Days per week divides weekly income into an average workday. It does not add hours or change annual income.`,
          `Paid weeks per year controls annual income in hourly mode. In salary mode, it changes weekly, daily, and hourly equivalents while the entered annual salary stays fixed.`,
        ]) + paragraph(`schedule-limits`, `The calculator allows up to 168 hours per week, seven days per week, and 52 paid weeks per year. These are input limits, not suggested schedules. A period with no hours, days, or paid weeks has no meaningful per-unit rate; the calculator displays zero where a division would otherwise be undefined.`)) +
      section(`schedule-month`, `An average month is not four weeks`,
        paragraph(`schedule-month-example`, `At $25.00 per hour for 40 hours and 52 paid weeks, yearly gross is $52,000.00. The calculator’s monthly result is $52,000.00 ÷ 12 = $4,333.33. Multiplying the $1,000.00 weekly amount by four gives $4,000.00, which only accounts for 48 weeks across a year.`) +
        paragraph(`schedule-unpaid-month`, `With 50 paid weeks, the paid-week amount remains $1,000.00, but annual gross becomes $50,000.00 and the average month becomes $4,166.67. Actual deposits can be lower during unpaid time even though the calculator spreads annual income evenly across calendar months.`)) +
      section(`schedule-paycheck`, `Paycheck frequency is a separate choice`,
        table(`schedule-frequency-table`, `Illustrative distribution of a fixed $52,000 annual gross`, [`Pay frequency`, `Assumed payments`, `Gross per payment`], [
          [`Weekly`, `52 per year`, `$1,000.00`],
          [`Every two weeks`, `26 per year`, `$2,000.00`],
          [`Twice a month`, `24 per year`, `$2,166.67`],
          [`Monthly`, `12 per year`, `$4,333.33`],
        ]) + paragraph(`schedule-paycheck-context`, `This table divides the annual amount by the stated number of payments. The calculator itself does not model individual paychecks. Every two weeks and twice a month are different schedules; the dates and number of deposits depend on your employer’s payroll calendar. Use that calendar for a month-by-month cash-flow plan.`)) +
      section(`schedule-compressed`, `Compressed and part-time schedules`,
        paragraph(`schedule-compressed-example`, `Four 10-hour days and five eight-hour days both total 40 weekly hours. With a $25.00 rate, both produce $1,000.00 gross per paid week, while their average daily values are $250.00 and $200.00. Changing only days per week should not change your annual total.`) +
        paragraph(`schedule-part-time-example`, `For three eight-hour days, enter 24 hours and three days per week. At $25.00 per hour with 52 paid weeks, that is $600.00 per paid week and $31,200.00 per year. If days have different lengths, the daily result is still an average, not a prediction for each shift.`)) +
      section(`schedule-variable`, `When the schedule varies`,
        paragraph(`schedule-variable-method`, `Run separate scenarios for quieter and busier periods, or use a weekly average that reflects the year you are estimating. Keep notes outside the calculator if you need to combine multiple jobs, different hourly rates, or a midyear pay change. Those situations are not automatically combined here.`) +
        paragraph(`schedule-next`, `${link(`schedule-open-calculator`, `/`, `Try your work schedule`)} or ${link(`schedule-hourly-link`, `/guides/hourly-to-salary/`, `see hourly-to-salary examples`)}.`)) +
      note(`schedule-limits-note`, `Amounts are averages based on your inputs. Paid leave, overtime premiums, exact pay dates, and employer-specific payroll practices require information outside this calculator.`)),
  },
  {
    kind: `policy`,
    slug: `about`,
    title: `About Wages Calculator`,
    description: `Learn who publishes Wages Calculator, how its pay conversions work, and what its estimates do and do not include.`,
    body: article(`about-page`, `About Wages Calculator`, `Wages Calculator is a simple pay comparison tool published by Piratechs. It helps make the relationship between a rate, a schedule, and annual income easier to understand.`,
      section(`about-purpose`, `A practical comparison tool`,
        paragraph(`about-purpose-text`, `Use the calculator to compare an hourly offer with a salary, explore the effect of fewer paid weeks, or translate annual pay into an average month. You can enter either hourly pay or annual salary and adjust your schedule without creating an account.`) +
        paragraph(`about-publisher`, `Learn more about the publisher at ${link(`about-piratechs-link`, `https://piratechs.com/`, `Piratechs`)}. The project’s ${link(`about-source-link`, `https://github.com/strawhat19/Wages-Calculator`, `source repository`)} provides a public place to inspect the code and report problems.`)) +
      section(`about-method`, `How the numbers are produced`,
        list(`about-method-list`, [
          `Hourly income is rate × weekly hours × paid weeks. Annual salary is used directly when salary was the last pay field edited.`,
          `Monthly income is annual income divided by 12. Weekly and daily values use the paid schedule you enter.`,
          `The take-home estimate subtracts one user-entered percentage. There are no tax tables, automatic overtime premiums, or currency conversions.`,
          `All money is formatted in U.S. dollars. Calculations retain precision; displayed amounts are rounded to cents.`,
        ]) + paragraph(`about-guides`, `The ${link(`about-hourly-guide`, `/guides/hourly-to-salary/`, `hourly pay guide`)} and ${link(`about-take-home-guide`, `/guides/gross-and-take-home/`, `take-home explanation`)} show worked examples and describe the limits of these methods.`)) +
      section(`about-data`, `Designed for quick, private comparisons`,
        paragraph(`about-data-text`, `Income inputs and your appearance preference are saved locally when browser storage is available. There is no calculator account or cross-device synchronization. Read the ${link(`about-privacy-link`, `/privacy/`, `privacy policy`)} for details about local storage, hosting, and optional third-party services.`)) +
      section(`about-feedback`, `Corrections and feedback`,
        paragraph(`about-feedback-text`, `If a calculation or explanation appears wrong, please tell us what you expected and provide a fictional example that reproduces the issue. The ${link(`about-contact-link`, `/contact/`, `contact page`)} explains how to report it. We do not provide individual tax, employment, or financial advice.`))),
  },
  {
    kind: `policy`,
    slug: `privacy`,
    title: `Privacy Policy`,
    description: `How Wages Calculator uses local storage, hosting services, and optional Google advertising, plus choices for your data.`,
    body: article(`privacy-page`, `Privacy Policy`, `This policy describes the website published by Piratechs at wages-calculator.com. Last updated: September 21, 2026.`,
      section(`privacy-calculator`, `Calculator inputs stay in your browser`,
        paragraph(`privacy-calculator-text`, `Wages Calculator performs its calculations in your browser. It does not ask for your name, employer, address, bank details, or government identifiers. We do not intentionally send your entered wage amounts, schedule, tax estimate, or calculation results to an analytics or advertising service.`) +
        paragraph(`privacy-local-storage`, `The website uses local browser storage, through AsyncStorage, to remember your calculator inputs and theme preference. This lets them return when you reopen the site in the same browser. These preferences are not synchronized to another device. If storage is unavailable, the calculator can still work, but changes may not be saved.`) +
        paragraph(`privacy-clear-data`, `Reset restores the example income and keeps your theme choice. To remove all locally saved settings, clear this site’s data in your browser’s privacy or storage settings. Blocking or clearing storage can prevent preferences from being remembered.`)) +
      section(`privacy-hosting`, `Hosting and routine request information`,
        paragraph(`privacy-hosting-text`, `Visiting a website sends information needed to deliver its pages. Our hosting provider, Vercel, may process request information such as an IP address, requested URL, browser details, and request time for delivery, security, and operational logs. Local calculation does not mean that visiting the website creates no network records.`) +
        paragraph(`privacy-hosting-policy`, `For the provider’s practices, see ${link(`privacy-vercel-link`, `https://vercel.com/legal/privacy-notice`, `Vercel’s privacy notice`)}.`)) +
      section(`privacy-google`, `Optional advertising and analytics status`,
        paragraph(`privacy-google-default`, `Google Analytics is not currently installed. Google AdSense advertising is optional and disabled by default. When enabled on the calculator and guide pages, advertising can help support the website. Policy and contact pages do not load the advertising script. We do not intentionally include calculator amounts in information sent to an advertising service.`) +
        paragraph(`privacy-google-data`, `When advertising is active, Google and its advertising partners may receive information such as the page address, IP address, browser or device information, and interactions with ads. Google and other third-party advertising providers may use cookies or similar identifiers for measurement, fraud prevention, and, depending on settings and consent, personalized advertising based on your visits to this website and other websites.`) +
        paragraph(`privacy-google-resources`, `Read ${link(`privacy-google-policy-link`, `https://policies.google.com/technologies/partner-sites`, `how Google uses information from partner sites`)} and ${link(`privacy-google-main-link`, `https://policies.google.com/privacy`, `Google’s privacy policy`)} for details of their processing.`)) +
      section(`privacy-choices`, `Your privacy choices`,
        paragraph(`privacy-consent-text`, `When advertising is enabled, a Google-certified consent management platform may present choices based on your region. Return to the ${link(`privacy-calculator-link`, `/`, `calculator`)} and use Ad privacy choices, when available, to revisit the consent message. Google’s region-specific privacy controls, including a Do Not Sell or Share option where presented, may also be available. Turning off personalized ads does not necessarily prevent all advertising-related processing.`) +
        paragraph(`privacy-ad-settings`, `You can also review ${link(`privacy-ad-settings-link`, `https://adssettings.google.com/`, `Google’s ad settings`)}. Browser settings can block or remove cookies and site storage. These controls have different scopes; changing one does not automatically change the others.`)) +
      section(`privacy-contact`, `External links and questions`,
        paragraph(`privacy-external-text`, `Links to GitHub, Piratechs, Google, and other external sites take you to services with their own privacy practices. A GitHub issue is public; do not post private income records, account details, or identity documents there.`) +
        paragraph(`privacy-questions`, `For publisher information and ways to report a site issue, visit our ${link(`privacy-contact-link`, `/contact/`, `contact page`)}. We may update this policy as the website changes and will update the date at the top of this page.`))),
  },
  {
    kind: `policy`,
    slug: `terms`,
    title: `Terms of Use`,
    description: `The purpose, limits, and acceptable use of Wages Calculator and its educational pay conversion guides.`,
    body: article(`terms-page`, `Terms of Use`, `These terms describe the use of Wages Calculator, published by Piratechs. Last updated: September 21, 2026.`,
      section(`terms-purpose`, `Information and estimates`,
        paragraph(`terms-purpose-text`, `The calculator and guides are provided for general information and personal comparisons. Results depend on the numbers and assumptions you enter. They are not a payslip, employment agreement, tax filing, guaranteed income figure, or professional advice.`) +
        paragraph(`terms-method-text`, `The calculator uses a flat, user-entered tax estimate. It does not apply tax brackets, determine overtime eligibility, calculate overtime premiums, convert currencies, or model every payroll deduction. All monetary results are displayed in U.S. dollars. Review the guide relevant to your calculation before relying on a result.`)) +
      section(`terms-responsibility`, `Check decisions against appropriate records`,
        paragraph(`terms-responsibility-text`, `Check your entries and compare important results with your employer’s records or an appropriate professional. A difference between this calculator and a payslip does not establish that either an employer or a tax authority has made an error. Work schedules, benefits, deductions, and pay dates may require more detailed information.`)) +
      section(`terms-acceptable-use`, `Use the website responsibly`,
        paragraph(`terms-acceptable-use-text`, `Use the website lawfully. Do not attempt to disrupt its availability, bypass security, inject malicious content, or interfere with another visitor’s use. If ads are displayed, do not generate automated or artificial ad impressions or clicks.`)) +
      section(`terms-availability`, `Availability and corrections`,
        paragraph(`terms-availability-text`, `We aim to make the tool useful, but do not promise uninterrupted availability or error-free information. Features and explanations may change. If you find an issue, use the ${link(`terms-contact-link`, `/contact/`, `contact page`)} to share a reproducible example without personal information.`)) +
      section(`terms-third-parties`, `External sites, ads, and source code`,
        paragraph(`terms-third-parties-text`, `External links and any advertisements lead to third-party services. Their content, products, and privacy practices are controlled by their operators. Displaying a link or advertisement is not a personal recommendation to purchase a product or service.`) +
        paragraph(`terms-source`, `Use of code obtained from the ${link(`terms-source-link`, `https://github.com/strawhat19/Wages-Calculator`, `project repository`)} is subject to any license included there. These website terms do not replace that license.`)) +
      section(`terms-privacy`, `Privacy and updates`,
        paragraph(`terms-privacy-text`, `Read the ${link(`terms-privacy-link`, `/privacy/`, `privacy policy`)} for local storage and third-party processing details. We may revise these terms as the website evolves; the date above identifies this version.`))),
  },
  {
    kind: `policy`,
    slug: `contact`,
    title: `Contact and report a problem`,
    description: `Report a calculator issue, suggest a correction, or find publisher information for Wages Calculator by Piratechs.`,
    body: article(`contact-page`, `Contact and report a problem`, `Wages Calculator is published by Piratechs. Feedback about the calculator, accessibility, or an explanation helps us identify what needs attention.`,
      section(`contact-report`, `Report a website or calculation issue`,
        paragraph(`contact-report-text`, `Use the project’s public GitHub issue tracker to report a bug or request an improvement. GitHub may require an account to submit an issue.`) +
        paragraph(`contact-report-action`, link(`contact-github-link`, `https://github.com/strawhat19/Wages-Calculator/issues/new`, `Open a GitHub issue`)) +
        list(`contact-report-details`, [
          `Describe what you expected and what happened.`,
          `Include fictional input amounts, hours, days, paid weeks, and the flat tax percentage so the calculation can be reproduced.`,
          `Mention which pay field you edited last: hourly rate or annual salary.`,
          `For a display or accessibility issue, include the browser and device type, and describe the affected control or page.`,
        ]) +
        note(`contact-public-note`, `GitHub issues are public. Do not include real payslips, employer documents, bank information, identity documents, or private financial details. Use made-up numbers and remove personal information from screenshots.`)) +
      section(`contact-publisher`, `Publisher information`,
        paragraph(`contact-publisher-text`, `Visit ${link(`contact-piratechs-link`, `https://piratechs.com/`, `Piratechs`)} for information about the publisher. For how this website handles data, read the ${link(`contact-privacy-link`, `/privacy/`, `privacy policy`)}.`)) +
      section(`contact-help`, `Questions about a result`,
        paragraph(`contact-help-text`, `Start with our ${link(`contact-schedule-link`, `/guides/work-schedules/`, `schedule and pay-period guide`)} if a monthly amount seems different from your paycheck. The ${link(`contact-take-home-link`, `/guides/gross-and-take-home/`, `gross and take-home guide`)} explains the flat tax estimate. We cannot provide individual payroll, legal, financial, or tax advice; your employer’s payroll team or an appropriate professional can help with your circumstances.`))),
  },
];
