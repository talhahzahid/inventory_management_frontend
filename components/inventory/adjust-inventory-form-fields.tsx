"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import {
  SheetFormField,
  sheetInputClassName,
} from "@/components/sheet-layout";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AdjustInventoryFormValues } from "@/schema/inventorySchema";
import type { InventoryItem } from "@/types/inventory";
import { formatInventoryQuantity } from "@/types/inventory";

type AdjustInventoryFormFieldsProps = {
  item: InventoryItem;
  register: UseFormRegister<AdjustInventoryFormValues>;
  errors: FieldErrors<AdjustInventoryFormValues>;
};

export function AdjustInventoryFormFields({
  item,
  register,
  errors,
}: AdjustInventoryFormFieldsProps) {
  return (
    <FieldSet className="gap-5">
      <FieldLegend variant="label">Stock Adjustment</FieldLegend>
      <FieldGroup className="gap-5">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Current Quantity
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatInventoryQuantity(item.quantity)} units
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {item.productName} ({item.productSku})
          </p>
        </div>

        <SheetFormField
          label="Adjustment"
          htmlFor="adjustment"
          required
          error={errors.adjustment?.message}
          hint="Use positive numbers to add stock, negative to remove"
        >
          <Input
            id="adjustment"
            type="number"
            placeholder="e.g. 10 or -5"
            aria-invalid={!!errors.adjustment}
            className={sheetInputClassName}
            {...register("adjustment", { valueAsNumber: true })}
          />
        </SheetFormField>
      </FieldGroup>
    </FieldSet>
  );
}
