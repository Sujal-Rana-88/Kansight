"use client";

import { useState } from "react";
import { apiGet } from "../../lib/api";
import { useUIStore } from "../../lib/store";
import { FormCard } from "../../components/form-card";
import { JsonOutput } from "../../components/json-output";

export default function InsightsPage() {
  const token = useUIStore((s) => s.authToken);
  const [orgId, setOrgId] = useState("");
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [result, setResult] = useState<unknown>(null);

  const run = async () => {
    const data = await apiGet(
      `/insights/${orgId}/users/${userId}/products/${productId}`,
      { token },
    );
    setResult(data);
  };

  return (
    <div className="space-y-6">
      <FormCard title="AI Insight (single user/product)">
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          placeholder="Organization ID"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button
          onClick={run}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Get insight
        </button>
        <JsonOutput data={result} />
      </FormCard>
    </div>
  );
}
