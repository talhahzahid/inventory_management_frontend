"use client";

import {
  CalendarDays,
  FileText,
  Hash,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";

import { UiButton } from "@/components/Button";
import { SaleStatusBadge } from "@/components/sales/sale-status-badge";
import { SheetLayout } from "@/components/sheet-layout";
import { formatMoney, type Sale } from "@/types/sale";

type ViewSaleSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
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

export function ViewSaleSheet({
  open,
  onOpenChange,
  sale,
}: ViewSaleSheetProps) {
  if (!sale) return null;

  return (
    <SheetLayout
      open={open}
      onOpenChange={onOpenChange}
      badge="Sales"
      title={`Sale #${sale.id}`}
      description="View sale details, customer, and line items."
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
              <ShoppingBag className="size-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">
                {sale.customerName || "Walk-in customer"}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatMoney(sale.totalAmount)}
              </p>
            </div>
          </div>
          <SaleStatusBadge status={sale.status} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailItem icon={Hash} label="Sale ID" value={`#${sale.id}`} />
          <DetailItem
            icon={User}
            label="Sold By"
            value={
              <div>
                <p>{sale.sellerName ?? "—"}</p>
                {sale.sellerEmail ? (
                  <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                    {sale.sellerEmail}
                  </p>
                ) : null}
              </div>
            }
          />
          <DetailItem
            icon={CalendarDays}
            label="Date"
            value={sale.createdAt}
          />
          <DetailItem
            icon={FileText}
            label="Notes"
            value={sale.notes || "No notes"}
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
                  <th className="px-3 py-2 font-semibold">Price</th>
                  <th className="px-3 py-2 font-semibold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sale.items.map((item) => (
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
                    <td className="px-3 py-3">{formatMoney(item.unitPrice)}</td>
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
