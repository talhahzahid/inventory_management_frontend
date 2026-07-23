"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/layout/brand-logo";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavGroup } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

type AppSidebarProps = {
  navGroups: NavGroup[];
  homeHref: string;
  user: AuthUser;
  logoutPath: string;
};

function isActiveRoute(pathname: string, href: string) {
  if (href === "/admin" || href === "/company" || href === "/user") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar({
  navGroups,
  homeHref,
  user,
  logoutPath,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="overflow-hidden border-r border-indigo-100/80">
      <SidebarHeader className="gap-3 px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href={homeHref} />}
              className="rounded-xl hover:bg-sidebar-accent"
            >
              <BrandLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="mx-1 h-px bg-sidebar-border" />
      </SidebarHeader>

      <SidebarContent className="px-1 py-1">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/80">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const active = isActiveRoute(pathname, item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.title}
                        className={cn(
                          "h-10 overflow-hidden rounded-xl font-medium transition-colors",
                          active &&
                            "bg-linear-to-r from-indigo-500/10 via-indigo-400/10 to-violet-400/10 text-indigo-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] hover:from-indigo-500/10 hover:via-indigo-400/10 hover:to-violet-400/10"
                        )}
                      >
                        <item.icon
                          className={cn(
                            active ? "text-indigo-600" : "text-muted-foreground"
                          )}
                        />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-1 pb-3">
        <NavUser user={user} logoutPath={logoutPath} />
      </SidebarFooter>
    </Sidebar>
  );
}
