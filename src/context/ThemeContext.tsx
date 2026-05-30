import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_THEME_ID, themes, type ThemeId } from '../themes';
import { ThemeContext } from './themeContextValue';

const STORAGE_KEY = 'phonicspath-theme';

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
