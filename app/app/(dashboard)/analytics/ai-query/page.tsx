"use client";

import { useState } from "react";
import { apiGet } from "../../../lib/api";
import { useUIStore } from "../../../lib/store";
import { FormCard } from "../../../components/form-card";
import { JsonOutput } from "../../../components/json-output";

export default function AIQueryPage() {
  const token = useUIStore((s) => s.authToken);
  const currentOrgId = useUIStore((s) => s.currentOrgId);
  const [orgId, setOrgId] = useState(currentOrgId ?? "");
  const [query, setQuery] = useState("Why are users not buying product p456?");
  const [result, setResult] = useState<unknown>(null);

  const run = async () => {
    const qs = new URLSearchParams({ org_id: orgId, q: query });
    const data = await apiGet(`/analytics/ai-query?${qs.toString()}`, {
      token,
    });
    setResult(data);
  };

  return (
    <FormCard title="AI Query">
      <input
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
        placeholder="org_id"
        value={orgId}
        onChange={(e) => setOrgId(e.target.value)}
      />
      <textarea
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
        rows={3}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={run}
        className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
      >
        Run
      </button>
      <JsonOutput data={result} />
    </FormCard>
  );
}
