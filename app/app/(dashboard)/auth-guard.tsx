"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "../lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useUIStore((s) => s.authToken);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
