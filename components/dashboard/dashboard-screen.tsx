"use client";

import {
  AlertTriangle,
  Banknote,
  Package,
  Plus,
  ShoppingBag,
  Tags,
  Truck,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { UiButton } from "@/components/Button";
import { DashboardScreenLoader } from "@/components/dashboard/dashboard-screen-loader";
import { StatCard } from "@/components/dashboard/stat-card";
import { getSession } from "@/lib/auth";
import { fetchDashboardSummary } from "@/lib/dashboard";
import {
  formatDashboardAmount,
  formatDashboardNumber,
  type DashboardSummary,
} from "@/types/dashboard";

type DashboardScreenProps = {
  variant?: "company" | "user" | "admin";
  companyId?: string;
};

export function DashboardScreen({
  variant = "company",
  companyId = "all",
}: DashboardScreenProps) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("Your Company");

  useEffect(() => {
    const session = getSession();
    if (session?.company) {
      setCompanyName(session.company);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      setIsLoading(true);

      try {
        const data = await fetchDashboardSummary(
          companyId !== "all" ? Number(companyId) : undefined
        );
        if (!cancelled) {
          setSummary(data);
          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load dashboard summary."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, [companyId]);

  const stats = useMemo(() => {
    if (!summary) return [];

    return [
      {
        title: "Total Products",
        value: formatDashboardNumber(summary.totalProducts),
        hint: "Active products in catalog",
        icon: Package,
        tone: "indigo" as const,
      },
      {
        title: "Categories",
        value: formatDashboardNumber(summary.totalCategories),
        hint: "Active categories",
        icon: Tags,
        tone: "emerald" as const,
      },
      {
        title: "Suppliers",
        value: formatDashboardNumber(summary.totalSuppliers),
        hint: "Active suppliers",
        icon: Truck,
        tone: "amber" as const,
      },
      {
        title: "Stock Units",
        value: formatDashboardNumber(summary.totalStockUnits),
        hint: "Total quantity on hand",
        icon: Warehouse,
        tone: "rose" as const,
      },
      {
        title: "Low Stock",
        value: formatDashboardNumber(summary.lowStockCount),
        hint: "At or below minimum stock",
        icon: AlertTriangle,
        tone: "amber" as const,
      },
      {
        title: "Sales Today",
        value: formatDashboardAmount(summary.sales.today.amount),
        hint: `${formatDashboardNumber(summary.sales.today.count)} orders today`,
        icon: ShoppingBag,
        tone: "indigo" as const,
      },
      {
        title: "Total Sales",
        value: formatDashboardAmount(summary.sales.total.amount),
        hint: `${formatDashboardNumber(summary.sales.total.count)} completed orders`,
        icon: Banknote,
        tone: "emerald" as const,
      },
      {
        title: "Reorder Items",
        value: formatDashboardNumber(summary.reorderList.length),
        hint: "Suggested purchases ready",
        icon: Package,
        tone: "rose" as const,
      },
    ];
  }, [summary]);

  if (isLoading) {
    return <DashboardScreenLoader />;
  }

  const isCompany = variant === "company";
  const isAdmin = variant === "admin";

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p
            className={
              isAdmin
                ? "text-2xl font-semibold text-slate-700"
                : isCompany
                  ? "text-2xl font-semibold text-indigo-600"
                  : "text-2xl font-semibold text-emerald-600"
            }
          >
            {isAdmin
              ? "Platform Control"
              : isCompany
                ? companyName
                : "Staff Workspace"}
          </p>
          <h1 className="text-lg">
            {isAdmin
              ? "Super Admin Dashboard"
              : isCompany
                ? "Company Dashboard"
                : "My Dashboard"}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {isAdmin
              ? "Monitor catalog health, stock, and sales across companies. Use company scope to drill into one tenant."
              : isCompany
                ? "Track catalog health, stock levels, sales, and reorder needs from one workspace."
                : "Monitor stock levels, sales activity, and products that need restocking."}
          </p>
        </div>
        {isCompany ? (
          <div className="flex gap-2">
            <Link href="/company/team">
              <UiButton variant="outline" buttonText="Invite User" />
            </Link>
            <Link href="/company/products/new">
              <UiButton
                variant="primary"
                buttonText="Add Product"
                icon={Plus}
              />
            </Link>
          </div>
        ) : null}
      </section>

      {error ? (
        <div className="surface-card border border-rose-100 bg-rose-50/60 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="surface-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3>Sales Snapshot</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Today vs lifetime completed sales
              </p>
            </div>
            <ShoppingBag className="size-5 text-indigo-600" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-indigo-100/80 bg-indigo-50/40 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Today
              </p>
              <p className="mt-2 text-xl font-bold text-foreground">
                {formatDashboardAmount(summary?.sales.today.amount ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDashboardNumber(summary?.sales.today.count ?? 0)} orders
              </p>
            </div>
            <div className="rounded-xl border border-emerald-100/80 bg-emerald-50/40 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                All Time
              </p>
              <p className="mt-2 text-xl font-bold text-foreground">
                {formatDashboardAmount(summary?.sales.total.amount ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDashboardNumber(summary?.sales.total.count ?? 0)} orders
              </p>
            </div>
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-600" />
              <h3>Reorder List</h3>
            </div>
            {isAdmin ? (
              <Link
                href="/admin/inventory"
                className="text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                View inventory
              </Link>
            ) : isCompany ? (
              <Link
                href="/company/inventory"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View inventory
              </Link>
            ) : (
              <Link
                href="/user/inventory"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View stock
              </Link>
            )}
          </div>

          <ul className="mt-4 space-y-1">
            {(summary?.reorderList ?? []).length === 0 ? (
              <li className="rounded-xl px-3 py-4 text-sm text-muted-foreground">
                No products need reordering right now.
              </li>
            ) : (
              (summary?.reorderList ?? []).map((item) => {
                const urgent = item.currentStock === 0;

                return (
                  <li
                    key={item.productId}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm hover:bg-muted/60"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.sku}
                        {item.warehouseLocation
                          ? ` · ${item.warehouseLocation}`
                          : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span
                        className={
                          urgent
                            ? "rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600"
                            : "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600"
                        }
                      >
                        {item.currentStock} / {item.minimumStock}
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Buy {formatDashboardNumber(item.suggestedPurchaseQty)}
                      </p>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </article>
      </section>
    </div>
  );
}
