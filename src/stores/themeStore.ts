import { create } from "zustand";

interface ThemeState {
  isLight: boolean | null;
  setIsLight: (val: boolean) => void;
  toggle: () => void;
}

export function detectInitialTheme(): boolean {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") {
    return stored === "light";
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isLight: null,
  setIsLight: (val) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light", val);
      localStorage.setItem("theme", val ? "light" : "dark");
    }
    set({ isLight: val });
  },
  toggle: () =>
    set((state) => {
      const newVal = !state.isLight;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("light", newVal);
        localStorage.setItem("theme", newVal ? "light" : "dark");
      }
      return { isLight: newVal };
    }),
}));
