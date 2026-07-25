import { cn } from "@/lib/utils";
import type { CompanyPlan, CompanyStatus } from "@/types/company";
import { companyPlanLabels, companyStatusLabels } from "@/types/company";

const planStyles: Record<CompanyPlan, string> = {
  starter: "bg-slate-100 text-slate-700 ring-slate-200",
  pro: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  enterprise: "bg-violet-50 text-violet-700 ring-violet-200",
};

const statusStyles: Record<CompanyStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  trial: "bg-amber-50 text-amber-700 ring-amber-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function CompanyPlanBadge({
  plan,
  className,
}: {
  plan: CompanyPlan;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        planStyles[plan],
        className
      )}
    >
      {companyPlanLabels[plan]}
    </span>
  );
}

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
