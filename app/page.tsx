import { Building2, Package, Shield, Users } from "lucide-react";
import Link from "next/link";

import { UiButton } from "@/components/Button";
import { appConfig, loginPortals } from "@/config/navigation";
import { cn } from "@/lib/utils";

const accentStyles = {
  slate: {
    card: "border-slate-200/80 bg-linear-to-br from-white via-white to-slate-50 hover:border-slate-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]",
    badge: "bg-linear-to-r from-slate-100 to-slate-50 text-slate-700",
    icon: "bg-linear-to-br from-slate-800 to-slate-950 text-white shadow-lg shadow-slate-900/20",
  },
  indigo: {
    card: "border-indigo-100/80 bg-linear-to-br from-white via-indigo-50/30 to-violet-50/40 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(79,70,229,0.14)]",
    badge: "bg-linear-to-r from-indigo-50 to-violet-50 text-indigo-700",
    icon: "bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25",
  },
  emerald: {
    card: "border-emerald-100/80 bg-linear-to-br from-white via-emerald-50/30 to-teal-50/40 hover:border-emerald-200 hover:shadow-[0_20px_50px_rgba(5,150,105,0.14)]",
    badge: "bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-700",
    icon: "bg-linear-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25",
  },
};

const portalIcons = {
  super_admin: Shield,
  company_admin: Building2,
  user: Users,
};

export default function PortalPage() {
  const LogoIcon = appConfig.logoIcon;

  return (
    <div className="portal-gradient-bg min-h-screen">
      <div className="page-shell flex min-h-screen flex-col px-4 py-10 md:px-6">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/70 bg-white/55 p-6 shadow-[0_20px_60px_rgba(79,70,229,0.08)] backdrop-blur-md md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
              <LogoIcon className="size-5" />
            </div>
            <div>
              <p className="text-lg font-bold">{appConfig.name}</p>
              <p className="text-sm text-muted-foreground">
                Multi-tenant inventory SaaS platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <UiButton variant="outline" buttonText="Documentation" />
            <UiButton variant="primary" buttonText="Contact Sales" />
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-10">
          <div className="mx-auto w-full max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-linear-to-r from-indigo-500/10 to-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-500/10">
              SaaS Access Portals
            </span>
            <h1 className="mt-4 bg-linear-to-r from-slate-900 via-indigo-950 to-violet-800 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
              Choose your workspace
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Platform admin, company owner, and staff members each have a
              dedicated login and dashboard experience.
            </p>
          </div>

          <div className="mx-auto mt-12 grid w-full max-w-6xl gap-5 md:grid-cols-3">
            {loginPortals.map((portal) => {
              const styles = accentStyles[portal.accent];
              const Icon = portalIcons[portal.role];

              return (
                <Link
                  key={portal.role}
                  href={portal.href}
                  className={cn(
                    "surface-card group flex flex-col border p-6 transition-all duration-200 hover:-translate-y-1",
                    styles.card
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-2xl",
                        styles.icon
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                        styles.badge
                      )}
                    >
                      {portal.badge}
                    </span>
                  </div>

                  <div className="mt-6 space-y-2">
                    <h2 className="text-xl font-bold">{portal.title}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {portal.description}
                    </p>
                  </div>

                  <div className="mt-8 text-sm font-semibold text-primary group-hover:underline">
                    Continue to login →
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mx-auto mt-10 grid w-full max-w-4xl gap-4 md:grid-cols-3">
            {[
              { label: "Registered Companies", value: "128", icon: Building2 },
              { label: "Active Users", value: "2,430", icon: Users },
              { label: "Products Managed", value: "84K+", icon: Package },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/70 bg-linear-to-br from-white/90 to-indigo-50/50 px-5 py-4 shadow-[0_10px_30px_rgba(79,70,229,0.06)] backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="size-4 text-indigo-600" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-lg font-bold">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
