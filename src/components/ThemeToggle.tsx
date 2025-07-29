"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const explicit = stored === "light" || stored === "dark";
    const useDark = explicit ? stored === "dark" : prefersDark;

    root.classList.toggle("light", !useDark);
    setIsLight(!useDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nowLight = !root.classList.contains("light");

    root.classList.toggle("light", nowLight);
    localStorage.setItem("theme", nowLight ? "light" : "dark");
    setIsLight(nowLight);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="tw:relative tw:w-10 tw:h-10 tw:btn-primary tw:flex tw:items-center tw:justify-center tw:overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isLight ? "sun" : "moon"}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="tw:absolute"
        >
          {isLight ? (
            <SunIcon className="tw:w-5 tw:h-5 " />
          ) : (
            <MoonIcon className="tw:w-5 tw:h-5" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3V4M12 20V21M4 12H3M6.314 6.314L5.5 5.5M17.686 6.314L18.5 5.5M6.314 17.69L5.5 18.5M17.686 17.69L18.5 18.5M21 12H20" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3.32 11.684C3.32 16.654 7.35 20.683 12.32 20.683C16.108 20.683 19.348 18.344 20.677 15.032C19.64 15.449 18.506 15.683 17.32 15.683C12.35 15.683 8.32 11.654 8.32 6.683C8.32 5.503 8.552 4.363 8.965 3.33C5.656 4.66 3.32 7.899 3.32 11.684Z" />
    </svg>
  );
}
