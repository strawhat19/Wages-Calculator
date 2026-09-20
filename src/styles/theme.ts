import { createContext, useContext } from 'react';
import { Platform, type ViewStyle, type TextStyle, type ImageStyle } from 'react-native';

type UniversalStyle = ViewStyle & TextStyle & ImageStyle;

const light = {
  ink: `#24282c`,
  red: `#b54e46`,
  gold: `#eac66a`,
  lime: `#d9f49b`,
  card: `#ffffff`,
  soft: `#f0f1f2`,
  green: `#2d624b`,
  muted: `#6d7378`,
  border: `#dfe2e5`,
  forest: `#173f32`,
  background: `#f5f6f7`,
  input: `#ffffff`,
  subtle: `#a1aaa3`,
  selected: `#edf4e7`,
  onForest: `#ffffff`,
  heroMuted: `#bbd1c3`,
};

export type Palette = { [Key in keyof typeof light]: string };

export const palettes: { light: Palette; dark: Palette } = {
  light,
  dark: {
    ink: `#edf0f2`,
    red: `#f19186`,
    gold: `#eac66a`,
    lime: `#d9f49b`,
    card: `#1c1f22`,
    soft: `#282d31`,
    green: `#a2d2ac`,
    muted: `#a0a6ad`,
    input: `#16191c`,
    border: `#363c41`,
    forest: `#224b37`,
    subtle: `#82968a`,
    selected: `#2a4030`,
    onForest: `#eff8ee`,
    heroMuted: `#bbd1c3`,
    background: `#111416`,
  },
};

export type Theme = {
  isDark: boolean;
  colors: Palette;
  themeReady: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<Theme | null>(null);

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error(`Theme Provider Is Missing`);
  return theme;
};

export const fontFamily = Platform.select({
  ios: `System`,
  default: `sans-serif`,
  web: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
});

export const elementProps = (className: string, id = className.split(` `)?.[0]) => ({
  nativeID: id,
  testID: id,
  ...(Platform.OS === `web` ? { dataSet: { wagesClass: className } } : {}),
});

// React Native Web resolves these class references alongside native inline styles.
export const webClass = (className: string): UniversalStyle | undefined => Platform.OS === `web`
  ? { $$css: true, wages: className } as unknown as UniversalStyle
  : undefined;
