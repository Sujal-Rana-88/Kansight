"use client";

import { useUIStore } from "../lib/store";

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const toggle = useUIStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggle}
      className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted hover:text-foreground"
    >
      {theme === "light" ? "Dark" : "Light"} mode
    </button>
  );
}
