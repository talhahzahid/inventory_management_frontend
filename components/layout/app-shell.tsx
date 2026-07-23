"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Navbar } from "@/components/layout/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { NavGroup } from "@/config/navigation";
import type { AuthUser } from "@/types/auth";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  navGroups: NavGroup[];
  homeHref: string;
  user: AuthUser;
  logoutPath: string;
};

export function AppShell({
  children,
  title,
  navGroups,
  homeHref,
  user,
  logoutPath,
}: AppShellProps) {
  return (
    <SidebarProvider className="overflow-x-hidden">
      <AppSidebar
        navGroups={navGroups}
        homeHref={homeHref}
        user={user}
        logoutPath={logoutPath}
      />
      <SidebarInset className="app-gradient-bg min-w-0">
        <Navbar title={title} user={user} logoutPath={logoutPath} />
        <main className="relative flex flex-1 flex-col p-4 md:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_70%)]" />
          <div className="page-shell relative flex flex-1 flex-col gap-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
