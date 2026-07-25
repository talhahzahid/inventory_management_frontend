import { cn } from "@/lib/utils";
import type { StaffStatus } from "@/types/team";
import { staffStatusLabels } from "@/types/team";

const statusStyles: Record<StaffStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  invited: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
};

type StaffStatusBadgeProps = {
  status: StaffStatus;
  className?: string;
};

export function StaffStatusBadge({ status, className }: StaffStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusStyles[status],
        className
      )}
    >
      {staffStatusLabels[status]}
    </span>
  );
}
