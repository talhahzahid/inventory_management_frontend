import { appConfig } from "@/config/navigation";
import { getSidebarBranding } from "@/lib/branding";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";
import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  showText?: boolean;
  user?: AuthUser;

};

export function BrandLogo({ className, showText = true, user }: BrandLogoProps) {
  console.log(user)
  const LogoIcon = appConfig.logoIcon;
  console.log(LogoIcon, 'icon')
  const branding = user ? getSidebarBranding(user) : {
    title: appConfig.name,
    subtitle: appConfig.description,
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative size-9 shrink-0 rounded-xl overflow-hidden bg-linear-to-br from-indigo-500 to-indigo-600">
        <Image
          src={user?.companyLogo}
          alt="Logo"
          fill
          className="object-contain"
        />
        {/* <Image
          src={LogoIcon}
          alt="Logo"
          fill
          className="object-cover"
        /> */}
        {/* {user?.companyLogo ? (
          <Image
            src={user?.companyLogo}
            alt="Logo"
            fill
            className="object-contain"
          />
        ) : (
          <LogoIcon className="size-4.5" strokeWidth={2.25} />
        )} */}
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
