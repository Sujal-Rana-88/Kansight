"use client";

import { useState } from "react";
import { apiGet } from "../../../lib/api";
import { useUIStore } from "../../../lib/store";
import { FormCard } from "../../../components/form-card";
import { JsonOutput } from "../../../components/json-output";

export default function SimilarUsersPage() {
  const token = useUIStore((s) => s.authToken);
  const currentOrgId = useUIStore((s) => s.currentOrgId);
  const [orgId, setOrgId] = useState(currentOrgId ?? "");
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [result, setResult] = useState<unknown>(null);

  const run = async () => {
    const query = new URLSearchParams({ org_id: orgId });
    if (userId) query.set("user_id", userId);
    if (productId) query.set("product_id", productId);
    const data = await apiGet(`/analytics/similar-users?${query.toString()}`, {
      token,
    });
    setResult(data);
  };

  return (
    <FormCard title="Similar Users">
      <input
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
        placeholder="org_id"
        value={orgId}
        onChange={(e) => setOrgId(e.target.value)}
      />
      <input
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
        placeholder="user_id (optional)"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
        placeholder="product_id (optional)"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
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
