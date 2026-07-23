import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/types/product";
import { productStatusLabels } from "@/types/product";

const statusStyles: Record<ProductStatus, string> = {
  in_stock: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  low_stock: "bg-amber-50 text-amber-700 ring-amber-200",
  out_of_stock: "bg-rose-50 text-rose-700 ring-rose-200",
  draft: "bg-slate-100 text-slate-600 ring-slate-200",
};

type StatusBadgeProps = {
  status: ProductStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusStyles[status],
        className
      )}
    >
      {productStatusLabels[status]}
    </span>
  );
}
