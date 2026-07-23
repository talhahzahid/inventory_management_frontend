"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  getDashboardPathForRole,
  getLoginPathForRole,
  getSession,
} from "@/lib/auth";
import type { UserRole } from "@/types/auth";

type AuthGuardProps = {
  allowedRole: UserRole;
  children: React.ReactNode;
};

export function AuthGuard({ allowedRole, children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace(getLoginPathForRole(allowedRole));
      return;
    }

    if (session.role !== allowedRole) {
      router.replace(getDashboardPathForRole(session.role));
      return;
    }

    setReady(true);
  }, [allowedRole, pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-3 text-center">
          <div className="mx-auto size-10 animate-pulse rounded-2xl bg-primary/15" />
          <p className="text-sm text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return children;
}
