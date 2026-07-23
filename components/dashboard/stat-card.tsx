import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  tone?: "indigo" | "emerald" | "amber" | "rose";
};

const toneStyles = {
  indigo: "bg-linear-to-br from-indigo-500/15 to-indigo-600/5 text-indigo-600 ring-1 ring-indigo-500/10",
  emerald: "bg-linear-to-br from-emerald-500/15 to-emerald-600/5 text-emerald-600 ring-1 ring-emerald-500/10",
  amber: "bg-linear-to-br from-amber-500/15 to-amber-600/5 text-amber-600 ring-1 ring-amber-500/10",
  rose: "bg-linear-to-br from-rose-500/15 to-rose-600/5 text-rose-600 ring-1 ring-rose-500/10",
};

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  tone = "indigo",
}: StatCardProps) {
  const positive = trend === "up";

  return (
    <article className="surface-card group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(79,70,229,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl",
            toneStyles[tone]
          )}
        >
          <Icon className="size-5" strokeWidth={2} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
        {positive ? (
          <ArrowUpRight className="size-3.5 text-emerald-600" />
        ) : (
          <ArrowDownRight className="size-3.5 text-amber-600" />
        )}
        <span className={positive ? "text-emerald-600" : "text-amber-600"}>
          {change}
        </span>
        <span className="font-normal text-muted-foreground">vs last month</span>
      </div>
    </article>
  );
}
