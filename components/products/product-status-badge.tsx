import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/types/product";
import { productStatusLabels } from "@/types/product";

const statusStyles: Record<ProductStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
};

type ProductStatusBadgeProps = {
  status: ProductStatus;
  className?: string;
};

export function ProductStatusBadge({
  status,
  className,
}: ProductStatusBadgeProps) {
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
