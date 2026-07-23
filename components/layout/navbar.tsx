"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { clearSession } from "@/lib/auth";
import { getUserRoleLabel } from "@/lib/branding";
import type { AuthUser } from "@/types/auth";

import { getInitials } from "./nav-user";

type NavbarProps = {
  title?: string;
  user: AuthUser;
  logoutPath: string;
};

export function Navbar({ title = "Dashboard", user, logoutPath }: NavbarProps) {
  const router = useRouter();
  const initials = getInitials(user.name);

  const handleLogout = () => {
    clearSession();
    router.push(logoutPath);
  };

  return (
    <header className="navbar-glass sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-indigo-100/70 px-4 md:px-6">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="hidden h-5 w-px bg-border md:block" />

      <p className="hidden text-sm font-semibold text-foreground md:block">
        {title}
      </p>

      <div className="relative ml-auto w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="h-10 rounded-xl border-indigo-100/80 bg-white/80 pl-10 shadow-sm backdrop-blur-sm"
        />
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-10 gap-2 rounded-xl px-2 hover:bg-muted"
                aria-label="Open user menu"
              />
            }
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-indigo-100 text-xs font-semibold text-indigo-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium lg:inline">
              {user.company && user.role !== "super_admin"
                ? `${user.name} · ${user.company}`
                : user.name}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56 rounded-xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold">{user.name}</p>
                  {user.company ? (
                    <p className="text-xs font-medium text-indigo-600">
                      {user.company}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {getUserRoleLabel(user.role)} · {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/" />}>Switch Portal</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
