"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  SheetFormField,
  sheetInputClassName,
  sheetSelectClassName,
  sheetTextareaClassName,
} from "@/components/sheet-layout";
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EditProductFormValues } from "@/schema/productSchema";
import { productStatusLabels } from "@/types/product";
import type { ProductStatus } from "@/types/product";

type SelectOption = {
  label: string;
  value: string;
};

type ProductFormFieldsProps = {
  register: UseFormRegister<EditProductFormValues>;
  control: Control<EditProductFormValues>;
  errors: FieldErrors<EditProductFormValues>;
  categoryOptions: SelectOption[];
  supplierOptions: SelectOption[];
};

const statusOptions = (
  Object.entries(productStatusLabels) as [ProductStatus, string][]
).map(([value, label]) => ({ label, value }));

export function ProductFormFields({
  register,
  control,
  errors,
  categoryOptions,
  supplierOptions,
}: ProductFormFieldsProps) {
  return (
    <>
      <FieldSet className="gap-5">
        <FieldLegend variant="label">Product Details</FieldLegend>
        <FieldGroup className="gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Product Name"
              htmlFor="name"
              required
              error={errors.name?.message}
            >
              <Input
                id="name"
                placeholder="e.g. Gaming Laptop"
                aria-invalid={!!errors.name}
                className={sheetInputClassName}
                {...register("name")}
              />
            </SheetFormField>

            <SheetFormField
              label="SKU"
              htmlFor="sku"
              required
              error={errors.sku?.message}
              hint="Unique stock keeping unit code"
            >
              <Input
                id="sku"
                placeholder="e.g. SKU-001"
                aria-invalid={!!errors.sku}
                className={sheetInputClassName}
                {...register("sku")}
              />
            </SheetFormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Category"
              htmlFor="category_id"
              required
              error={errors.category_id?.message}
            >
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    id="category_id"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select category"
                    options={categoryOptions}
                    className={sheetSelectClassName}
                  />
                )}
              />
            </SheetFormField>

            <SheetFormField
              label="Supplier"
              htmlFor="supplier_id"
              required
              error={errors.supplier_id?.message}
            >
              <Controller
                name="supplier_id"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    id="supplier_id"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select supplier"
                    options={supplierOptions}
                    className={sheetSelectClassName}
                  />
                )}
              />
            </SheetFormField>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="gap-5">
        <FieldLegend variant="label">Pricing</FieldLegend>
        <FieldGroup className="gap-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <SheetFormField
              label="Purchase Price"
              htmlFor="purchase_price"
              required
              error={errors.purchase_price?.message}
            >
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                aria-invalid={!!errors.purchase_price}
                className={sheetInputClassName}
                {...register("purchase_price", { valueAsNumber: true })}
              />
            </SheetFormField>

            <SheetFormField
              label="Selling Price"
              htmlFor="selling_price"
              required
              error={errors.selling_price?.message}
            >
              <Input
                id="selling_price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                aria-invalid={!!errors.selling_price}
                className={sheetInputClassName}
                {...register("selling_price", { valueAsNumber: true })}
              />
            </SheetFormField>

            <SheetFormField
              label="Status"
              htmlFor="status"
              required
              error={errors.status?.message}
            >
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    id="status"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select status"
                    options={statusOptions}
                    className={sheetSelectClassName}
                  />
                )}
              />
            </SheetFormField>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="gap-5">
        <FieldLegend variant="label">Additional Info</FieldLegend>
        <SheetFormField
          label="Description"
          htmlFor="description"
          error={errors.description?.message}
          hint="Optional notes about this product"
        >
          <Textarea
            id="description"
            placeholder="Add product details, specs, or internal notes..."
            aria-invalid={!!errors.description}
            className={sheetTextareaClassName}
            {...register("description")}
          />
        </SheetFormField>
      </FieldSet>
    </>
  );
}
