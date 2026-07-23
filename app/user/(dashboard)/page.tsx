import {
  CheckCircle2,
  ClipboardList,
  Package,
  ShoppingCart,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";

const stats = [
  {
    title: "Assigned Products",
    value: "86",
    change: "+4",
    trend: "up" as const,
    icon: Package,
    tone: "indigo" as const,
  },
  {
    title: "Tasks Today",
    value: "12",
    change: "3 done",
    trend: "up" as const,
    icon: ClipboardList,
    tone: "emerald" as const,
  },
  {
    title: "Pending Orders",
    value: "7",
    change: "-2",
    trend: "down" as const,
    icon: ShoppingCart,
    tone: "amber" as const,
  },
  {
    title: "Completed",
    value: "28",
    change: "+6",
    trend: "up" as const,
    icon: CheckCircle2,
    tone: "rose" as const,
  },
];

export default function UserDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <p className="text-2xl font-semibold text-emerald-600">Staff Workspace</p>
        <h1 className="text-lg">My Dashboard</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          View your assigned products, daily tasks, and pending orders in one
          place.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="surface-card p-6">
          <h3>Today&apos;s Tasks</h3>
          <ul className="mt-4 space-y-2">
            {[
              "Update stock for SKU-221",
              "Pack order #ORD-9081",
              "Verify incoming shipment",
            ].map((task) => (
              <li
                key={task}
                className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3 text-sm"
              >
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="font-medium">{task}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="surface-card p-6">
          <h3>Recent Orders</h3>
          <ul className="mt-4 space-y-2">
            {[
              { id: "ORD-9081", status: "Packing" },
              { id: "ORD-9074", status: "Ready" },
              { id: "ORD-9068", status: "Pending" },
            ].map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm hover:bg-muted/60"
              >
                <span className="font-medium">{order.id}</span>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {order.status}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
