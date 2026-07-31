"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import {
  SheetFormField,
  sheetInputClassName,
} from "@/components/sheet-layout";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { EditInventoryFormValues } from "@/schema/inventorySchema";

type InventoryFormFieldsProps = {
  register: UseFormRegister<EditInventoryFormValues>;
  errors: FieldErrors<EditInventoryFormValues>;
};

export function InventoryFormFields({
  register,
  errors,
}: InventoryFormFieldsProps) {
  return (
    <FieldSet className="gap-5">
      <FieldLegend variant="label">Stock Levels</FieldLegend>
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
          hint="Shelf, bin, or storage area"
        >
          <Input
            id="warehouse_location"
            placeholder="e.g. Shelf A1"
            aria-invalid={!!errors.warehouse_location}
            className={sheetInputClassName}
            {...register("warehouse_location")}
          />
        </SheetFormField>
      </FieldGroup>
    </FieldSet>
  );
}
