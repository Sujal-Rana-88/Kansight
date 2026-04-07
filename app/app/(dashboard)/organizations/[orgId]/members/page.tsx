"use client";

import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost } from "../../../../lib/api";
import { useUIStore } from "../../../../lib/store";
import { FormCard } from "../../../../components/form-card";
import { JsonOutput } from "../../../../components/json-output";

export default function OrgMembersPage({
  params,
}: {
  params: { orgId: string };
}) {
  const token = useUIStore((s) => s.authToken);
  const [members, setMembers] = useState<unknown[]>([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("member");

  const load = async () => {
    if (!token) return;
    const data = await apiGet(
      `/organizations/${params.orgId}/members`,
      { token },
    );
    setMembers(data as unknown[]);
  };

  useEffect(() => {
    load();
  }, [token, params.orgId]);

  const addMember = async () => {
    await apiPost(
      `/organizations/${params.orgId}/members`,
      { userId, role },
      { token },
    );
    setUserId("");
    load();
  };

  const removeMember = async (targetUserId: string) => {
    await apiDelete(
      `/organizations/${params.orgId}/members/${targetUserId}`,
      { token },
    );
    load();
  };

  return (
    <div className="space-y-6">
      <FormCard title="Add member">
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <select
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="member">member</option>
          <option value="admin">admin</option>
          <option value="owner">owner</option>
        </select>
        <button
          onClick={addMember}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Add member
        </button>
      </FormCard>

      <FormCard title="Members">
        <div className="space-y-2">
          {(members as any[]).map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm"
            >
              <span>{member.user?.id ?? member.user_id}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted">{member.role}</span>
                <button
                  onClick={() => removeMember(member.user?.id ?? member.user_id)}
                  className="text-xs font-semibold text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <JsonOutput data={members} />
      </FormCard>
    </div>
  );
}
