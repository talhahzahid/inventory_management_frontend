import { cn } from "@/lib/utils";
import type { PlatformRoleName } from "@/types/platform-role";
import { platformRoleNameLabels } from "@/types/platform-role";

const nameStyles: Record<PlatformRoleName, string> = {
  superAdmin: "bg-slate-100 text-slate-700 ring-slate-200",
  admin: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  manager: "bg-amber-50 text-amber-700 ring-amber-200",
  employee: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function PlatformRoleNameBadge({
  name,
  className,
}: {
  name: PlatformRoleName;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        nameStyles[name],
        className
      )}
    >
      {platformRoleNameLabels[name]}
    </span>
  );
}
