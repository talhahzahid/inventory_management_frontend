"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-indigo-100 bg-white text-slate-900 shadow-lg shadow-indigo-500/10",
          title: "font-semibold",
          description: "text-muted-foreground",
          success: "border-emerald-200 bg-emerald-50 text-emerald-900",
          error: "border-red-200 bg-red-50 text-red-900",
        },
      }}
    />
  );
}
