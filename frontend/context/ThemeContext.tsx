"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type ThemeId =
  | "paper-lab"
  | "graphite-lab"
  | "sage-board"
  | "high-contrast";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  icon: string;
  description: string;
  swatches: [string, string, string];
}

export const THEMES: ThemeMeta[] = [
  {
    id: "graphite-lab",
    name: "Graphite Lab",
    icon: "🌑",
    description: "Charcoal workspace, teal signal",
    swatches: ["#111513", "#32b8a6", "#d99d43"],
  },
  {
    id: "paper-lab",
    name: "Paper Lab",
    icon: "📄",
    description: "Warm paper, cobalt notes",
    swatches: ["#f6efe3", "#2457d6", "#a94922"],
  },
  {
    id: "sage-board",
    name: "Sage Board",
    icon: "🌿",
    description: "Quiet green-gray board",
    swatches: ["#edf1e7", "#2f67b1", "#9a6043"],
  },
  {
    id: "high-contrast",
    name: "High Contrast",
    icon: "⚡",
    description: "Crisp, accessible, electric",
    swatches: ["#ffffff", "#0048ff", "#c74700"],
  },
];

const STORAGE_KEY = "solshield_theme";
const DEFAULT_THEME: ThemeId = "graphite-lab";

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
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'${DEFAULT_THEME}';var v=['paper-lab','graphite-lab','sage-board','high-contrast'];if(v.indexOf(t)<0)t='${DEFAULT_THEME}';var e=document.documentElement;v.forEach(function(x){e.classList.remove('theme-'+x)});e.classList.add('theme-'+t);}catch(e){document.documentElement.classList.add('theme-${DEFAULT_THEME}');}})();`;
