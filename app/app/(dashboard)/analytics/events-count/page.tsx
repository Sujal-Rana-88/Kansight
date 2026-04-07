"use client";

import { useState } from "react";
import { apiGet } from "../../../lib/api";
import { useUIStore } from "../../../lib/store";
import { FormCard } from "../../../components/form-card";
import { JsonOutput } from "../../../components/json-output";

export default function EventsCountPage() {
  const token = useUIStore((s) => s.authToken);
  const currentOrgId = useUIStore((s) => s.currentOrgId);
  const [orgId, setOrgId] = useState(currentOrgId ?? "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState<unknown>(null);

  const run = async () => {
    const query = new URLSearchParams({ org_id: orgId });
    if (from) query.set("from", from);
    if (to) query.set("to", to);
    const data = await apiGet(`/analytics/events-count?${query.toString()}`, {
      token,
    });
    setResult(data);
  };

  return (
    <FormCard title="Events Count">
      <input
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
        placeholder="org_id"
        value={orgId}
        onChange={(e) => setOrgId(e.target.value)}
      />
      <input
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
        placeholder="from (ISO)"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      <input
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
        placeholder="to (ISO)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
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
