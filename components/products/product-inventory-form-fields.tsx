"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import {
  SheetFormField,
  sheetInputClassName,
} from "@/components/sheet-layout";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AddProductFormValues } from "@/schema/productSchema";

type ProductInventoryFormFieldsProps = {
  register: UseFormRegister<AddProductFormValues>;
  errors: FieldErrors<AddProductFormValues>;
};

export function ProductInventoryFormFields({
  register,
  errors,
}: ProductInventoryFormFieldsProps) {
  return (
    <FieldSet className="gap-5">
      <FieldLegend variant="label">Initial Inventory</FieldLegend>
      <FieldGroup className="gap-5">
        <div className="grid gap-5 sm:grid-cols-3">
          <SheetFormField
            label="Quantity"
            htmlFor="quantity"
            required
            error={errors.quantity?.message}
          >
            <Input
              id="quantity"
              type="number"
              min="0"
              placeholder="0"
              aria-invalid={!!errors.quantity}
              className={sheetInputClassName}
              {...register("quantity", { valueAsNumber: true })}
            />
          </SheetFormField>

          <SheetFormField
            label="Minimum Stock"
            htmlFor="minimum_stock"
            required
            error={errors.minimum_stock?.message}
          >
            <Input
              id="minimum_stock"
              type="number"
              min="0"
              placeholder="0"
              aria-invalid={!!errors.minimum_stock}
              className={sheetInputClassName}
              {...register("minimum_stock", { valueAsNumber: true })}
            />
          </SheetFormField>

          <SheetFormField
            label="Maximum Stock"
            htmlFor="maximum_stock"
            required
            error={errors.maximum_stock?.message}
          >
            <Input
              id="maximum_stock"
              type="number"
              min="0"
              placeholder="100"
              aria-invalid={!!errors.maximum_stock}
              className={sheetInputClassName}
              {...register("maximum_stock", { valueAsNumber: true })}
            />
          </SheetFormField>
        </div>

        <SheetFormField
          label="Warehouse Location"
          htmlFor="warehouse_location"
          error={errors.warehouse_location?.message}
          hint="Optional shelf or bin location"
        >
          <Input
            id="warehouse_location"
            placeholder="e.g. Shelf A1"
            className={sheetInputClassName}
            {...register("warehouse_location")}
          />
        </SheetFormField>
      </FieldGroup>
    </FieldSet>
  );
}
