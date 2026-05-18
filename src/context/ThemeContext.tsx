import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_THEME_ID, themes, type Theme, type ThemeId } from '../themes';

const STORAGE_KEY = 'phonicspath-theme';

interface Ctx {
  theme: Theme;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    return saved && themes[saved] ? saved : DEFAULT_THEME_ID;
  });

  const setThemeId = useCallback((id: ThemeId) => {
    localStorage.setItem(STORAGE_KEY, id);
    setThemeIdState(id);
  }, []);

  const theme = useMemo(() => themes[themeId], [themeId]);

  return (
    <ThemeContext.Provider value={{ theme, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
