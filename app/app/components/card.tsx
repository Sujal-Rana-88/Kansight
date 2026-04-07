import React from "react";

export function Card({
  title,
  value,
  trend,
  children,
}: {
  title: string;
  value?: string;
  trend?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-muted">
          {title}
        </div>
        {trend && <div className="text-xs font-semibold text-accent">{trend}</div>}
      </div>
      {value && (
        <div className="mt-3 text-3xl font-semibold text-foreground">{value}</div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
