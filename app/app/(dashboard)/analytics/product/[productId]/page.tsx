"use client";

import { useState } from "react";
import { apiGet } from "../../../../lib/api";
import { useUIStore } from "../../../../lib/store";
import { FormCard } from "../../../../components/form-card";
import { JsonOutput } from "../../../../components/json-output";

export default function ProductAnalyticsPage({
  params,
}: {
  params: { productId: string };
}) {
  const token = useUIStore((s) => s.authToken);
  const currentOrgId = useUIStore((s) => s.currentOrgId);
  const [orgId, setOrgId] = useState(currentOrgId ?? "");
  const [result, setResult] = useState<unknown>(null);

  const run = async () => {
    const data = await apiGet(
      `/analytics/product/${params.productId}?org_id=${orgId}`,
      { token },
    );
    setResult(data);
  };

  return (
    <FormCard title="Product Overview">
      <input
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
        placeholder="org_id"
        value={orgId}
        onChange={(e) => setOrgId(e.target.value)}
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
