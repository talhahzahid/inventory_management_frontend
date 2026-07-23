"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { appConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

const roleStyles: Record<
  UserRole,
  {
    panelClass: string;
    buttonClass: string;
    badge: string;
    mobileBanner: string;
  }
> = {
  super_admin: {
    panelClass: "login-panel-super-admin",
    buttonClass: "login-btn-super-admin",
    badge: "bg-indigo-400/20 text-indigo-100 ring-indigo-300/30",
    mobileBanner: "login-panel-super-admin",
  },
  company_admin: {
    panelClass: "login-panel-company-admin",
    buttonClass: "login-btn-company-admin",
    badge: "bg-white/15 text-white ring-white/20",
    mobileBanner: "login-panel-company-admin",
  },
  user: {
    panelClass: "login-panel-user",
    buttonClass: "login-btn-user",
    badge: "bg-emerald-300/20 text-emerald-50 ring-emerald-200/30",
    mobileBanner: "login-panel-user",
  },
};

type LoginLayoutProps = {
  role: UserRole;
  badge: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function LoginLayout({
  role,
  badge,
  title,
  subtitle,
  children,
}: LoginLayoutProps) {
  const styles = roleStyles[role];
  const LogoIcon = appConfig.logoIcon;

  return (
    <div className="login-form-bg min-h-screen lg:grid lg:grid-cols-2">
      {/* Desktop left panel */}
      <div
        className={cn(
          "relative hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-between",
          styles.panelClass
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[32px_32px]" />
        <div className="pointer-events-none absolute -top-20 -right-20 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-10 size-72 rounded-full bg-black/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-8 p-10 xl:p-14">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-white/20"
          >
            <ArrowLeft className="size-4" />
            Back to portals
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/25 backdrop-blur-sm">
              <LogoIcon className="size-5" />
            </div>
            <div>
              <p className="text-xl font-bold">{appConfig.name}</p>
              <p className="text-sm text-white/75">{appConfig.description}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 p-10 xl:p-14">
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-inset",
              styles.badge
            )}
          >
            {badge}
          </span>
          <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            {title}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/80">
            {subtitle}
          </p>
        </div>

        <p className="relative z-10 p-10 text-sm text-white/50 xl:p-14">
          © {new Date().getFullYear()} {appConfig.name}. Secure SaaS access.
        </p>
      </div>

      {/* Right form side */}
      <div className="flex min-h-screen flex-col">
        {/* Mobile gradient banner */}
        <div
          className={cn(
            "relative overflow-hidden px-6 py-8 text-white lg:hidden",
            styles.mobileBanner
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-black/10" />
          <Link
            href="/"
            className="relative z-10 inline-flex items-center gap-2 text-sm font-medium text-white/90"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <div className="relative z-10 mt-6 space-y-2">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset",
                styles.badge
              )}
            >
              {badge}
            </span>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-white/80">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
          <div className="mx-auto w-full max-w-md rounded-3xl border border-indigo-100/80 bg-white p-6 shadow-[0_24px_60px_rgba(79,70,229,0.12)] sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export { roleStyles as accentStyles };
