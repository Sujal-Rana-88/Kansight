"use client";

import { ThemeToggle } from "./theme-toggle";
import { useUIStore } from "../lib/store";

export function Navbar({ title }: { title: string }) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-2/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg border border-border px-2 py-1 text-xs font-semibold text-muted hover:text-foreground"
        >
          Menu
        </button>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted">
            Kansight
          </div>
          <div className="text-lg font-semibold text-foreground">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Live ingest
        </div>
        <ThemeToggle />
        <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-medium text-foreground">
          <span className="h-6 w-6 rounded-full bg-brand text-white flex items-center justify-center">
            A
          </span>
          Admin
        </div>
      </div>
    </header>
  );
}
