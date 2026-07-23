"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { roleNavConfig } from "@/config/navigation";
import { getSession } from "@/lib/auth";
import type { AuthUser, UserRole } from "@/types/auth";

type RoleWorkspaceProps = {
  role: UserRole;
  title?: string;
  children: React.ReactNode;
};

export function RoleWorkspace({ role, title, children }: RoleWorkspaceProps) {
  const config = roleNavConfig[role];
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getSession());
  }, []);

  if (!user) {
    return null;
  }

  return (
    <AppShell
      title={title}
      navGroups={config.navGroups}
      homeHref={config.basePath}
      user={user}
      logoutPath={config.loginPath}
    >
      {children}
    </AppShell>
  );
}
