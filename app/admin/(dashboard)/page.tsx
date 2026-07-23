import {
  Building2,
  CreditCard,
  TrendingUp,
  Users,
} from "lucide-react";

import { UiButton } from "@/components/Button";
import { StatCard } from "@/components/dashboard/stat-card";

const stats = [
  {
    title: "Total Companies",
    value: "128",
    change: "+8%",
    trend: "up" as const,
    icon: Building2,
    tone: "indigo" as const,
  },
  {
    title: "Active Subscriptions",
    value: "96",
    change: "+12%",
    trend: "up" as const,
    icon: CreditCard,
    tone: "emerald" as const,
  },
  {
    title: "Platform Users",
    value: "2,430",
    change: "+18%",
    trend: "up" as const,
    icon: Users,
    tone: "amber" as const,
  },
  {
    title: "Monthly Revenue",
    value: "$84K",
    change: "+6%",
    trend: "up" as const,
    icon: TrendingUp,
    tone: "rose" as const,
  },
];

const companies = [
  { name: "Universal Trading Co.", plan: "Pro", users: 24, status: "Active" },
  { name: "Metro Supplies", plan: "Enterprise", users: 58, status: "Active" },
  { name: "QuickMart", plan: "Starter", users: 8, status: "Trial" },
  { name: "Global Parts", plan: "Pro", users: 31, status: "Active" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-indigo-600">Platform Admin</p>
          <h1 className="text-lg">Super Admin Dashboard</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Monitor all companies, subscriptions, revenue, and platform health
            from one control center.
          </p>
        </div>
        <UiButton variant="primary" buttonText="Add Company" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/70 px-6 py-5">
          <div>
            <h3>Registered Companies</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Overview of tenants on your SaaS platform
            </p>
          </div>
          <UiButton variant="outline" buttonText="View All" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Company</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Users</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.name}
                  className="border-t border-border/70 transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4 font-medium">{company.name}</td>
                  <td className="px-6 py-4">{company.plan}</td>
                  <td className="px-6 py-4">{company.users}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        company.status === "Active"
                          ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                          : "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
                      }
                    >
                      {company.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
