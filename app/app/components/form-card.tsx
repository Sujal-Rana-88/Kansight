import React from "react";

export function FormCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}
