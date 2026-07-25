import { cn } from "@/lib/utils";
import type {
  PlatformRoleScope,
  PlatformRoleStatus,
} from "@/types/platform-role";
import {
  platformRoleScopeLabels,
  platformRoleStatusLabels,
} from "@/types/platform-role";

const scopeStyles: Record<PlatformRoleScope, string> = {
  platform: "bg-slate-100 text-slate-700 ring-slate-200",
  company: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

const statusStyles: Record<PlatformRoleStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function PlatformRoleScopeBadge({
  scope,
  className,
}: {
  scope: PlatformRoleScope;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        scopeStyles[scope],
        className
      )}
    >
      {platformRoleScopeLabels[scope]}
    </span>
  );
}

export function PlatformRoleStatusBadge({
  status,
  className,
}: {
  status: PlatformRoleStatus;
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
      {platformRoleStatusLabels[status]}
    </span>
  );
}
