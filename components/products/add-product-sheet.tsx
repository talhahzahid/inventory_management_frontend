"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { SheetFormField, SheetLayout } from "@/components/sheet-layout";
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addProductSchema,
  type AddProductFormValues,
} from "@/schema/productSchema";
import { productCategories, productStatusLabels } from "@/types/product";
import type { ProductStatus } from "@/types/product";

type AddProductSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: AddProductFormValues) => void | Promise<void>;
};

const defaultValues: AddProductFormValues = {
  name: "",
  sku: "",
  category: "",
  supplier: "",
  price: 0,
  stock: 0,
  status: "draft",
  description: "",
};

const categoryOptions = productCategories
  .filter((item) => item !== "All Categories")
  .map((category) => ({ label: category, value: category }));

const statusOptions = (
  Object.entries(productStatusLabels) as [ProductStatus, string][]
).map(([value, label]) => ({ label, value }));

export function AddProductSheet({
  open,
  onOpenChange,
  onSubmit,
}: AddProductSheetProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues,
  });

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(defaultValues);
    }
    onOpenChange(nextOpen);
  };

  const submitForm = handleSubmit(async (values) => {
    await onSubmit?.(values);
    reset(defaultValues);
    onOpenChange(false);
  });

  return (
    <SheetLayout
      open={open}
      onOpenChange={handleClose}
      badge="New Item"
      title="Add Product"
      description="Create a new product in your inventory catalog."
      size="2xl"
      footer={
        <>
          <UiButton
            type="button"
            variant="outline"
            buttonText="Cancel"
            onClick={() => handleClose(false)}
            disabled={isSubmitting}
          />
          <UiButton
            type="button"
            variant="primary"
            disabled={isSubmitting}
            onClick={submitForm}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Product"
            )}
          </UiButton>
        </>
      }
    >
      <form className="space-y-6" onSubmit={submitForm}>
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
                  placeholder="e.g. Wireless Mouse"
                  aria-invalid={!!errors.name}
                  className="h-10"
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
                  placeholder="e.g. SKU-1001"
                  aria-invalid={!!errors.sku}
                  className="h-10"
                  {...register("sku")}
                />
              </SheetFormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <SheetFormField
                label="Category"
                htmlFor="category"
                required
                error={errors.category?.message}
              >
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      id="category"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select category"
                      options={categoryOptions}
                    />
                  )}
                />
              </SheetFormField>

              <SheetFormField
                label="Supplier"
                htmlFor="supplier"
                required
                error={errors.supplier?.message}
              >
                <Input
                  id="supplier"
                  placeholder="e.g. TechParts Ltd"
                  aria-invalid={!!errors.supplier}
                  className="h-10"
                  {...register("supplier")}
                />
              </SheetFormField>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="gap-5">
          <FieldLegend variant="label">Pricing & Stock</FieldLegend>
          <FieldGroup className="gap-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <SheetFormField
                label="Price"
                htmlFor="price"
                required
                error={errors.price?.message}
              >
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  aria-invalid={!!errors.price}
                  className="h-10"
                  {...register("price", { valueAsNumber: true })}
                />
              </SheetFormField>

              <SheetFormField
                label="Stock"
                htmlFor="stock"
                required
                error={errors.stock?.message}
              >
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  aria-invalid={!!errors.stock}
                  className="h-10"
                  {...register("stock", { valueAsNumber: true })}
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
              className="min-h-28"
              {...register("description")}
            />
          </SheetFormField>
        </FieldSet>
      </form>
    </SheetLayout>
  );
}
