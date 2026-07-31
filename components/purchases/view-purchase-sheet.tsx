"use client";

import {
  Building2,
  CalendarDays,
  FileText,
  Hash,
  Package,
  Truck,
  User,
} from "lucide-react";

import { UiButton } from "@/components/Button";
import { PurchaseStatusBadge } from "@/components/purchases/purchase-status-badge";
import { SheetLayout } from "@/components/sheet-layout";
import type { Purchase } from "@/types/purchase";
import { formatMoney } from "@/types/sale";

type ViewPurchaseSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase | null;
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

export function ViewPurchaseSheet({
  open,
  onOpenChange,
  purchase,
}: ViewPurchaseSheetProps) {
  if (!purchase) return null;

  return (
    <SheetLayout
      open={open}
      onOpenChange={onOpenChange}
      badge="Purchases"
      title={`Purchase #${purchase.id}`}
      description="View purchase details, supplier, and line items."
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
        <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50/80 via-white to-violet-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Truck className="size-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">
                {purchase.supplierName ?? "Supplier"}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatMoney(purchase.totalAmount)}
              </p>
            </div>
          </div>
          <PurchaseStatusBadge status={purchase.status} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailItem
            icon={Hash}
            label="Purchase ID"
            value={`#${purchase.id}`}
          />
          <DetailItem
            icon={Building2}
            label="Supplier"
            value={
              <div>
                <p>{purchase.supplierName ?? "—"}</p>
                {purchase.supplierEmail ? (
                  <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                    {purchase.supplierEmail}
                  </p>
                ) : null}
              </div>
            }
          />
          <DetailItem
            icon={User}
            label="Purchased By"
            value={
              <div>
                <p>{purchase.buyerName ?? "—"}</p>
                {purchase.buyerEmail ? (
                  <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                    {purchase.buyerEmail}
                  </p>
                ) : null}
              </div>
            }
          />
          <DetailItem
            icon={CalendarDays}
            label="Date"
            value={purchase.createdAt}
          />
          <DetailItem
            icon={FileText}
            label="Notes"
            value={purchase.notes || "No notes"}
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Items</p>
          <div className="overflow-hidden rounded-xl border border-indigo-100/80">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-semibold">Product</th>
                  <th className="px-3 py-2 font-semibold">Qty</th>
                  <th className="px-3 py-2 font-semibold">Cost</th>
                  <th className="px-3 py-2 font-semibold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchase.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="size-3.5 text-indigo-600" />
                        <div>
                          <p className="font-medium">
                            {item.productName ?? "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.productSku ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">{item.quantity}</td>
                    <td className="px-3 py-3">{formatMoney(item.unitCost)}</td>
                    <td className="px-3 py-3 text-right font-semibold">
                      {formatMoney(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SheetLayout>
  );
}
