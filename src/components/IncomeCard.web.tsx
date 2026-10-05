import { Icon, Button, NumberField } from './ui';
import type { CalculatorInputs } from '../lib/calculator';
import { Clock3, Save, ShieldCheck } from 'lucide-react-native';
import { calculateWages, formatMoney, numericValue } from '../lib/calculator';

type IncomeCardProps = {
  onSave: () => void;
  saveReady: boolean;
  saveMessage: string;
  compact: boolean;
  inputs: CalculatorInputs;
  onChange: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
};

const displayAmount = (value: number) => String(Math.round(value * 100) / 100);

export const IncomeCard = ({ inputs, compact, onSave, onChange, saveReady, saveMessage }: IncomeCardProps) => {
  const calculation = calculateWages(inputs);
  const hourlyValue = inputs.mode === `hourly` ? inputs.hourlyRate : displayAmount(calculation.effectiveHourlyRate);
  const salaryValue = inputs.mode === `salary` ? inputs.annualSalary : displayAmount(calculation.annualGross);
  const incompleteSchedule = !numericValue(inputs.weeklyHours) || !numericValue(inputs.daysPerWeek) || !numericValue(inputs.weeksPerYear);
  const changeIncome = (key: `hourlyRate` | `annualSalary`, value: string) => {
    onChange(key, value);
    onChange(`mode`, key === `hourlyRate` ? `hourly` : `salary`);
  };

  return (
    <section
      id={`income-card`}
      className={`income-card`}
      aria-labelledby={`income-heading-title`}
    >
      <header id={`income-heading`} className={`income-heading`}>
        <div id={`income-heading-copy`} className={`income-heading-copy`}>
          <span id={`income-heading-step`} className={`income-heading-step`}>
            {`01`}
          </span>
          <h2 id={`income-heading-title`} className={`income-heading-title`}>
            {`Your income`}
          </h2>
        </div>
        <Button
          icon={Save}
          label={`Save wage`}
          onPress={onSave}
          disabled={!saveReady}
          id={`income-save-wage`}
          className={`income-save-wage`}
          accessibilityLabel={`Save this wage to your saved wages`}
        />
      </header>
      <div
        id={`income-pay-row`}
        className={`income-pay-row`}
        data-income-mode={inputs.mode}
      >
        <NumberField
          prefix={`$`}
          compact={compact}
          max={1_000_000}
          id={`hourly-rate`}
          label={`Hourly rate`}
          value={hourlyValue}
          onSubmit={onSave}
          onChange={value => changeIncome(`hourlyRate`, value)}
        />
        <NumberField
          prefix={`$`}
          compact={compact}
          max={1_000_000_000}
          id={`annual-salary`}
          label={`Annual salary`}
          value={salaryValue}
          onSubmit={onSave}
          onChange={value => changeIncome(`annualSalary`, value)}
        />
      </div>
      <p id={`income-calculation-label`} className={`income-calculation-label`}>
        {`Edit either amount. The other updates automatically.`}
      </p>
      <div id={`income-schedule`} className={`income-schedule`}>
        <div id={`income-schedule-heading`} className={`income-schedule-heading`}>
          <Icon
            size={15}
            icon={Clock3}
            id={`income-schedule-icon`}
            className={`income-schedule-icon`}
          />
          <h3 id={`income-schedule-title`} className={`income-schedule-title`}>
            {`Your work schedule`}
          </h3>
        </div>
        <div id={`schedule-input-row`} className={`schedule-input-row`}>
          <NumberField
            max={168}
            suffix={`hrs`}
            compact={compact}
            id={`weekly-hours`}
            label={`Hours / week`}
            value={inputs.weeklyHours}
            onSubmit={onSave}
            onChange={value => onChange(`weeklyHours`, value)}
          />
          <NumberField
            max={7}
            compact={compact}
            id={`work-days`}
            label={`Days / week`}
            value={inputs.daysPerWeek}
            onSubmit={onSave}
            onChange={value => onChange(`daysPerWeek`, value)}
          />
          <NumberField
            max={52}
            compact={compact}
            id={`paid-weeks`}
            label={`Paid weeks / year`}
            value={inputs.weeksPerYear}
            onSubmit={onSave}
            onChange={value => onChange(`weeksPerYear`, value)}
          />
        </div>
      </div>
      <div id={`income-tax-row`} className={`income-tax-row`}>
        <NumberField
          max={100}
          suffix={`%`}
          compact={compact}
          id={`estimated-tax`}
          label={`Estimated tax`}
          value={inputs.taxRate}
          onSubmit={onSave}
          onChange={value => onChange(`taxRate`, value)}
        />
        <p id={`income-tax-note`} className={`income-tax-note`}>
          {`A flat rate estimate to help you see your take-home pay.`}
        </p>
      </div>
      {incompleteSchedule && (
        <p id={`schedule-warning`} className={`schedule-warning`} role={`alert`}>
          {`Hours, days, and paid weeks must be above zero for a complete breakdown.`}
        </p>
      )}
      <div id={`income-storage-note`} className={`income-storage-note`}>
        <Icon
          size={14}
          icon={ShieldCheck}
          id={`income-storage-icon`}
          className={`income-storage-icon`}
        />
        <p id={`income-save-status`} className={`income-save-status`} aria-live={`polite`}>
          {saveMessage || `Your numbers stay on this device.`}
        </p>
      </div>
      <div id={`income-mobile-summary`} className={`income-mobile-summary`}>
        <div id={`income-mobile-summary-copy`} className={`income-mobile-summary-copy`}>
          <p id={`income-mobile-summary-label`} className={`income-mobile-summary-label`}>
            {`Monthly take-home`}
          </p>
          <p id={`income-mobile-summary-note`} className={`income-mobile-summary-note`}>
            {`Estimated after ${calculation.taxRate}% tax`}
          </p>
        </div>
        <p id={`income-monthly-net`} className={`income-monthly-net`}>
          {formatMoney(calculation.monthlyNet)}
        </p>
      </div>
    </section>
  );
};
