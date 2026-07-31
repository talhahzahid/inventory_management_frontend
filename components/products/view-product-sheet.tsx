"use client";

import {
  Building2,
  CalendarDays,
  DollarSign,
  FileText,
  Hash,
  Layers,
  MapPin,
  Package,
  Pencil,
  Tag,
  Truck,
} from "lucide-react";

import { UiButton } from "@/components/Button";
import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { StockLevelBadge } from "@/components/products/stock-level-badge";
import { SheetLayout } from "@/components/sheet-layout";
import {
  formatProductPrice,
  getProductStockLevel,
  type Product,
} from "@/types/product";

type ViewProductSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEdit?: () => void;
  readOnly?: boolean;
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

export function ViewProductSheet({
  open,
  onOpenChange,
  product,
  onEdit,
  readOnly = false,
}: ViewProductSheetProps) {
  if (!product) return null;

  const stockLevel = getProductStockLevel(product);

  return (
    <SheetLayout
      open={open}
      onOpenChange={onOpenChange}
      badge="Inventory"
      title={product.name}
      description="View product details, pricing, and stock information."
      size="2xl"
      footer={
        <>
          <UiButton
            type="button"
            variant="outline"
            buttonText="Close"
            onClick={() => onOpenChange(false)}
          />
          {!readOnly ? (
            <UiButton
              type="button"
              variant="primary"
              icon={Pencil}
              buttonText="Edit Product"
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
              <p className="text-lg font-bold text-slate-900">{product.name}</p>
              <p className="text-sm text-muted-foreground">{product.sku}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ProductStatusBadge status={product.status} />
            <StockLevelBadge level={stockLevel} />
          </div>
        </div>

        <DetailItem
          icon={FileText}
          label="Description"
          value={product.description || "No description provided."}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailItem
            icon={Tag}
            label="Category"
            value={product.categoryName ?? "—"}
          />
          <DetailItem
            icon={Truck}
            label="Supplier"
            value={
              <div>
                <p>{product.supplierName ?? "—"}</p>
                {product.supplierEmail ? (
                  <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                    {product.supplierEmail}
                  </p>
                ) : null}
              </div>
            }
          />
          <DetailItem
            icon={DollarSign}
            label="Purchase Price"
            value={formatProductPrice(product.purchasePrice)}
          />
          <DetailItem
            icon={DollarSign}
            label="Selling Price"
            value={formatProductPrice(product.sellingPrice)}
          />
          <DetailItem icon={Hash} label="Product ID" value={`#${product.id}`} />
          <DetailItem
            icon={Building2}
            label="Company"
            value={
              <div>
                <p>{product.companyName ?? "—"}</p>
                {product.companyEmail ? (
                  <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                    {product.companyEmail}
                  </p>
                ) : null}
              </div>
            }
          />
          <DetailItem
            icon={CalendarDays}
            label="Created"
            value={product.createdAt}
          />
          <DetailItem
            icon={CalendarDays}
            label="Last Updated"
            value={product.updatedAt}
          />
        </div>

        {product.inventory ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Inventory Details
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                icon={Layers}
                label="Quantity"
                value={product.inventory.quantity}
              />
              <DetailItem
                icon={Layers}
                label="Min / Max Stock"
                value={`${product.inventory.minimumStock} / ${product.inventory.maximumStock}`}
              />
              <DetailItem
                icon={MapPin}
                label="Warehouse Location"
                value={product.inventory.warehouseLocation ?? "—"}
              />
            </div>
          </div>
        ) : null}
      </div>
    </SheetLayout>
  );
}
