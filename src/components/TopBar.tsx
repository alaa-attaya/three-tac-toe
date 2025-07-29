"use client";

import { useEffect } from "react";
import supabase from "@/lib/supabase";
import { useUserStore } from "@/store/userStore";
import { ProfileSchema } from "@/lib/validators";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function TopBar() {
  const username = useUserStore((state) => state.username);
  const setUsername = useUserStore((state) => state.setUsername);

  useEffect(() => {
    async function loadUsername() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        if (!error && ProfileSchema.safeParse(data).success) {
          setUsername(data.username);
        }
      } else {
        setUsername(null);
      }
    }
    loadUsername();
  }, [setUsername]);

  return (
    <header className="tw:flex tw:items-center tw:justify-between tw:px-6 tw:py-4 tw:shadow-md tw:bg-[var(--tw-color-topbar)] tw:transition-colors tw:border-b tw:border-b-[oklch(85%_0.3_330)] tw:animate-neon-border">
      <div>
        <Link href="/">
          <h1 className="tw:text-xl tw:font-bold tw:text-title">
            Three-Tac-Toe
          </h1>
        </Link>
      </div>
      <div className="tw:flex tw:items-center tw:gap-4">
        <ThemeToggle />
        {username ? (
          <button className="tw:btn-primary">{username}</button>
        ) : (
          <button className="tw:btn-primary">Sign In</button>
        )}
      </div>
    </header>
  );
}
