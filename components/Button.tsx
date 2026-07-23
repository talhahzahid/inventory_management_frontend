import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UiButtonVariant = "primary" | "secondary" | "ghost" | "outline";

interface UiButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  buttonText?: string;
  variant?: UiButtonVariant;
  icon?: LucideIcon;
}

const variantStyles: Record<UiButtonVariant, string> = {
  primary:
    "gradient-primary gradient-primary-hover h-10 rounded-xl px-4 font-semibold text-primary-foreground shadow-md shadow-indigo-500/25",
  secondary:
    "h-10 rounded-xl bg-linear-to-r from-indigo-50 to-violet-50 px-4 font-semibold text-secondary-foreground hover:from-indigo-100 hover:to-violet-100",
  ghost:
    "h-10 rounded-xl font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
  outline:
    "h-10 rounded-xl border-border bg-card font-medium shadow-sm hover:bg-muted",
};

export const UiButton = ({
  buttonText,
  children,
  className,
  variant = "primary",
  icon: Icon,
  ...props
}: UiButtonProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {Icon ? <Icon className="size-4" /> : null}
      {children || buttonText}
    </Button>
  );
};
