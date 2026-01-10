/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'tube-virality-theme';

const applyThemeClass = (value: Theme) => {
  const root = document.documentElement;
  root.classList.toggle('theme-light', value === 'light');
  root.classList.toggle('theme-dark', value === 'dark');
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setThemeState(stored);
      applyThemeClass(stored);
      return;
    }

    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme: Theme = prefersLight ? 'light' : 'dark';
    setThemeState(initialTheme);
    applyThemeClass(initialTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    applyThemeClass(theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    toggleTheme: () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light')),
    setTheme: (value) => setThemeState(value),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};

