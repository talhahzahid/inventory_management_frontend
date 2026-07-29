"use client";

import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";

import { UiButton } from "@/components/Button";
import { SupplierStatusBadge } from "@/components/suppliers/supplier-status-badge";
import { SheetLayout } from "@/components/sheet-layout";
import type { Supplier } from "@/types/supplier";

type ViewSupplierSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
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

export function ViewSupplierSheet({
  open,
  onOpenChange,
  supplier,
}: ViewSupplierSheetProps) {
  if (!supplier) {
    return null;
  }

  return (
    <SheetLayout
      open={open}
      onOpenChange={onOpenChange}
      badge="Operations"
      title={supplier.name}
      description="Supplier contact and status details."
      size="2xl"
      footer={
        <UiButton
          type="button"
          variant="outline"
          buttonText="Close"
          onClick={() => onOpenChange(false)}
        />
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-indigo-100/80 bg-linear-to-r from-indigo-50/60 to-violet-50/40 px-4 py-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <Truck className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {supplier.name}
            </p>
            <SupplierStatusBadge status={supplier.status} className="mt-1" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailItem icon={Phone} label="Phone" value={supplier.phone} />
          <DetailItem icon={Mail} label="Email" value={supplier.email} />
          <DetailItem
            icon={MapPin}
            label="Address"
            value={supplier.address}
          />
          <DetailItem
            icon={CalendarDays}
            label="Last Updated"
            value={supplier.updatedAt}
          />
        </div>
      </div>
    </SheetLayout>
  );
}
