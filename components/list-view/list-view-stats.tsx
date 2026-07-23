import { cn } from "@/lib/utils";
import type { ListViewStat } from "@/types/list-view";

const toneStyles = {
  default: "text-foreground",
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-rose-600",
};

type ListViewStatsProps = {
  stats: ListViewStat[];
  className?: string;
};

export function ListViewStats({ stats, className }: ListViewStatsProps) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-indigo-100/70 bg-linear-to-br from-white to-indigo-50/40 px-4 py-3"
        >
          <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
          <p
            className={cn(
              "mt-1 text-xl font-bold",
              toneStyles[stat.tone ?? "default"]
            )}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
