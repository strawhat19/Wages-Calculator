import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { elementProps, webClass } from '../styles/theme';

export const BrandHome = ({ children, onHome }: { children: ReactNode; onHome: () => void }) => (
  <Pressable
    onPress={onHome}
    accessibilityRole={`button`}
    accessibilityLabel={`Wages Calculator home`}
    {...elementProps(`app-brand-link`)}
    style={[styles.link, webClass(`app-brand-link`)]}
  >
    {children}
  </Pressable>
);

const styles = StyleSheet.create({
  link: { flex: 1, minWidth: 0, minHeight: 44, justifyContent: `center` },
});
