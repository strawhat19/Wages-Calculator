import { SiteResultHelp } from './SiteContent';
import { calculateWages, formatMoney, type CalculatorInputs } from '../lib/calculator';

type ResultsProps = {
  compact: boolean;
  inputs: CalculatorInputs;
};

export const Results = ({ inputs }: ResultsProps) => {
  const calculation = calculateWages(inputs);
  const takeHomeShare = 100 - calculation.taxRate;
  const meterWidth = Math.min(100, Math.max(0, takeHomeShare));

  return (
    <section
      id={`calculator-results`}
      className={`results-column`}
      aria-labelledby={`breakdown-heading`}
    >
      <header
        id={`breakdown-heading-row`}
        className={`breakdown-heading-row`}
      >
        <h2
          id={`breakdown-heading`}
          className={`breakdown-heading`}
        >
          {`Your pay breakdown`}
        </h2>
        <span
          id={`breakdown-live`}
          className={`breakdown-live`}
        >
          <span
            aria-hidden={true}
            id={`breakdown-live-dot`}
            className={`breakdown-live-dot`}
          />
          {`Live`}
        </span>
      </header>
      <div
        id={`pay-summary`}
        className={`pay-summary`}
      >
        <div
          id={`pay-summary-copy`}
          className={`pay-summary-copy`}
        >
          <p
            id={`pay-summary-label`}
            className={`pay-summary-label`}
          >
            {`Estimated monthly take-home`}
          </p>
          <p
            id={`pay-summary-value`}
            className={`pay-summary-value`}
          >
            {formatMoney(calculation.monthlyNet)}
          </p>
          <p
            id={`pay-summary-context`}
            className={`pay-summary-context`}
          >
            {`after your ${calculation.taxRate}% tax estimate`}
          </p>
        </div>
        <div
          id={`pay-summary-share`}
          className={`pay-summary-share`}
        >
          <p
            id={`pay-summary-share-value`}
            className={`pay-summary-share-value`}
          >
            {`${takeHomeShare}%`}
          </p>
          <p
            id={`pay-summary-share-label`}
            className={`pay-summary-share-label`}
          >
            {`of gross pay`}
          </p>
          <div
            aria-hidden={true}
            id={`pay-summary-meter`}
            className={`pay-summary-meter`}
          >
            <span
              id={`pay-summary-meter-fill`}
              className={`pay-summary-meter-fill`}
              style={{ width: `${meterWidth}%` }}
            />
          </div>
        </div>
      </div>
      <table
        id={`income-table`}
        className={`income-table`}
      >
        <caption
          id={`income-table-caption`}
          className={`income-table-caption`}
        >
          {`Estimated gross income, flat tax, and take-home pay for each period, in US dollars.`}
        </caption>
        <thead
          id={`income-table-head`}
          className={`income-table-head`}
        >
          <tr
            id={`income-table-header`}
            className={`income-table-header`}
          >
            <th
              scope={`col`}
              id={`income-table-period-header`}
              className={`income-table-period-header`}
            >
              {`Period`}
            </th>
            <th
              scope={`col`}
              id={`income-table-gross-header`}
              className={`income-table-gross-header`}
            >
              {`Gross`}
            </th>
            <th
              scope={`col`}
              id={`income-table-tax-header`}
              className={`income-table-tax-header`}
            >
              {`Tax`}
            </th>
            <th
              scope={`col`}
              id={`income-table-net-header`}
              className={`income-table-net-header`}
            >
              {`Take-home`}
            </th>
          </tr>
        </thead>
        <tbody
          id={`income-table-body`}
          className={`income-table-body`}
        >
          {calculation.periods.map(period => (
            <tr
              key={period.id}
              id={`income-table-row-${period.id}`}
              className={`income-table-row${period.id === `monthly` ? ` income-table-row-highlight` : ``}`}
            >
              <th
                scope={`row`}
                id={`income-table-period-${period.id}`}
                className={`income-table-period`}
              >
                {period.label}
              </th>
              <td
                data-label={`Gross`}
                id={`income-table-gross-${period.id}`}
                className={`income-table-gross`}
              >
                {formatMoney(period.gross)}
              </td>
              <td
                data-label={`Tax`}
                id={`income-table-tax-${period.id}`}
                className={`income-table-tax`}
              >
                {formatMoney(period.tax)}
              </td>
              <td
                data-label={`Take-home`}
                id={`income-table-net-${period.id}`}
                className={`income-table-net`}
              >
                {formatMoney(period.net)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p
        id={`breakdown-assumptions`}
        className={`breakdown-assumptions`}
      >
        {`USD · ${calculation.taxRate}% flat tax estimate. Actual take-home pay depends on taxes, benefits, and other deductions.`}
      </p>
      <SiteResultHelp />
    </section>
  );
};
