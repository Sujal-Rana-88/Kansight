"use client";

import { useEffect, useState } from "react";
import { apiGet, apiDelete, apiPost } from "../../../lib/api";
import { useUIStore } from "../../../lib/store";
import { FormCard } from "../../../components/form-card";
import { JsonOutput } from "../../../components/json-output";

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const token = useUIStore((s) => s.authToken);
  const [project, setProject] = useState<unknown>(null);

  const load = async () => {
    if (!token) return;
    const data = await apiGet(`/projects/${params.projectId}`, { token });
    setProject(data);
  };

  useEffect(() => {
    load();
  }, [token, params.projectId]);

  const rotate = async () => {
    const data = await apiPost(
      `/projects/${params.projectId}/api-key`,
      {},
      { token },
    );
    setProject((prev) => ({ ...(prev as object), ...data }));
  };

  const remove = async () => {
    await apiDelete(`/projects/${params.projectId}`, { token });
    setProject(null);
  };

  return (
    <div className="space-y-6">
      <FormCard title="Project">
        <button
          onClick={rotate}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Rotate API key
        </button>
        <button
          onClick={remove}
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Delete project
        </button>
        <JsonOutput data={project} />
      </FormCard>
    </div>
  );
}
