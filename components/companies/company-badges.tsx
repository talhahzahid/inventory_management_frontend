import { cn } from "@/lib/utils";
import type { CompanyStatus } from "@/types/company";
import { companyStatusLabels } from "@/types/company";

const statusStyles: Record<CompanyStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function CompanyStatusBadge({
  status,
  className,
}: {
  status: CompanyStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusStyles[status],
        className
      )}
    >
      {companyStatusLabels[status]}
    </span>
  );
}
