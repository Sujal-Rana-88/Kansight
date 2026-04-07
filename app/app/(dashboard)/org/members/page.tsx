"use client";

import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost } from "../../../lib/api";
import { useUIStore } from "../../../lib/store";
import { RoleBadge } from "../../../components/role-badge";

type Member = {
  id: string;
  role: "owner" | "admin" | "member";
  user?: { id: string; email?: string };
};

export default function OrgMembersPage() {
  const token = useUIStore((s) => s.authToken);
  const currentOrgId = useUIStore((s) => s.currentOrgId);
  const [members, setMembers] = useState<Member[]>([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("member");

  const load = async () => {
    if (!token || !currentOrgId) return;
    const data = await apiGet<Member[]>(
      `/organizations/${currentOrgId}/members`,
      { token },
    );
    setMembers(data);
  };

  useEffect(() => {
    load();
  }, [token, currentOrgId]);

  const add = async () => {
    if (!currentOrgId) return;
    await apiPost(
      `/organizations/${currentOrgId}/members`,
      { userId, role },
      { token },
    );
    setUserId("");
    load();
  };

  const remove = async (targetId: string) => {
    if (!currentOrgId) return;
    await apiDelete(
      `/organizations/${currentOrgId}/members/${targetId}`,
      { token },
    );
    load();
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="text-sm font-semibold text-foreground">Members</div>
        <p className="mt-1 text-sm text-muted">
          Manage roles for the selected organization.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <select
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="member">member</option>
            <option value="admin">admin</option>
            <option value="owner">owner</option>
          </select>
          <button
            onClick={add}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Invite
          </button>
        </div>
      </div>
      <div className="glass rounded-2xl p-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted">
          Team members
        </div>
        <div className="mt-4 space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3"
            >
              <div>
                <div className="font-semibold text-foreground">
                  {member.user?.id ?? "unknown"}
                </div>
                <div className="text-sm text-muted">
                  {member.user?.email ?? "—"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RoleBadge role={member.role} />
                <button
                  onClick={() => remove(member.user?.id ?? "")}
                  className="text-xs font-semibold text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
