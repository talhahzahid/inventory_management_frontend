"use client";

import {
  Building2,
  CalendarDays,
  Hash,
  Layers,
  MapPin,
  Package,
  Pencil,
  SlidersHorizontal,
} from "lucide-react";

import { UiButton } from "@/components/Button";
import { StockLevelBadge } from "@/components/products/stock-level-badge";
import { SheetLayout } from "@/components/sheet-layout";
import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { formatProductPrice } from "@/types/product";
import {
  formatInventoryQuantity,
  getInventoryStockLevel,
  type InventoryItem,
} from "@/types/inventory";

type ViewInventorySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  readOnly?: boolean;
  adjustOnly?: boolean;
  onEdit?: () => void;
  onAdjust?: () => void;
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

export function ViewInventorySheet({
  open,
  onOpenChange,
  item,
  readOnly = false,
  adjustOnly = false,
  onEdit,
  onAdjust,
}: ViewInventorySheetProps) {
  if (!item) return null;

  const stockLevel = getInventoryStockLevel(item);

  return (
    <SheetLayout
      open={open}
      onOpenChange={onOpenChange}
      badge="Inventory"
      title={item.productName ?? "Stock Item"}
      description="View stock levels, location, and product details."
      size="2xl"
      footer={
        <>
          <UiButton
            type="button"
            variant="outline"
            buttonText="Close"
            onClick={() => onOpenChange(false)}
          />
          {!readOnly && onAdjust ? (
            <UiButton
              type="button"
              variant="outline"
              icon={SlidersHorizontal}
              buttonText="Adjust Stock"
              onClick={onAdjust}
            />
          ) : null}
          {!readOnly && !adjustOnly && onEdit ? (
            <UiButton
              type="button"
              variant="primary"
              icon={Pencil}
              buttonText="Edit Stock"
              onClick={onEdit}
            />
          ) : null}
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50/80 via-white to-violet-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Package className="size-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">
                {item.productName ?? "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.productSku ?? "—"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StockLevelBadge level={stockLevel} />
            {item.productStatus ? (
              <ProductStatusBadge status={item.productStatus} />
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailItem
            icon={Layers}
            label="Quantity"
            value={`${formatInventoryQuantity(item.quantity)} units`}
          />
          <DetailItem
            icon={Layers}
            label="Min / Max Stock"
            value={`${formatInventoryQuantity(item.minimumStock)} / ${formatInventoryQuantity(item.maximumStock)}`}
          />
          <DetailItem
            icon={MapPin}
            label="Warehouse Location"
            value={item.warehouseLocation ?? "—"}
          />
          <DetailItem icon={Hash} label="Inventory ID" value={`#${item.id}`} />
          {item.productPurchasePrice !== undefined ? (
            <DetailItem
              icon={Package}
              label="Purchase Price"
              value={formatProductPrice(item.productPurchasePrice)}
            />
          ) : null}
          {item.productSellingPrice !== undefined ? (
            <DetailItem
              icon={Package}
              label="Selling Price"
              value={formatProductPrice(item.productSellingPrice)}
            />
          ) : null}
          <DetailItem
            icon={Building2}
            label="Company"
            value={
              <div>
                <p>{item.companyName ?? "—"}</p>
                {item.companyEmail ? (
                  <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                    {item.companyEmail}
                  </p>
                ) : null}
              </div>
            }
          />
          <DetailItem
            icon={CalendarDays}
            label="Last Updated"
            value={item.updatedAt}
          />
        </div>
      </div>
    </SheetLayout>
  );
}
