"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type SheetLayoutSize = "sm" | "md" | "lg" | "xl" | "2xl";

const sizeClasses: Record<SheetLayoutSize, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-xl",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-3xl",
  "2xl": "sm:max-w-4xl",
};

type SheetLayoutProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  badge?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  size?: SheetLayoutSize;
  className?: string;
};

export function SheetLayout({
  open,
  onOpenChange,
  title,
  description,
  badge,
  children,
  footer,
  side = "right",
  size = "lg",
  className,
}: SheetLayoutProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          "flex h-full w-full flex-col gap-0 border-indigo-100/80 bg-white p-0 sm:w-full sm:max-w-none",
          sizeClasses[size],
          className
        )}
      >
        <SheetHeader className="shrink-0 border-b border-indigo-100/80 bg-linear-to-r from-indigo-50/80 via-white to-violet-50/50 px-6 py-5 text-left">
          {badge ? (
            <span className="mb-2 inline-flex w-fit rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
              {badge}
            </span>
          ) : null}
          <SheetTitle className="text-xl font-bold text-slate-900">
            {title}
          </SheetTitle>
          {description ? (
            <SheetDescription className="text-sm text-muted-foreground">
              {description}
            </SheetDescription>
          ) : null}
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <SheetFooter className="shrink-0 flex-row justify-end gap-2 border-t border-indigo-100/80 bg-slate-50/60 px-6 py-4">
            {footer}
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
