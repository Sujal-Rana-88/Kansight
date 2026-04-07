"use client";

import { useEffect } from "react";
import { useUIStore } from "../lib/store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  useEffect(() => {
    const saved = window.localStorage.getItem("kansight-theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    }
  }, [setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("kansight-theme", theme);
  }, [theme]);

  return <>{children}</>;
}
