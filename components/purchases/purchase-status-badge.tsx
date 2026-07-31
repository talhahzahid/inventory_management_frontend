import { cn } from "@/lib/utils";
import type { PurchaseStatus } from "@/types/purchase";
import { purchaseStatusLabels } from "@/types/purchase";

const statusStyles: Record<PurchaseStatus, string> = {
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
};

type PurchaseStatusBadgeProps = {
  status: PurchaseStatus;
  className?: string;
};

export function PurchaseStatusBadge({
  status,
  className,
}: PurchaseStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusStyles[status],
        className
      )}
    >
      {purchaseStatusLabels[status]}
    </span>
  );
}
