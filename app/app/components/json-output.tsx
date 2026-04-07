"use client";

export function JsonOutput({ data }: { data: unknown }) {
  return (
    <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-border bg-surface px-4 py-3 text-xs text-muted">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
