"use client";

import { useEffect } from "react";
import { useThemeStore, detectInitialTheme } from "@/stores/themeStore";

export function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const setIsLight = useThemeStore((state) => state.setIsLight);
  const isLight = useThemeStore((state) => state.isLight);

  useEffect(() => {
    try {
      const initial = detectInitialTheme();
      setIsLight(initial);
    } catch {
      setIsLight(false);
    }
  }, [setIsLight]);

  if (isLight === null) return null;

  return <>{children}</>;
}
