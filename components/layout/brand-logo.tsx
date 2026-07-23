import { appConfig } from "@/config/navigation";
import { getSidebarBranding } from "@/lib/branding";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

type BrandLogoProps = {
  className?: string;
  showText?: boolean;
  user?: AuthUser;
};

export function BrandLogo({ className, showText = true, user }: BrandLogoProps) {
  const LogoIcon = appConfig.logoIcon;
  const branding = user ? getSidebarBranding(user) : {
    title: appConfig.name,
    subtitle: appConfig.description,
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25">
        <LogoIcon className="size-4.5" strokeWidth={2.25} />
      </div>
      {showText ? (
        <div className="grid min-w-0 flex-1 text-left leading-tight">
          <span className="truncate text-[15px] font-bold text-sidebar-foreground">
            {branding.title}
          </span>
          <span className="truncate text-[11px] font-medium text-muted-foreground">
            {branding.subtitle}
          </span>
        </div>
      ) : null}
    </div>
  );
}
