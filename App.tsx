import { useRef, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import logo from './angular-ionic-calculator.png';
import { Results } from './src/components/Results';
import { AdSpace } from './src/components/AdSpace';
import { BrandHome } from './src/components/BrandHome';
import { HeaderMenu } from './src/components/HeaderMenu';
import { MobileTabs } from './src/components/MobileTabs';
import { useAppTheme } from './src/hooks/useAppTheme';
import { IncomeCard } from './src/components/IncomeCard';
import { Box, Label, Button } from './src/components/ui';
import { useCalculator } from './src/hooks/useCalculator';
import { X, Sun, Moon, RotateCcw, ChartNoAxesColumn } from 'lucide-react-native';
import { Footer, footerHeight } from './src/components/Footer';
import { useMobileViewport } from './src/hooks/useMobileViewport';
import { useMobileNavigation, type MobileTab } from './src/hooks/useMobileNavigation';
import { SiteContent, SiteNavigation, SiteFooterLinks, SiteGuideDirectory } from './src/components/SiteContent';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ThemeContext, elementProps, webClass, type Palette } from './src/styles/theme';
import { Image, Platform, Keyboard, ScrollView, StyleSheet, KeyboardAvoidingView, useWindowDimensions } from 'react-native';

const CalculatorPage = () => {
  const { width, height } = useWindowDimensions();
  const scroll = useRef<ScrollView>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const { colors, isDark, toggleTheme } = useTheme();
  const { activeTab, navigate, goHome } = useMobileNavigation();
  const { inputs, ready, reset, updateInput, storageStatus } = useCalculator();
  const compact = width < 900;
  const mobile = Platform.OS === `web` && width < 768;
  const narrowHeader = width < 400;
  const styles = createStyles(colors);
  const showCalculator = !mobile || activeTab === `income` || activeTab === `results`;
  const shellClass = `app-safe-area${mobile ? ` app-mobile-shell` : ``}`;
  const minimumHeight = compact ? 0 : Math.max(420, height - footerHeight.web - (Platform.OS === `web` ? 220 : 100));
  useMobileViewport(mobile);

  useEffect(() => {
    if (!mobile) return;
    Keyboard.dismiss();
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [mobile, activeTab]);

  const changeTab = (tab: MobileTab) => {
    setResetOpen(false);
    navigate(tab);
  };
  const openHome = () => {
    goHome();
    Keyboard.dismiss();
    setResetOpen(false);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const toggleReset = () => {
    setResetOpen(current => !current);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const confirmReset = () => {
    reset();
    setResetOpen(false);
    if (mobile) navigate(`income`);
  };

  return (
    <SafeAreaView
      {...elementProps(shellClass, `app-safe-area`)}
      edges={mobile ? [`top`, `left`, `right`] : undefined}
      style={[styles.fill, webClass(shellClass)]}
    >
      <Box className={`app-header`} style={styles.header}>
        <Box className={`header-inner`} style={[styles.headerInner, compact && styles.compactHeader]}>
          <BrandHome onHome={openHome}>
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
          </BrandHome>
          <Box className={`header-actions`} style={styles.headerActions}>
            <Button
              variant={`ghost`}
              iconOnly={mobile || narrowHeader}
              icon={isDark ? Sun : Moon}
              onPress={toggleTheme}
              style={styles.headerButton}
              label={isDark ? `Light` : `Dark`}
              className={`theme-toggle-button`}
              accessibilityLabel={isDark ? `Switch To Light Mode` : `Switch To Dark Mode`}
            />
            {!mobile && <Button
              label={`Reset`}
              icon={RotateCcw}
              iconOnly={narrowHeader}
              variant={`ghost`}
              disabled={!ready}
              style={styles.headerButton}
              className={`reset-button`}
              onPress={toggleReset}
              accessibilityState={{ expanded: resetOpen }}
            />}
            <HeaderMenu />
          </Box>
        </Box>
      </Box>
      <KeyboardAvoidingView
        {...elementProps(`app-keyboard-area`)}
        style={[styles.fill, webClass(`app-keyboard-area`)]}
        behavior={Platform.OS === `ios` ? `padding` : undefined}
      >
        <ScrollView
          ref={scroll}
          {...elementProps(`app-scroll`)}
          keyboardDismissMode={`on-drag`}
          keyboardShouldPersistTaps={`handled`}
          style={[styles.fill, webClass(`app-scroll`)]}
          contentContainerStyle={[styles.scrollContent, compact && styles.compactScroll]}
        >
          <Box className={`page-content`} style={[styles.pageContent, compact && styles.compactContent]}>
            {Platform.OS === `web` && (
              <Box className={`calculator-page-intro`} style={mobile && activeTab !== `income` && styles.hidden}>
                <SiteNavigation />
              </Box>
            )}
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
            <Box className={`page-layout`} style={[styles.pageLayout, { minHeight: minimumHeight }, compact && styles.compactPageLayout, !showCalculator && styles.hidden]}>
              {ready ? (
                <Box className={`calculator-layout`} style={[styles.calculatorLayout, compact && styles.stackedLayout]}>
                  <Box id={`income`} className={`calculator-inputs`} style={[styles.inputColumn, compact && styles.stackedColumn, mobile && activeTab !== `income` && styles.hidden]}>
                    <IncomeCard inputs={inputs} compact={compact} onChange={updateInput} />
                    {mobile && (
                      <Box className={`mobile-pay-action`} style={styles.mobilePayAction}>
                        <Button
                          variant={`primary`}
                          icon={ChartNoAxesColumn}
                          label={`View pay breakdown`}
                          className={`mobile-view-pay`}
                          onPress={() => changeTab(`results`)}
                        />
                      </Box>
                    )}
                  </Box>
                  <Box id={`results`} className={`calculator-results`} style={[styles.resultsColumn, compact && styles.stackedColumn, compact && styles.stackedResults, mobile && styles.mobileResults, mobile && activeTab !== `results` && styles.hidden]}>
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
            </Box>
            {storageStatus === `unavailable` && showCalculator && (
              <Label className={`storage-status-error`} style={styles.storageError} accessibilityLiveRegion={`polite`}>
                {`Local saving is unavailable. Your changes may be lost when you close this page.`}
              </Label>
            )}
            {Platform.OS === `web` && (
              <>
                <Box id={`guides`} className={`guides-panel`} style={mobile && activeTab !== `guides` && styles.hidden}>
                  {mobile && <SiteGuideDirectory />}
                  <SiteContent />
                  <AdSpace />
                </Box>
                <Box id={`more`} className={`more-panel`} style={[styles.morePanel, mobile && activeTab !== `more` && styles.hidden]}>
                  {mobile && (
                    <Box className={`more-heading`} style={styles.moreHeading}>
                      <Label className={`more-title`} accessibilityRole={`header`} style={styles.moreTitle}>
                        {`More`}
                      </Label>
                      <Label className={`more-description`} style={styles.moreDescription}>
                        {`About this calculator, privacy, and preferences.`}
                      </Label>
                    </Box>
                  )}
                  <SiteFooterLinks />
                  {mobile && (
                    <Box className={`mobile-preferences`} style={styles.mobilePreferences}>
                      <Button
                        icon={isDark ? Sun : Moon}
                        label={isDark ? `Switch to light mode` : `Switch to dark mode`}
                        className={`mobile-theme-setting`}
                        onPress={toggleTheme}
                      />
                      <Button
                        icon={RotateCcw}
                        disabled={!ready}
                        label={`Reset calculator`}
                        className={`mobile-reset-setting`}
                        onPress={toggleReset}
                        accessibilityState={{ expanded: resetOpen }}
                      />
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
      {mobile ? <MobileTabs activeTab={activeTab} onChange={changeTab} /> : <Footer compact={compact} />}
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
  hidden: { display: `none` },
  morePanel: { gap: 20 },
  moreHeading: { gap: 6 },
  mobileResults: { borderLeftWidth: 0, borderTopWidth: 0 },
  mobilePreferences: { gap: 12 },
  moreTitle: { fontSize: 24, fontWeight: `600` },
  mobilePayAction: { padding: 14, paddingTop: 0 },
  moreDescription: { fontSize: 14, lineHeight: 21, color: colors.muted },
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
  header: { zIndex: 20, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.card },
  headerInner: { gap: 8, width: `100%`, minHeight: 64, paddingHorizontal: 24, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  calculatorLayout: { flex: 1, minWidth: 0, borderWidth: 1, flexDirection: `row`, alignItems: `stretch`, borderColor: colors.border, backgroundColor: colors.card },
  resetConfirmation: { gap: 12, padding: 12, borderWidth: 1, flexWrap: `wrap`, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between`, borderColor: colors.border, backgroundColor: colors.card },
});
