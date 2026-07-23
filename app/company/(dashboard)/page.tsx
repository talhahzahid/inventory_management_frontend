import {
  AlertTriangle,
  Package,
  Plus,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";

import { UiButton } from "@/components/Button";
import { StatCard } from "@/components/dashboard/stat-card";

const stats = [
  {
    title: "Total Products",
    value: "1,248",
    change: "+12%",
    trend: "up" as const,
    icon: Package,
    tone: "indigo" as const,
  },
  {
    title: "Stock Items",
    value: "8,420",
    change: "+5%",
    trend: "up" as const,
    icon: Warehouse,
    tone: "emerald" as const,
  },
  {
    title: "Open Orders",
    value: "36",
    change: "-3%",
    trend: "down" as const,
    icon: ShoppingCart,
    tone: "amber" as const,
  },
  {
    title: "Team Members",
    value: "24",
    change: "+2",
    trend: "up" as const,
    icon: Users,
    tone: "rose" as const,
  },
];

export default function CompanyDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-indigo-600">ABC Traders</p>
          <h1>Company Dashboard</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage your company inventory, purchase orders, suppliers, and team
            from one workspace.
          </p>
        </div>
        <div className="flex gap-2">
          <UiButton variant="outline" buttonText="Invite User" />
          <UiButton variant="primary" buttonText="Add Product" icon={Plus} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="surface-card p-6">
          <h3>Recent Activity</h3>
          <ul className="mt-4 space-y-1">
            {[
              "PO-1042 received from supplier",
              "Stock updated for SKU-AX92",
              "New team member invited",
            ].map((item) => (
              <li
                key={item}
                className="rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-muted/60"
              >
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="surface-card p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-600" />
            <h3>Low Stock Alerts</h3>
          </div>
          <ul className="mt-4 space-y-1">
            {[
              { name: "USB-C Cable", stock: "8 left" },
              { name: "Notebook A5", stock: "12 left" },
              { name: "Printer Ink Black", stock: "3 left", urgent: true },
            ].map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm hover:bg-muted/60"
              >
                <span className="font-medium">{item.name}</span>
                <span
                  className={
                    item.urgent
                      ? "rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600"
                      : "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600"
                  }
                >
                  {item.stock}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
