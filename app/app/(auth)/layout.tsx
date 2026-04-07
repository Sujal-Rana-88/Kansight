"use client";

import { useEffect } from "react";
import { useUIStore } from "../lib/store";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useUIStore((s) => s.authToken);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, router]);

  if (token) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-surface text-foreground flex items-center justify-center px-6 py-12">
      <div className="glass w-full max-w-md rounded-3xl p-8">{children}</div>
    </div>
  );
}
