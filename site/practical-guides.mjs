import {
  link,
  list,
  note,
  table,
  article,
  formula,
  section,
  paragraph,
} from './content-helpers.mjs';

export const practicalGuides = [
  {
    kind: `guide`,
    slug: `guides/variable-hours-and-pay-changes`,
    title: `Estimate income when hours or pay change`,
    description: `Combine seasonal hours or a midyear raise into an annual pay estimate, with weighted averages, worked examples, and calculator input steps.`,
    body: article(
      `variable-pay-guide`,
      `Estimate income when hours or pay change`,
      `A single weekly schedule cannot describe every working year. Build an annual estimate by separating periods with different hours or rates, calculating each period, and adding their gross pay.`,
      paragraph(
        `variable-pay-revision`,
        `Published by Piratechs. Content updated October 4, 2026. The examples below are fictional straight-time pay scenarios with no bonuses or overtime premiums.`,
      ) +
      section(
        `variable-pay-plan`,
        `Start with a period-by-period plan`,
        formula(
          `variable-pay-period-formula`,
          `Period gross pay = hourly rate × weekly paid hours × paid weeks in that period`,
        ) +
        paragraph(
          `variable-pay-plan-text`,
          `Use periods that do not overlap. Include paid leave consistently and leave unpaid weeks out of the paid-week total. For an estimate made during the year, combine gross earnings already recorded with expected earnings for the remaining periods. Keep the assumptions beside the total so you can update them when the schedule changes.`,
        ),
      ) +
      section(
        `variable-pay-seasonal`,
        `One rate, two seasonal schedules`,
        table(
          `variable-pay-seasonal-table`,
          `Fictional year at $22 per hour with 50 paid weeks`,
          [`Period`, `Hours per week`, `Paid weeks`, `Gross pay`],
          [
            [`Quieter season`, `24`, `20`, `$10,560.00`],
            [`Busier season`, `36`, `30`, `$23,760.00`],
            [`Combined year`, `31.2 weighted average`, `50`, `$34,320.00`],
          ],
        ) +
        formula(
          `variable-pay-weighted-formula`,
          `Average weekly hours = (24 × 20 + 36 × 30) ÷ 50 = 31.2`,
        ) +
        paragraph(
          `variable-pay-weighted-explanation`,
          `The two periods contain 1,560 paid hours. A simple average of 24 and 36 gives 30 hours and understates the year because the busier schedule lasts longer. Weighting by paid weeks gives the same $34,320.00 annual total as calculating the periods separately.`,
        ) +
        list(
          `variable-pay-seasonal-inputs`,
          [
            `Set hours per week to 31.2 and paid weeks per year to 50. Set days per week only if you want an average daily value.`,
            `Enter the $22 hourly rate last to keep that rate as the source amount. The annual gross result is $34,320.00 and the average month is $2,860.00.`,
            `Use separate 24-hour and 36-hour scenarios when planning seasonal cash flow. The combined monthly average does not describe either season’s actual deposits.`,
          ],
        ),
      ) +
      section(
        `variable-pay-raise`,
        `Two rates after a midyear raise`,
        table(
          `variable-pay-raise-table`,
          `Fictional year with 40 paid hours per week`,
          [`Period`, `Hourly rate`, `Paid weeks`, `Gross pay`],
          [
            [`Before raise`, `$20.00`, `26`, `$20,800.00`],
            [`After raise`, `$23.00`, `26`, `$23,920.00`],
            [`Combined year`, `Different rates`, `52`, `$44,720.00`],
          ],
        ) +
        paragraph(
          `variable-pay-raise-context`,
          `Using $23 for all 52 weeks would estimate a full year at the new rate, rather than the year containing the raise. To display the combined year, set 40 hours and 52 paid weeks, then enter $44,720 in annual salary last. This field can hold the combined annual gross amount even though the earnings came from hourly work.`,
        ) +
        paragraph(
          `variable-pay-raise-result`,
          `The average month is $3,726.67. The displayed $21.50 hourly equivalent summarizes the year; it is neither period’s actual rate. Keep the two source rows when checking individual payments.`,
        ),
      ) +
      section(
        `variable-pay-limits`,
        `When an average is the wrong shortcut`,
        paragraph(
          `variable-pay-mixed-rates`,
          `Average hours alone cannot combine different rates. If both rates and hours change, calculate each period using its own rate and hours, add the totals, and enter the total annual amount last. An unweighted average of rates can misstate earnings when more hours are paid at one rate.`,
        ) +
        note(
          `variable-pay-overtime-note`,
          `Do not use an annual average to determine overtime. This calculator multiplies every hour by one rate and does not apply premiums. The ${link(`variable-pay-dol-link`, `https://www.dol.gov/agencies/whd/overtime`, `U.S. Department of Labor’s overtime overview`)} explains the workweek basis of federal overtime rules. Keep premium pay separate from these examples.`,
        ) +
        paragraph(
          `variable-pay-next`,
          `${link(`variable-pay-calculator-link`, `/#income`, `Enter your income scenario`)}. See the ${link(`variable-pay-schedules-link`, `/guides/work-schedules/`, `schedule guide`)} and ${link(`variable-pay-methodology-link`, `/methodology/`, `calculation methodology`)} for how averages are displayed. Report an unclear example through ${link(`variable-pay-contact-link`, `/contact/`, `Contact`)}.`,
        ),
      ),
    ),
  },
  {
    kind: `guide`,
    slug: `guides/check-your-paycheck`,
    title: `Compare a paycheck with your pay estimate`,
    description: `Reconcile regular gross pay, understand a deduction percentage, and compare the same pay period before using an annual or monthly wage estimate.`,
    body: article(
      `paycheck-check-guide`,
      `Compare a paycheck with your pay estimate`,
      `A calculator result and a paycheck can disagree because they describe different periods or deductions. Start with the pay period, reconcile gross earnings, and then subtract the deductions shown on that statement.`,
      paragraph(
        `paycheck-check-revision`,
        `Published by Piratechs. Content updated October 4, 2026. All amounts below are fictional examples for understanding the arithmetic.`,
      ) +
      section(
        `paycheck-check-records`,
        `Match the period before comparing amounts`,
        list(
          `paycheck-check-records-list`,
          [
            `Find the period start and end dates. The deposit date can be later than the work it pays for.`,
            `Use current-period earnings and deductions, rather than year-to-date totals.`,
            `Separate regular earnings from paid leave, overtime, bonuses, reimbursements, and corrections shown on the statement.`,
            `Match the rate and paid hours to your own records. If a rate changed during the period, keep the earnings lines separate.`,
          ],
        ) +
        paragraph(
          `paycheck-check-period-context`,
          `The calculator’s monthly result is annual income divided by 12. It does not represent a particular deposit or month. Its weekly figure is an average paid week based on your inputs, which may differ from the hours on this statement.`,
        ),
      ) +
      section(
        `paycheck-check-gross`,
        `Reconcile regular gross earnings`,
        formula(
          `paycheck-check-gross-formula`,
          `Regular gross pay = $23 × 76 paid hours = $1,748.00`,
        ) +
        paragraph(
          `paycheck-check-gross-example`,
          `Suppose a two-week statement contains 36 regular hours in the first week and 40 in the second, all paid at $23. There are 76 hours in the period. Comparing that $1,748.00 gross with two assumed 40-hour weeks would introduce four hours that were not recorded.`,
        ) +
        paragraph(
          `paycheck-check-gross-recipe`,
          `For a rough recurring scenario, enter 38 hours per week, your expected paid weeks for the year, and $23 hourly last. That represents the period’s average weekly hours; it does not establish that every future week will match. To check this particular statement, keep the direct 76-hour multiplication above.`,
        ) +
        note(
          `paycheck-check-overtime-note`,
          `A two-week total alone cannot determine overtime. Inspect the separate workweeks and any premium earnings. This calculator does not determine entitlement or calculate premiums. Consult the ${link(`paycheck-check-dol-link`, `https://www.dol.gov/agencies/whd/overtime`, `Department of Labor’s overtime overview`)} for the federal framework.`,
        ),
      ) +
      section(
        `paycheck-check-deductions`,
        `Trace gross pay to net pay`,
        table(
          `paycheck-check-deduction-table`,
          `Separate fictional deduction example for one pay period`,
          [`Statement line`, `Amount`],
          [
            [`Gross earnings`, `$1,600.00`],
            [`Income-tax withholding`, `−$180.00`],
            [`Other payroll taxes`, `−$120.00`],
            [`Insurance deduction`, `−$80.00`],
            [`Retirement contribution`, `−$80.00`],
            [`Net pay`, `$1,140.00`],
          ],
        ) +
        paragraph(
          `paycheck-check-total-deduction`,
          `Total deductions are $460.00, so the historical total deduction percentage is $460 ÷ $1,600 × 100 = 28.75%. Taxes alone are $300.00, or 18.75% of gross. Neither number is a tax bracket or a prediction of final tax liability.`,
        ) +
        paragraph(
          `paycheck-check-flat-estimate`,
          `Entering 28.75% in the calculator would reproduce this example’s net-to-gross ratio as a flat scenario, but it would combine taxes and benefits under the tax-estimate label. Keep that distinction in your notes. The calculator does not separately model insurance or retirement contributions.`,
        ) +
        paragraph(
          `paycheck-check-raise-warning`,
          `Reusing the percentage after a raise assumes every deduction increases in proportion to gross pay. A fixed $80 insurance deduction may stay $80, while other deductions can change. Rebuild the deduction estimate from the applicable amounts instead of assuming the old ratio still describes the new paycheck.`,
        ),
      ) +
      section(
        `paycheck-check-calendar`,
        `Use actual pay dates for a monthly budget`,
        paragraph(
          `paycheck-check-calendar-text`,
          `A biweekly schedule can place two or three deposits in a calendar month. Dividing annual income by 12 smooths those differences; it does not tell you when cash arrives. Use your employer’s pay calendar and expected net amounts for bills due on specific dates. Compare earnings over the same period before treating a deposit difference as a payroll error.`,
        ),
      ) +
      section(
        `paycheck-check-help`,
        `Resolve the remaining difference`,
        paragraph(
          `paycheck-check-payroll-help`,
          `Ask payroll to explain an unfamiliar earnings or deduction line using the period dates and your records. For a more detailed U.S. federal income-tax withholding estimate, the ${link(`paycheck-check-irs-link`, `https://www.irs.gov/individuals/tax-withholding-estimator`, `IRS Tax Withholding Estimator`)} collects details this calculator does not; review its eligibility and preparation instructions.`,
        ) +
        paragraph(
          `paycheck-check-next`,
          `Read ${link(`paycheck-check-gross-guide-link`, `/guides/gross-and-take-home/`, `Gross pay vs. take-home pay`)} and the ${link(`paycheck-check-methodology-link`, `/methodology/`, `calculation methodology`)}, then ${link(`paycheck-check-calculator-link`, `/#income`, `adjust your calculator assumptions`)}. For a site calculation issue, ${link(`paycheck-check-contact-link`, `/contact/`, `send a fictional example through Contact`)}. This guide does not determine legal pay rights or individual tax obligations.`,
        ),
      ),
    ),
  },
];
