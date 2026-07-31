import { cn } from "@/lib/utils";
import type { StockLevel } from "@/types/product";
import { stockLevelLabels } from "@/types/product";

const stockLevelStyles: Record<StockLevel, string> = {
  in_stock: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  low_stock: "bg-amber-50 text-amber-700 ring-amber-200",
  out_of_stock: "bg-rose-50 text-rose-700 ring-rose-200",
};

type StockLevelBadgeProps = {
  level: StockLevel;
  className?: string;
};

export function StockLevelBadge({ level, className }: StockLevelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        stockLevelStyles[level],
        className
      )}
    >
      {stockLevelLabels[level]}
    </span>
  );
}
