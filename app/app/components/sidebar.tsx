"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "../lib/store";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Organizations", href: "/organizations" },
  { label: "Insights", href: "/insights" },
  { label: "API Keys", href: "/api-keys" },
  { label: "Org Settings", href: "/org/settings" },
  { label: "Members", href: "/org/members" },
];

export function Sidebar() {
  const pathname = usePathname();
  const open = useUIStore((s) => s.sidebarOpen);

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } hidden lg:flex flex-col gap-6 border-r border-border bg-surface-2/80 px-6 py-8 backdrop-blur`}
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold tracking-tight text-foreground">
          {open ? "Kansight" : "K"}
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-brand text-white shadow"
                  : "text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              {open ? item.label : item.label.charAt(0)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-border p-4 text-xs text-muted">
        {open ? (
          <>
            <div className="font-semibold text-foreground">Workspace</div>
            <p className="mt-1">Plan: Pro · 14 days left</p>
          </>
        ) : (
          <div className="text-center">Pro</div>
        )}
      </div>
    </aside>
  );
}
