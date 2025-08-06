"use client";

import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function TopBar() {
  return (
    <header className="tw:h-16 tw:w-full tw:flex tw:items-center tw:justify-between tw:px-6 tw:py-4 tw:shadow-md tw:bg-[var(--tw-color-topbar)] tw:transition-colors tw:relative  tw-border-b-[1.5px] tw:animate-neon-border">
      <div>
        <Link href="/">
          <h1 className="tw:text-xl tw:font-bold tw:text-title tw:text-balance">
            Three-Tac-Toe
          </h1>
        </Link>
      </div>
      <div className="tw:flex tw:items-center tw:gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
