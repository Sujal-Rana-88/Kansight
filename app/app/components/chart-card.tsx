import React from "react";

export function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
        </div>
      </div>
      <div className="mt-4 h-56 w-full">{children}</div>
    </div>
  );
}
