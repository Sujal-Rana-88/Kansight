"use client";

import Link from "next/link";
import { useState } from "react";
import { apiPost } from "../../lib/api";
import { useUIStore } from "../../lib/store";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const setToken = useUIStore((s) => s.setAuthToken);
  const router = useRouter();

  const submit = async () => {
    try {
      setError(null);
      const res = await apiPost<{ access_token: string }>("/auth/signup", {
        email,
        password,
      });
      setToken(res.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create your workspace</h1>
        <p className="text-sm text-muted">
          Start tracking behavior and insights in minutes.
        </p>
      </div>
      <form className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
            placeholder="Create a strong password"
          />
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button
          type="button"
          onClick={submit}
          className="w-full rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Create account
        </button>
      </form>
      <div className="text-sm text-muted">
        Already have an account?{" "}
        <Link className="text-brand font-semibold" href="/login">
          Sign in
        </Link>
      </div>
    </div>
  );
}
