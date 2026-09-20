import { useColorScheme } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { palettes, type Theme } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = `light` | `dark`;
const storageKey = `@wages-calculator/theme/v1`;

export const useAppTheme = (): Theme => {
  const scheme = useColorScheme();
  const edited = useRef(false);
  const [themeReady, setThemeReady] = useState(false);
  const [mode, setMode] = useState<ThemeMode | null>(null);
  const pendingSave = useRef<Promise<void>>(Promise.resolve());
  const isDark = (mode ?? scheme) === `dark`;

  useEffect(() => {
    let cancelled = false;
    void AsyncStorage.getItem(storageKey).then(saved => {
      if (!cancelled && !edited.current && (saved === `light` || saved === `dark`)) setMode(saved);
    }).catch(() => undefined).finally(() => {
      if (!cancelled) setThemeReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!mode || !themeReady) return;
    pendingSave.current = pendingSave.current.catch(() => undefined)
      .then(() => AsyncStorage.setItem(storageKey, mode)).catch(() => undefined);
  }, [mode, themeReady]);

  const toggleTheme = () => {
    edited.current = true;
    setMode(current => (current ?? scheme) === `dark` ? `light` : `dark`);
  };

  return { isDark, themeReady, toggleTheme, colors: isDark ? palettes.dark : palettes.light };
};
