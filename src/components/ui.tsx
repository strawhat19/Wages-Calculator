import { useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react-native';
import { sanitizeNumber, numericValue } from '../lib/calculator';
import { useTheme, fontFamily, elementProps, webClass, type Palette } from '../styles/theme';
import { Animated, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { PressableProps, StyleProp, TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native';

type Identity = { id?: string; className: string };
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const formatNumberInput = (value: string) => value.replace(/^\d+/, whole => whole.replace(/\B(?=(\d{3})+(?!\d))/g, `,`));

export const Box = ({ id, style, className, ...props }: ViewProps & Identity) => (
  <View {...props} {...elementProps(className, id)} style={[style, webClass(className)]} />
);

export const Label = ({ id, style, className, ...props }: TextProps & Identity) => {
  const { colors } = useTheme();
  return <Text {...props} {...elementProps(className, id)} style={[{ fontFamily, fontSize: 14, color: colors.ink }, style, webClass(className)]} />;
};

export const Icon = ({ id, icon: Symbol, className, size = 20, color }: Identity & {
  icon: LucideIcon; size?: number; color?: string;
}) => {
  const { colors } = useTheme();
  return <Symbol
    size={size}
    color={color ?? colors.green}
    accessible={false}
    strokeWidth={1.7}
    {...elementProps(className, id)}
    style={webClass(className)}
  />;
};

type ButtonProps = Identity & {
  label: string;
  icon?: LucideIcon;
  iconOnly?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: PressableProps[`accessibilityRole`];
  accessibilityState?: PressableProps[`accessibilityState`];
  variant?: `primary` | `secondary` | `ghost` | `danger`;
};

export const Button = ({
  id, icon, label, style, onPress, selected, disabled, className, labelStyle, iconOnly = false,
  variant = `secondary`, accessibilityLabel, accessibilityState, accessibilityRole = `button`,
}: ButtonProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const opacity = useRef(new Animated.Value(1)).current;
  const identity = id ?? className.split(` `)?.[0];
  const textColor = StyleSheet.flatten(labelStyle)?.color
    ?? (variant === `primary` ? colors.onForest : variant === `danger` ? colors.red : colors.green);
  const animate = (toValue: number) => Animated.timing(opacity, {
    toValue,
    duration: 140,
    useNativeDriver: Platform.OS !== `web`,
  }).start();

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => animate(0.6)}
      onPressOut={() => animate(1)}
      {...elementProps(className, identity)}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled, selected, ...accessibilityState }}
      style={[styles.button, styles[variant], selected && styles.selected, iconOnly && styles.iconButton, style, { opacity: disabled ? 0.4 : opacity }, webClass(className)]}
    >
      {icon && <Icon icon={icon} size={17} color={String(textColor)} className={`${className}-icon`} id={`${identity}-icon`} />}
      {!iconOnly && (
        <Label className={`${className}-label`} id={`${identity}-label`} style={[styles.buttonLabel, { color: textColor }, labelStyle]}>
          {label}
        </Label>
      )}
    </AnimatedPressable>
  );
};

export const SectionHeading = ({ id, icon, title, subtitle }: {
  id: string; title: string; icon: LucideIcon; subtitle: string;
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
  <Box className={`section-heading`} id={`${id}-heading`} style={styles.sectionHeading}>
    <Box className={`section-icon`} id={`${id}-icon-wrap`} style={styles.iconBadge}>
      <Icon icon={icon} className={`section-heading-icon`} id={`${id}-icon`} />
    </Box>
    <Box className={`section-heading-copy`} id={`${id}-heading-copy`} style={styles.flex}>
      <Label className={`section-title`} id={`${id}-title`} accessibilityRole={`header`} style={styles.sectionTitle}>
        {title}
      </Label>
      <Label className={`section-subtitle`} id={`${id}-subtitle`} style={styles.subtitle}>
        {subtitle}
      </Label>
    </Box>
  </Box>
  );
};

type NumberFieldProps = {
  id: string;
  label: string;
  value: string;
  max?: number;
  large?: boolean;
  compact?: boolean;
  stacked?: boolean;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export const NumberField = ({ id, label, value, max, large, compact, stacked, prefix, suffix, onChange, placeholder = `0` }: NumberFieldProps) => {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const [focused, setFocused] = useState(false);
  const changeValue = (next: string) => {
    const sanitized = sanitizeNumber(next).slice(0, 14);
    onChange(max !== undefined && numericValue(sanitized) > max ? String(max) : sanitized);
  };

  return (
    <Box className={`number-field`} id={`${id}-field`} style={[styles.field, compact && styles.compactField, stacked && styles.stackedField]}>
      <Label className={`input-label`} id={`${id}-label`} style={styles.inputLabel}>
        {label}
      </Label>
      <Box
        id={`${id}-control`}
        className={`number-control`}
        style={[styles.control, large && styles.largeControl, compact && styles.compactControl, focused && styles.focusedControl]}
      >
        {prefix && (
          <Label className={`input-prefix`} id={`${id}-prefix`} style={[styles.affix, large && styles.largeAffix]}>
            {prefix}
          </Label>
        )}
        <TextInput
          maxLength={18}
          selectTextOnFocus
          inputMode={`decimal`}
          onChangeText={changeValue}
          placeholder={placeholder}
          accessibilityLabel={label}
          keyboardType={`decimal-pad`}
          selectionColor={colors.green}
          keyboardAppearance={isDark ? `dark` : `light`}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholderTextColor={colors.subtle}
          value={focused ? value : formatNumberInput(value)}
          {...elementProps(`number-input`, id)}
          style={[styles.input, large && styles.largeInput, compact && styles.compactInput, webClass(`number-input`)]}
        />
        {suffix && (
          <Label className={`input-suffix`} id={`${id}-suffix`} style={styles.affix}>
            {suffix}
          </Label>
        )}
      </Box>
    </Box>
  );
};

const createStyles = (colors: Palette) => StyleSheet.create({
  flex: { flex: 1 },
  compactField: { gap: 5 },
  compactInput: { fontSize: 16 },
  iconButton: { minWidth: 44 },
  field: { gap: 8, flex: 1, minWidth: 0 },
  stackedField: { flex: 0, flexShrink: 0, flexBasis: `auto` },
  text: { fontFamily, fontSize: 14, color: colors.ink },
  compactControl: { minHeight: 40, paddingHorizontal: 10 },
  affix: { fontSize: 13, color: colors.muted, flexShrink: 0 },
  danger: { borderColor: colors.red, backgroundColor: colors.card },
  inputLabel: { fontSize: 12, fontWeight: `500`, color: colors.ink },
  largeAffix: { fontSize: 28, fontWeight: `400`, color: colors.green },
  ghost: { borderColor: `transparent`, backgroundColor: `transparent` },
  buttonLabel: { fontSize: 12, fontWeight: `600`, textAlign: `center` },
  sectionTitle: { fontSize: 18, fontWeight: `600`, letterSpacing: -0.4 },
  primary: { backgroundColor: colors.forest, borderColor: colors.forest },
  sectionHeading: { gap: 12, flexDirection: `row`, alignItems: `center` },
  secondary: { backgroundColor: colors.card, borderColor: colors.border },
  selected: { borderColor: colors.green, backgroundColor: colors.selected },
  focusedControl: { borderColor: colors.green, backgroundColor: colors.card },
  subtitle: { fontSize: 12, marginTop: 4, lineHeight: 18, color: colors.muted },
  largeInput: { fontSize: 34, lineHeight: 44, fontWeight: `600`, letterSpacing: -1 },
  largeControl: { minHeight: 82, paddingHorizontal: 19, backgroundColor: colors.input },
  input: { flex: 1, minWidth: 0, padding: 0, fontFamily, fontSize: 20, fontWeight: `400`, color: colors.ink },
  iconBadge: { width: 40, height: 40, borderRadius: 13, alignItems: `center`, justifyContent: `center`, backgroundColor: colors.soft },
  button: { gap: 7, minHeight: 44, borderWidth: 1, borderRadius: 4, paddingVertical: 10, paddingHorizontal: 14, flexDirection: `row`, alignItems: `center`, justifyContent: `center` },
  control: { gap: 9, minHeight: 54, borderWidth: 1, borderRadius: 4, paddingHorizontal: 12, flexDirection: `row`, alignItems: `center`, borderColor: colors.border, backgroundColor: colors.input },
});
