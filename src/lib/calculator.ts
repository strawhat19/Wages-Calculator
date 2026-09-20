export type IncomeMode = `hourly` | `salary`;
export type Period = `hourly` | `daily` | `weekly` | `monthly` | `yearly`;

export type CalculatorInputs = {
  taxRate: string;
  mode: IncomeMode;
  hourlyRate: string;
  weeklyHours: string;
  daysPerWeek: string;
  annualSalary: string;
  weeksPerYear: string;
};

export const createDefaultInputs = (): CalculatorInputs => ({
  taxRate: `24`,
  mode: `hourly`,
  hourlyRate: `25`,
  daysPerWeek: `5`,
  weeklyHours: `40`,
  weeksPerYear: `52`,
  annualSalary: `52000`,
});

export const numericValue = (value: string, maximum = Number.MAX_SAFE_INTEGER) => {
  const number = Number(value);
  const limit = Number.isFinite(maximum) ? Math.max(0, maximum) : Number.MAX_SAFE_INTEGER;
  return Number.isFinite(number) ? Math.min(limit, Math.max(0, number)) : 0;
};

export const sanitizeNumber = (value: string) => {
  const cleaned = value.replace(/[^\d.]/g, ``);
  const [whole = ``, ...fraction] = cleaned.split(`.`);
  return fraction.length ? `${whole}.${fraction.join(``)}`.slice(0, 24) : whole.slice(0, 24);
};

export const formatMoney = (value: number, maximumFractionDigits = 2) => {
  const digits = Number.isFinite(maximumFractionDigits) ? Math.min(20, Math.max(0, Math.floor(maximumFractionDigits))) : 2;
  return new Intl.NumberFormat(`en-US`, {
    style: `currency`,
    currency: `USD`,
    maximumFractionDigits: digits,
    minimumFractionDigits: Math.min(2, digits),
  }).format(Number.isFinite(value) ? value : 0);
};

export const calculateWages = (inputs: CalculatorInputs) => {
  const taxRate = numericValue(inputs.taxRate, 100);
  const daysPerWeek = numericValue(inputs.daysPerWeek, 7);
  const weeksPerYear = numericValue(inputs.weeksPerYear, 52);
  const hoursPerWeek = numericValue(inputs.weeklyHours, 168);
  const annualHours = hoursPerWeek * weeksPerYear;
  const annualDays = daysPerWeek * weeksPerYear;
  const annualGross = inputs.mode === `salary`
    ? numericValue(inputs.annualSalary, 1_000_000_000)
    : numericValue(inputs.hourlyRate, 1_000_000) * annualHours;
  const annualNet = annualGross * (1 - taxRate / 100);
  const monthlyNet = annualNet / 12;
  const effectiveHourlyRate = annualHours > 0 ? annualGross / annualHours : 0;
  const grossPeriods: Array<{ id: Period; label: string; gross: number }> = [
    { id: `hourly`, label: `Hourly`, gross: effectiveHourlyRate },
    { id: `daily`, label: `Daily`, gross: annualDays > 0 ? annualGross / annualDays : 0 },
    { id: `weekly`, label: `Weekly`, gross: weeksPerYear > 0 ? annualGross / weeksPerYear : 0 },
    { id: `monthly`, label: `Monthly`, gross: annualGross / 12 },
    { id: `yearly`, label: `Yearly`, gross: annualGross },
  ];
  const periods = grossPeriods.map((period) => {
    const tax = period.gross * taxRate / 100;
    return { ...period, tax, net: period.gross - tax };
  });

  return {
    periods,
    taxRate,
    annualNet,
    monthlyNet,
    annualGross,
    daysPerWeek,
    weeksPerYear,
    hoursPerWeek,
    effectiveHourlyRate,
    hasIncome: annualGross > 0,
  };
};
