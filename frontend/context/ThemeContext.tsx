"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type ThemeId =
  | "mint-pop"
  | "tangerine-pop"
  | "banana-pop"
  | "midnight-brutal";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  icon: string;
  description: string;
  swatches: [string, string, string];
}

export const THEMES: ThemeMeta[] = [
  {
    id: "mint-pop",
    name: "Mint Pop",
    icon: "🍃",
    description: "Off-white, teal CTA, orange pop",
    swatches: ["#fefdfb", "#2dd4bf", "#fb923c"],
  },
  {
    id: "tangerine-pop",
    name: "Tangerine Pop",
    icon: "🍊",
    description: "Warm white, orange CTA, teal pop",
    swatches: ["#fffbf5", "#fb923c", "#2dd4bf"],
  },
  {
    id: "banana-pop",
    name: "Banana Pop",
    icon: "🍌",
    description: "Cream white, amber CTA",
    swatches: ["#fffdf2", "#fbbf24", "#2dd4bf"],
  },
  {
    id: "midnight-brutal",
    name: "Midnight Brutal",
    icon: "🌑",
    description: "Gray-900, ghost borders, teal signal",
    swatches: ["#111827", "#2dd4bf", "#fb923c"],
  },
];

const STORAGE_KEY = "solshield_theme";
const DEFAULT_THEME: ThemeId = "mint-pop";

interface ThemeCtx {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export function applyThemeClass(theme: ThemeId) {
  const el = document.documentElement;
  THEMES.forEach((t) => el.classList.remove(`theme-${t.id}`));
  el.classList.add(`theme-${theme}`);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      localStorage.getItem(STORAGE_KEY)) as ThemeId | null;
    if (stored && THEMES.some((t) => t.id === stored)) {
      setThemeState(stored);
      applyThemeClass(stored);
    } else {
      applyThemeClass(DEFAULT_THEME);
    }
  }, []);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    applyThemeClass(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

/** Inline script string injected before paint to avoid theme flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'${DEFAULT_THEME}';var v=['mint-pop','tangerine-pop','banana-pop','midnight-brutal'];if(v.indexOf(t)<0)t='${DEFAULT_THEME}';var e=document.documentElement;v.forEach(function(x){e.classList.remove('theme-'+x)});e.classList.add('theme-'+t);}catch(e){document.documentElement.classList.add('theme-${DEFAULT_THEME}');}})();`;
