"use client";

import { useState } from "react";
import { APIKeyCard } from "../../components/api-key-card";
import { apiPost, apiDelete } from "../../lib/api";
import { useUIStore } from "../../lib/store";

export default function ApiKeysPage() {
  const token = useUIStore((s) => s.authToken);
  const [projectId, setProjectId] = useState("");
  const [latestKey, setLatestKey] = useState<string | null>(null);

  const rotate = async () => {
    const data = await apiPost<{ api_key: string }>(
      `/projects/${projectId}/api-key`,
      {},
      { token },
    );
    setLatestKey(data.api_key);
  };

  const remove = async () => {
    await apiDelete(`/projects/${projectId}`, { token });
    setLatestKey(null);
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="text-sm font-semibold text-foreground">API Keys</div>
        <p className="mt-1 text-sm text-muted">
          Rotate or revoke project API keys using project ID.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm"
            placeholder="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
          <button
            onClick={rotate}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Rotate key
          </button>
          <button
            onClick={remove}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Delete project
          </button>
        </div>
      </div>
      {latestKey && (
        <APIKeyCard
          name="Latest rotated key"
          keyValue={latestKey}
          environment="prod"
        />
      )}
    </div>
  );
}
