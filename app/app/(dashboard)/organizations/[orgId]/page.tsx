"use client";

import { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../../../lib/api";
import { useUIStore } from "../../../lib/store";
import { JsonOutput } from "../../../components/json-output";
import { FormCard } from "../../../components/form-card";

export default function OrganizationDetailPage({
  params,
}: {
  params: { orgId: string };
}) {
  const token = useUIStore((s) => s.authToken);
  const [org, setOrg] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    const data = await apiGet(`/organizations/${params.orgId}`, { token });
    setOrg(data);
  };

  useEffect(() => {
    load();
  }, [token, params.orgId]);

  const remove = async () => {
    try {
      setError(null);
      await apiDelete(`/organizations/${params.orgId}`, { token });
      setOrg(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <FormCard title="Organization details">
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button
          onClick={remove}
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Delete organization
        </button>
        <JsonOutput data={org} />
      </FormCard>
    </div>
  );
}
