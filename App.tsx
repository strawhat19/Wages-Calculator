import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import logo from './angular-ionic-calculator.png';
import { Results } from './src/components/Results';
import { AdSpace } from './src/components/AdSpace';
import { useAppTheme } from './src/hooks/useAppTheme';
import { IncomeCard } from './src/components/IncomeCard';
import { Box, Label, Button } from './src/components/ui';
import { useCalculator } from './src/hooks/useCalculator';
import { X, Sun, Moon, RotateCcw } from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ThemeContext, elementProps, webClass, type Palette } from './src/styles/theme';
import { Image, Platform, ScrollView, StyleSheet, KeyboardAvoidingView, useWindowDimensions } from 'react-native';

const CalculatorPage = () => {
  const { width, height } = useWindowDimensions();
  const [resetOpen, setResetOpen] = useState(false);
  const { colors, isDark, toggleTheme } = useTheme();
  const { inputs, ready, reset, updateInput, storageStatus } = useCalculator();
  const compact = width < 900;
  const narrowHeader = width < 400;
  const showAds = Platform.OS === `web`;
  const adSidebar = showAds && width >= 1280;
  const styles = createStyles(colors);
  const minimumHeight = compact ? 0 : Math.max(420, height - (showAds && !adSidebar ? 224 : 100));
  const confirmReset = () => {
    reset();
    setResetOpen(false);
  };

  return (
    <SafeAreaView {...elementProps(`app-safe-area`)} style={[styles.fill, webClass(`app-safe-area`)]}>
      <Box className={`app-header`} style={styles.header}>
        <Box className={`header-inner`} style={[styles.headerInner, compact && styles.compactHeader]}>
          <Box className={`app-brand`} style={styles.brand}>
            <Image
              source={logo}
              resizeMode={`contain`}
              accessibilityLabel={`Wages Calculator logo`}
              {...elementProps(`brand-logo`)}
              style={[styles.logo, webClass(`brand-logo`)]}
            />
            <Label className={`brand-name`} style={[styles.brandName, compact && styles.compactBrand]}>
              {`Wages Calculator`}
            </Label>
          </Box>
          <Box className={`header-actions`} style={styles.headerActions}>
            <Button
              variant={`ghost`}
              iconOnly={narrowHeader}
              icon={isDark ? Sun : Moon}
              onPress={toggleTheme}
              style={styles.headerButton}
              label={isDark ? `Light` : `Dark`}
              className={`theme-toggle-button`}
              accessibilityLabel={isDark ? `Switch To Light Mode` : `Switch To Dark Mode`}
            />
            <Button
              label={`Reset`}
              icon={RotateCcw}
              iconOnly={narrowHeader}
              variant={`ghost`}
              disabled={!ready}
              style={styles.headerButton}
              className={`reset-button`}
              onPress={() => setResetOpen(current => !current)}
              accessibilityState={{ expanded: resetOpen }}
            />
          </Box>
        </Box>
      </Box>
      <KeyboardAvoidingView
        {...elementProps(`app-keyboard-area`)}
        style={[styles.fill, webClass(`app-keyboard-area`)]}
        behavior={Platform.OS === `ios` ? `padding` : undefined}
      >
        <ScrollView
          {...elementProps(`app-scroll`)}
          keyboardDismissMode={`on-drag`}
          keyboardShouldPersistTaps={`handled`}
          style={[styles.fill, webClass(`app-scroll`)]}
          contentContainerStyle={[styles.scrollContent, compact && styles.compactScroll]}
        >
          <Box className={`page-content`} style={[styles.pageContent, compact && styles.compactContent]}>
            {resetOpen && (
              <Box className={`reset-confirmation`} style={styles.resetConfirmation}>
                <Label className={`reset-confirmation-title`} style={styles.resetTitle}>
                  {`Restore the example income?`}
                </Label>
                <Box className={`reset-confirmation-actions`} style={styles.resetActions}>
                  <Button icon={X} label={`Cancel`} className={`reset-cancel`} onPress={() => setResetOpen(false)} />
                  <Button icon={RotateCcw} label={`Reset`} variant={`danger`} className={`reset-confirm`} onPress={confirmReset} />
                </Box>
              </Box>
            )}
            <Box className={`page-layout`} style={[styles.pageLayout, { minHeight: minimumHeight }, compact && styles.compactPageLayout]}>
              {ready ? (
                <Box className={`calculator-layout`} style={[styles.calculatorLayout, compact && styles.stackedLayout]}>
                  <Box className={`calculator-inputs`} style={[styles.inputColumn, compact && styles.stackedColumn]}>
                    <IncomeCard inputs={inputs} compact={compact} onChange={updateInput} />
                  </Box>
                  <Box className={`calculator-results`} style={[styles.resultsColumn, compact && styles.stackedColumn, compact && styles.stackedResults]}>
                    <Results inputs={inputs} compact={compact} />
                  </Box>
                </Box>
              ) : (
                <Box className={`calculator-loading`} style={styles.loading}>
                  <Label className={`calculator-loading-label`} style={styles.footerText} accessibilityLiveRegion={`polite`}>
                    {`Loading…`}
                  </Label>
                </Box>
              )}
              {adSidebar && (
                <Box className={`advertisement-sidebar`} style={styles.adSidebar}>
                  <AdSpace sidebar compact={false} />
                </Box>
              )}
            </Box>
            {storageStatus === `unavailable` && (
              <Label className={`storage-status-error`} style={styles.storageError} accessibilityLiveRegion={`polite`}>
                {`Local saving is unavailable. Your changes may be lost when you close this page.`}
              </Label>
            )}
            {showAds && !adSidebar && <AdSpace sidebar={false} compact={compact} />}
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const App = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);
  const className = theme.isDark ? `app-provider app-theme-dark` : `app-provider app-theme-light`;

  return (
    <ThemeContext.Provider value={theme}>
      <SafeAreaProvider {...elementProps(className, `app-provider`)} style={[styles.fill, webClass(className)]}>
        <StatusBar style={theme.isDark ? `light` : `dark`} />
        <CalculatorPage />
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
};

export default App;

const createStyles = (colors: Palette) => StyleSheet.create({
  adSidebar: { width: 300 },
  compactBrand: { fontSize: 14 },
  logo: { width: 28, height: 28 },
  inputColumn: { flex: 1, minWidth: 0 },
  compactScroll: { paddingVertical: 12 },
  headerButton: { paddingHorizontal: 8 },
  compactContent: { paddingHorizontal: 12 },
  compactPageLayout: { flexDirection: `column` },
  stackedColumn: { flex: 0, flexShrink: 0, flexBasis: `auto`, width: `100%` },
  stackedLayout: { flex: 0, flexShrink: 0, flexBasis: `auto`, width: `100%`, flexDirection: `column` },
  brandName: { flexShrink: 1, fontSize: 18, fontWeight: `600` },
  resetActions: { gap: 7, flexDirection: `row` },
  resetTitle: { fontSize: 13, fontWeight: `500` },
  footerText: { fontSize: 12, color: colors.muted },
  scrollContent: { flexGrow: 1, paddingVertical: 16 },
  fill: { flex: 1, minHeight: 0, backgroundColor: colors.background },
  compactHeader: { minHeight: 56, paddingHorizontal: 12 },
  stackedResults: { borderLeftWidth: 0, borderTopWidth: 1 },
  brand: { gap: 9, flex: 1, minWidth: 0, flexDirection: `row`, alignItems: `center` },
  pageContent: { gap: 16, width: `100%`, paddingHorizontal: 24 },
  storageError: { fontSize: 12, lineHeight: 18, color: colors.red },
  pageLayout: { gap: 24, flexDirection: `row`, alignItems: `stretch` },
  headerActions: { gap: 2, flexShrink: 0, flexDirection: `row`, alignItems: `center` },
  loading: { flex: 1, minHeight: 250, alignItems: `center`, justifyContent: `center` },
  resultsColumn: { flex: 1.5, minWidth: 0, borderLeftWidth: 1, borderColor: colors.border },
  header: { borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.card },
  headerInner: { gap: 8, width: `100%`, minHeight: 64, paddingHorizontal: 24, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  calculatorLayout: { flex: 1, minWidth: 0, borderWidth: 1, flexDirection: `row`, alignItems: `stretch`, borderColor: colors.border, backgroundColor: colors.card },
  resetConfirmation: { gap: 12, padding: 12, borderWidth: 1, flexWrap: `wrap`, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between`, borderColor: colors.border, backgroundColor: colors.card },
});
