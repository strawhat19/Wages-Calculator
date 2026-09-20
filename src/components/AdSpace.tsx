import { Box, Label } from './ui';
import { StyleSheet } from 'react-native';
import { useTheme, type Palette } from '../styles/theme';

type AdSpaceProps = { sidebar: boolean; compact: boolean };

export const AdSpace = ({ sidebar, compact }: AdSpaceProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Box
      id={sidebar ? `sidebar-ad-space` : `banner-ad-space`}
      className={`advertisement-space`}
      accessibilityLabel={`Advertisement Space`}
      style={[styles.space, sidebar ? styles.sidebar : styles.banner, !sidebar && compact && styles.mobileBanner]}
    >
      <Label className={`advertisement-label`} style={styles.label}>
        {`Advertisement`}
      </Label>
    </Box>
  );
};

const createStyles = (colors: Palette) => StyleSheet.create({
  sidebar: { width: 300, height: 250 },
  mobileBanner: { height: 50, maxWidth: 320 },
  label: { fontSize: 10, color: colors.muted },
  banner: { height: 90, width: `100%`, maxWidth: 728, alignSelf: `center` },
  space: { borderWidth: 1, borderColor: colors.border, alignItems: `center`, justifyContent: `center` },
});
