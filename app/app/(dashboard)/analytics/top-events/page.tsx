"use client";

import { useState } from "react";
import { apiGet } from "../../../lib/api";
import { useUIStore } from "../../../lib/store";
import { FormCard } from "../../../components/form-card";
import { JsonOutput } from "../../../components/json-output";

export default function TopEventsPage() {
  const token = useUIStore((s) => s.authToken);
  const currentOrgId = useUIStore((s) => s.currentOrgId);
  const [orgId, setOrgId] = useState(currentOrgId ?? "");
  const [limit, setLimit] = useState("5");
  const [result, setResult] = useState<unknown>(null);

  const run = async () => {
    const query = new URLSearchParams({ org_id: orgId, limit });
    const data = await apiGet(`/analytics/top-events?${query.toString()}`, {
      token,
    });
    setResult(data);
  };

  return (
    <FormCard title="Top Events">
      <input
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
        placeholder="org_id"
        value={orgId}
        onChange={(e) => setOrgId(e.target.value)}
      />
      <input
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
        placeholder="limit"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
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
