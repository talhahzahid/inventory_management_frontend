import { cn } from "@/lib/utils";
import type { CategoryStatus } from "@/types/category";
import { categoryStatusLabels } from "@/types/category";

const statusStyles: Record<CategoryStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
};

type CategoryStatusBadgeProps = {
  status: CategoryStatus;
  className?: string;
};

export function CategoryStatusBadge({
  status,
  className,
}: CategoryStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusStyles[status],
        className
      )}
    >
      {categoryStatusLabels[status]}
    </span>
  );
}
