import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Box, Label, NumberField } from './ui';
import { useTheme, type Palette } from '../styles/theme';
import type { CalculatorInputs } from '../lib/calculator';
import { calculateWages, numericValue } from '../lib/calculator';

type IncomeCardProps = {
  compact: boolean;
  inputs: CalculatorInputs;
  onChange: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
};

const displayAmount = (value: number) => String(Math.round(value * 100) / 100);

export const IncomeCard = ({ inputs, compact, onChange }: IncomeCardProps) => {
  const [panelWidth, setPanelWidth] = useState(0);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const stackedPayFields = panelWidth > 0 && panelWidth < (compact ? 280 : 420);
  const calculation = calculateWages(inputs);
  const hourlyValue = inputs.mode === `hourly` ? inputs.hourlyRate : displayAmount(calculation.effectiveHourlyRate);
  const salaryValue = inputs.mode === `salary` ? inputs.annualSalary : displayAmount(calculation.annualGross);
  const incompleteSchedule = !numericValue(inputs.weeklyHours) || !numericValue(inputs.daysPerWeek) || !numericValue(inputs.weeksPerYear);
  const changeIncome = (key: `hourlyRate` | `annualSalary`, value: string) => {
    onChange(key, value);
    onChange(`mode`, key === `hourlyRate` ? `hourly` : `salary`);
  };

  return (
    <Box
      className={`income-card`}
      style={[styles.card, compact && styles.compactCard]}
      onLayout={event => setPanelWidth(event.nativeEvent?.layout?.width ?? 0)}
    >
      <Box className={`income-heading`} style={styles.heading}>
        <Label className={`income-heading-title`} style={[styles.title, compact && styles.compactTitle]} accessibilityRole={`header`}>
          {`Income`}
        </Label>
      </Box>
      <Box className={`income-pay-row`} style={[styles.fieldRow, stackedPayFields && styles.stackedPayRow]}>
        <NumberField
          prefix={`$`}
          compact={compact}
          max={1_000_000}
          id={`hourly-rate`}
          stacked={stackedPayFields}
          label={`Hourly rate`}
          value={hourlyValue}
          onChange={value => changeIncome(`hourlyRate`, value)}
        />
        <NumberField
          prefix={`$`}
          compact={compact}
          max={1_000_000_000}
          id={`annual-salary`}
          stacked={stackedPayFields}
          label={`Annual salary`}
          value={salaryValue}
          onChange={value => changeIncome(`annualSalary`, value)}
        />
      </Box>
      <Box className={`income-details-row`} style={styles.fieldRow}>
        <NumberField
          max={168}
          suffix={`hrs`}
          compact={compact}
          id={`weekly-hours`}
          label={`Hours per week`}
          value={inputs.weeklyHours}
          onChange={value => onChange(`weeklyHours`, value)}
        />
        <NumberField
          max={100}
          suffix={`%`}
          compact={compact}
          id={`estimated-tax`}
          label={`Estimated tax rate`}
          value={inputs.taxRate}
          onChange={value => onChange(`taxRate`, value)}
        />
      </Box>
      <Box className={`schedule-input-row`} style={styles.fieldRow}>
        <NumberField
          max={7}
          compact={compact}
          id={`work-days`}
          label={`Days per week`}
          value={inputs.daysPerWeek}
          onChange={value => onChange(`daysPerWeek`, value)}
        />
        <NumberField
          max={52}
          compact={compact}
          id={`paid-weeks`}
          label={`Paid weeks per year`}
          value={inputs.weeksPerYear}
          onChange={value => onChange(`weeksPerYear`, value)}
        />
      </Box>
      <Box className={`income-calculation-note`} style={styles.explanation}>
        <Label className={`income-calculation-label`} style={styles.explanationText}>
          {`Edit hourly rate or annual salary`}
        </Label>
      </Box>
      {incompleteSchedule && (
        <Label className={`schedule-warning`} style={styles.warning} accessibilityRole={`alert`}>
          {`Hours, days, and paid weeks must be above zero for a complete breakdown.`}
        </Label>
      )}
    </Box>
  );
};

const createStyles = (colors: Palette) => StyleSheet.create({
  heading: { minHeight: 22 },
  stackedPayRow: { flexDirection: `column` },
  compactTitle: { fontSize: 16 },
  explanation: { flexDirection: `row` },
  fieldRow: { gap: 12, flexDirection: `row` },
  warning: { fontSize: 10, lineHeight: 15, color: colors.red },
  compactCard: { gap: 10, flex: 0, padding: 14, flexShrink: 0, flexBasis: `auto`, justifyContent: `flex-start` },
  title: { fontSize: 18, lineHeight: 22, fontWeight: `600`, color: colors.ink },
  card: { gap: 20, flex: 1, minWidth: 0, padding: 24, justifyContent: `space-between` },
  explanationText: { flex: 1, fontSize: 11, lineHeight: 15, color: colors.muted },
});
