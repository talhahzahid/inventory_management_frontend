"use client";

import {
  Building2,
  CalendarDays,
  FileText,
  FolderTree,
  Hash,
  Package,
  Pencil,
} from "lucide-react";

import { UiButton } from "@/components/Button";
import { CategoryStatusBadge } from "@/components/categories/category-status-badge";
import { SheetLayout } from "@/components/sheet-layout";
import type { Category } from "@/types/category";

type ViewCategorySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onEdit?: () => void;
};

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-indigo-100/80 bg-slate-50/60 px-4 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

export function ViewCategorySheet({
  open,
  onOpenChange,
  category,
  onEdit,
}: ViewCategorySheetProps) {
  if (!category) return null;

  return (
    <SheetLayout
      open={open}
      onOpenChange={onOpenChange}
      badge="Inventory"
      title={category.name}
      description="View category details and catalog information."
      size="2xl"
      footer={
        <>
          <UiButton
            type="button"
            variant="outline"
            buttonText="Close"
            onClick={() => onOpenChange(false)}
          />
          <UiButton
            type="button"
            variant="primary"
            icon={Pencil}
            buttonText="Edit Category"
            onClick={onEdit}
          />
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50/80 via-white to-violet-50/50 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <FolderTree className="size-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{category.name}</p>
              <p className="text-sm text-muted-foreground">{category.slug}</p>
            </div>
          </div>
          <CategoryStatusBadge status={category.status} />
        </div>

        <DetailItem
          icon={FileText}
          label="Description"
          value={category.description || "No description provided."}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailItem
            icon={Building2}
            label="Company"
            value={
              <div>
                <p>{category.companyName ?? "—"}</p>
                {category.companyEmail ? (
                  <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                    {category.companyEmail}
                  </p>
                ) : null}
              </div>
            }
          />
          <DetailItem icon={Hash} label="Category ID" value={`#${category.id}`} />
          <DetailItem
            icon={Package}
            label="Products"
            value={`${category.productCount} products`}
          />
          <DetailItem
            icon={CalendarDays}
            label="Created"
            value={category.createdAt ?? category.updatedAt}
          />
          <DetailItem
            icon={CalendarDays}
            label="Last Updated"
            value={category.updatedAt}
          />
        </div>
      </div>
    </SheetLayout>
  );
}
