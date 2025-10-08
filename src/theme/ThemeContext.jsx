import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Appearance, Platform, Pressable } from 'react-native';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { light as lightPalette, dark as darkPalette } from './palette';

const ThemeContext = createContext(null);

// زر تبديل السمة
export function ThemeToggle({ style }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      icon={props => (
        <MaterialCommunityIcons
          name={theme.dark ? 'weather-night' : 'white-balance-sunny'}
          size={24}
          color={theme.colors.onSurface}
          {...props}
        />
      )}
      onPress={toggleTheme}
      style={style}
    />
  );
}

export function ThemeProvider({ children }) {
  const system = Appearance.getColorScheme?.() || 'light';
  const [mode, setMode] = useState(system === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const sub = Appearance.addChangeListener?.(({ colorScheme }) => {
      setMode(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => sub?.remove?.();
  }, []);

  const base = mode === 'dark' ? darkPalette : lightPalette;
  const colors = {
    ...base,
    // aliases for simplicity across app
    bg: base.background,
    text: base.onSurface,
    muted: base.onSurfaceVariant,
    border: base.outline,
    card: base.surface,
    inputBackground: base.surfaceVariant,
    placeholder: base.onSurfaceVariant,
    overlay: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
    buttonText: base.onPrimary,
  };
  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  const value = useMemo(() => ({
    mode,
    colors,
    toggle,
    isDark: mode === 'dark'
  }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// هوك استخدام السمة
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('يجب استخدام useTheme داخل ThemeProvider');

  return {
    theme: {
      colors: ctx.colors,
      dark: ctx.isDark,
      mode: ctx.mode,
      roundness: 4,
    },
    toggleTheme: ctx.toggle,
    colors: ctx.colors,
    isDark: ctx.isDark
  };
}
