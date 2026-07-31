import { cn } from "@/lib/utils";
import type { SaleStatus } from "@/types/sale";
import { saleStatusLabels } from "@/types/sale";

const statusStyles: Record<SaleStatus, string> = {
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
};

type SaleStatusBadgeProps = {
  status: SaleStatus;
  className?: string;
};

export function SaleStatusBadge({ status, className }: SaleStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusStyles[status],
        className
      )}
    >
      {saleStatusLabels[status]}
    </span>
  );
}
