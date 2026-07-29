import { cn } from "@/lib/utils";
import type { SupplierStatus } from "@/types/supplier";
import { supplierStatusLabels } from "@/types/supplier";

const statusStyles: Record<SupplierStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
};

type SupplierStatusBadgeProps = {
  status: SupplierStatus;
  className?: string;
};

export function SupplierStatusBadge({
  status,
  className,
}: SupplierStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusStyles[status],
        className
      )}
    >
      {supplierStatusLabels[status]}
    </span>
  );
}
