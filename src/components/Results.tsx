import { Box, Label } from './ui';
import { useTheme, type Palette } from '../styles/theme';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { calculateWages, formatMoney, type CalculatorInputs } from '../lib/calculator';

type ResultsProps = {
  compact: boolean;
  inputs: CalculatorInputs;
};

export const Results = ({ inputs, compact }: ResultsProps) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const phone = width < 520;
  const styles = createStyles(colors);
  const calculation = calculateWages(inputs);

  return (
    <Box className={`results-column`} style={[styles.column, compact && styles.compactColumn]}>
      <Box className={`breakdown-card`} style={[styles.card, compact && styles.compactCard, phone && styles.phoneCard]}>
        <Box className={`breakdown-heading-row`} style={styles.headingRow}>
          <Label className={`breakdown-heading`} accessibilityRole={`header`} style={[styles.heading, compact && styles.compactHeading]}>
            {`Pay Breakdown`}
          </Label>
        </Box>
        <Box className={`income-table`} style={[styles.table, compact && styles.compactTable]}>
          {!phone && <Box className={`income-table-header`} style={[styles.tableHeader, compact && styles.compactTableHeader]}>
            <Label className={`income-table-period-header`} style={[styles.periodCell, styles.tableHeaderLabel]}>
              {`Period`}
            </Label>
            <Label className={`income-table-gross-header`} style={[styles.moneyCell, styles.tableHeaderLabel]}>
              {`Gross`}
            </Label>
            <Label className={`income-table-tax-header`} style={[styles.moneyCell, styles.tableHeaderLabel]}>
              {`Tax`}
            </Label>
            <Label className={`income-table-net-header`} style={[styles.moneyCell, styles.tableHeaderLabel]}>
              {`Take-Home`}
            </Label>
          </Box>}
          {calculation.periods.map(period => {
            const valueStyle = [styles.tableValue, compact && styles.compactTableValue, phone && styles.phoneTableValue];
            const columns = [
              { id: `gross`, label: `Gross`, amount: period.gross },
              { id: `tax`, label: `Tax`, amount: period.tax, style: styles.taxValue },
              { id: `net`, label: `Take-Home`, amount: period.net, style: styles.netValue },
            ];
            const values = columns.map(column => {
              const value = (
                <Label
                  key={column.id}
                  className={`income-table-${column.id}`}
                  id={`income-table-${column.id}-${period.id}`}
                  style={[styles.moneyCell, ...valueStyle, column.style, phone && styles.phoneMoneyValue]}
                >
                  {formatMoney(column.amount)}
                </Label>
              );

              return phone ? (
                <Box
                  key={column.id}
                  style={styles.phoneMoneyCell}
                  className={`income-table-${column.id}-cell`}
                  id={`income-table-${column.id}-cell-${period.id}`}
                >
                  <Label
                    style={styles.phoneMoneyLabel}
                    className={`income-table-${column.id}-label`}
                    id={`income-table-${column.id}-label-${period.id}`}
                  >
                    {column.label}
                  </Label>
                  {value}
                </Box>
              ) : value;
            });

            return (
              <Box
                key={period.id}
                id={`income-table-row-${period.id}`}
                className={`income-table-row`}
                style={[styles.tableRow, compact && styles.compactTableRow, phone && styles.phoneTableRow]}
              >
                <Label
                  numberOfLines={1}
                  id={`income-table-period-${period.id}`}
                  className={`income-table-period`}
                  style={[styles.periodCell, ...valueStyle, phone && styles.phonePeriodCell]}
                >
                  {period.label}
                </Label>
                {phone ? (
                  <Box className={`income-table-values`} id={`income-table-values-${period.id}`} style={styles.phoneValues}>
                    {values}
                  </Box>
                ) : values}
              </Box>
            );
          })}
        </Box>
        <Label
          className={`breakdown-assumptions`}
          style={[styles.assumptions, compact && styles.compactAssumptions]}
        >
          {`USD · ${calculation.taxRate}% Estimated Tax`}
        </Label>
      </Box>
    </Box>
  );
};

const createStyles = (colors: Palette) => StyleSheet.create({
  table: { flex: 1 },
  compactTable: { flex: 0, flexShrink: 0, flexBasis: `auto` },
  compactColumn: { flex: 0, flexShrink: 0, flexBasis: `auto` },
  phoneCard: { padding: 12 },
  column: { flex: 1, minWidth: 0 },
  headingRow: { minHeight: 22 },
  taxValue: { color: colors.muted },
  compactHeading: { fontSize: 16 },
  compactTableValue: { fontSize: 13 },
  phoneTableValue: { fontSize: 12, lineHeight: 18 },
  phoneValues: { gap: 8, flexDirection: `row` },
  phonePeriodCell: { flex: 0, flexShrink: 0, flexBasis: `auto`, fontWeight: `600` },
  phoneMoneyCell: { gap: 3, flex: 1, minWidth: 0 },
  phoneMoneyValue: { flex: 0, flexShrink: 0, flexBasis: `auto`, textAlign: `left` },
  periodCell: { flex: 0.8, minWidth: 0 },
  compactAssumptions: { fontSize: 11 },
  compactTableHeader: { minHeight: 28, paddingHorizontal: 10 },
  compactTableRow: { flex: 0, minHeight: 44, flexShrink: 0, flexBasis: `auto`, paddingHorizontal: 10 },
  compactCard: { gap: 10, flex: 0, padding: 14, flexShrink: 0, flexBasis: `auto` },
  card: { gap: 20, flex: 1, minWidth: 0, padding: 24 },
  netValue: { fontWeight: `600`, color: colors.ink },
  moneyCell: { flex: 1, minWidth: 0, textAlign: `right` },
  assumptions: { fontSize: 11, lineHeight: 15, color: colors.muted },
  phoneMoneyLabel: { fontSize: 10, lineHeight: 14, color: colors.muted },
  tableHeaderLabel: { fontSize: 11, fontWeight: `500`, color: colors.muted },
  heading: { fontSize: 18, lineHeight: 22, fontWeight: `600`, color: colors.ink },
  tableHeader: { gap: 8, minHeight: 28, paddingHorizontal: 14, alignItems: `center`, flexDirection: `row` },
  phoneTableRow: { gap: 6, minHeight: 64, paddingHorizontal: 8, alignItems: `stretch`, flexDirection: `column` },
  tableValue: { fontSize: 14, lineHeight: 20, fontWeight: `400`, color: colors.ink, fontVariant: [`tabular-nums`] },
  tableRow: { gap: 8, flex: 1, minHeight: 48, paddingVertical: 8, paddingHorizontal: 14, borderBottomWidth: 1, alignItems: `center`, flexDirection: `row`, borderBottomColor: colors.border },
});
