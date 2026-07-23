import { appConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  showText?: boolean;
};

export function BrandLogo({ className, showText = true }: BrandLogoProps) {
  const LogoIcon = appConfig.logoIcon;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25">
        <LogoIcon className="size-4.5" strokeWidth={2.25} />
      </div>
      {showText ? (
        <div className="grid min-w-0 flex-1 text-left leading-tight">
          <span className="truncate text-[15px] font-bold text-sidebar-foreground">
            {appConfig.name}
          </span>
          <span className="truncate text-[11px] font-medium text-muted-foreground">
            {appConfig.description}
          </span>
        </div>
      ) : null}
    </div>
  );
}
