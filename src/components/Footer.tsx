import { Box, Icon, Label } from './ui';
import { useEffect, useState } from 'react';
import { Clock3, ExternalLink } from 'lucide-react-native';
import { useTheme, webClass, elementProps } from '../styles/theme';
import { Alert, Linking, Platform, Pressable, StyleSheet } from 'react-native';

const piratechsUrl = `https://piratechs.com/`;
export const footerHeight = { web: 36, mobile: 48 };

export const Footer = ({ compact }: { compact: boolean }) => {
  const { colors } = useTheme();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(timer);
  }, []);
  const clock = now.toLocaleTimeString([], { hour: `2-digit`, minute: `2-digit`, second: `2-digit` });
  const date = now.toLocaleDateString([], { day: `numeric`, month: `short`, weekday: `short`, year: `numeric` });
  const openPiratechs = () => { void Linking.openURL(piratechsUrl).catch(() => Alert.alert(`Unable To Open Piratechs`)); };
  const linkProps = Platform.OS === `web` ? { href: piratechsUrl, hrefAttrs: { target: `_blank`, rel: `noopener noreferrer` } } : { onPress: openPiratechs };

  return (
    <Box
      className={`app-footer`}
      style={[styles.footer, { borderColor: colors.border, backgroundColor: colors.card }, compact && styles.compact]}
    >
      <Box
        style={styles.clock}
        className={`footer-clock`}
        accessibilityLabel={`Local Date And Time ${date}, ${clock}`}
      >
        <Icon size={12} icon={Clock3} className={`footer-clock-icon`} />
        <Box className={`footer-date-time`} style={[styles.dateTime, compact && styles.compactDateTime]}>
          <Label
            numberOfLines={1}
            className={`footer-date-value`}
            style={[styles.time, { color: colors.muted }]}
          >
            {date}{compact ? `` : ` ·`}
          </Label>
          <Label
            numberOfLines={1}
            className={`footer-clock-value`}
            style={[styles.time, { color: colors.muted }]}
          >
            {clock}
          </Label>
        </Box>
      </Box>
      <Box className={`footer-copyright`} style={styles.copyright}>
        <Label className={`footer-copyright-year`} style={[styles.text, { color: colors.muted }]}>
          {`© ${now.getFullYear()}`}
        </Label>
        <Pressable
          {...linkProps}
          hitSlop={6}
          accessibilityRole={`link`}
          accessibilityLabel={`Piratechs Website`}
          {...elementProps(`footer-piratechs-link`)}
          style={({ pressed }) => [styles.link, { opacity: pressed ? 0.65 : 1 }, webClass(`footer-piratechs-link`)]}
        >
          <Label className={`footer-piratechs-label`} style={[styles.text, { color: colors.green }]}>
            {`Piratechs`}
          </Label>
          <Icon size={11} icon={ExternalLink} className={`footer-piratechs-icon`} />
        </Pressable>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  text: { fontSize: 11 },
  compactDateTime: { gap: 0, flexDirection: `column` },
  dateTime: { gap: 4, minWidth: 0, flexShrink: 1, flexDirection: `row` },
  compact: { minHeight: footerHeight.mobile, paddingHorizontal: 12 },
  time: { fontSize: 11, lineHeight: 14, fontVariant: [`tabular-nums`] },
  copyright: { gap: 5, flexShrink: 0, alignItems: `center`, flexDirection: `row` },
  link: { gap: 4, minHeight: 32, alignItems: `center`, flexDirection: `row` },
  clock: { gap: 6, minWidth: 0, flexShrink: 1, alignItems: `center`, flexDirection: `row` },
  footer: { gap: 8, flexShrink: 0, borderTopWidth: 1, minHeight: footerHeight.web, paddingHorizontal: 24, alignItems: `center`, flexDirection: `row`, justifyContent: `space-between` },
});
