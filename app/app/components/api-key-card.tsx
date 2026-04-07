"use client";

import { useState } from "react";

export function APIKeyCard({
  name,
  keyValue,
  environment,
  onDelete,
}: {
  name: string;
  keyValue: string;
  environment: "dev" | "prod";
  onDelete?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const masked = `${keyValue.slice(0, 6)}...${keyValue.slice(-4)}`;

  const copy = async () => {
    await navigator.clipboard.writeText(keyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-foreground">{name}</div>
          <div className="text-xs text-muted">{environment} environment</div>
        </div>
        <button
          onClick={onDelete}
          className="text-xs font-semibold text-red-500 hover:text-red-400"
        >
          Delete
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl border border-border px-3 py-2">
        <div className="font-mono text-xs text-muted">{masked}</div>
        <button
          onClick={copy}
          className="rounded-full border border-border px-3 py-1 text-xs font-semibold"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
