"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../lib/api";
import { useUIStore } from "../../lib/store";
import { JsonOutput } from "../../components/json-output";
import { FormCard } from "../../components/form-card";

type Org = { id: string; name: string; slug: string };

export default function OrganizationsPage() {
  const token = useUIStore((s) => s.authToken);
  const setCurrentOrgId = useUIStore((s) => s.setCurrentOrgId);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    const data = await apiGet<Org[]>("/organizations", { token });
    setOrgs(data);
  };

  useEffect(() => {
    load();
  }, [token]);

  const create = async () => {
    try {
      setError(null);
      await apiPost("/organizations", { name, slug }, { token });
      setName("");
      setSlug("");
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <FormCard title="Create organization">
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button
          onClick={create}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Create
        </button>
      </FormCard>

      <FormCard title="Your organizations" description="Select current org">
        <div className="space-y-2">
          {orgs.map((org) => (
            <button
              key={org.id}
              onClick={() => setCurrentOrgId(org.id)}
              className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left text-sm"
            >
              <span>{org.name}</span>
              <span className="text-xs text-muted">{org.slug}</span>
            </button>
          ))}
        </div>
        <JsonOutput data={orgs} />
      </FormCard>
    </div>
  );
}
