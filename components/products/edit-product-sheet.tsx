"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { ProductFormFields } from "@/components/products/product-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import { FieldError } from "@/components/ui/field";
import {
  editProductSchema,
  type EditProductFormValues,
} from "@/schema/productSchema";
import type { Product } from "@/types/product";

type SelectOption = {
  label: string;
  value: string;
};

type EditProductSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categoryOptions: SelectOption[];
  supplierOptions: SelectOption[];
  onSubmit?: (
    id: string,
    values: EditProductFormValues
  ) => void | Promise<void>;
};

function getDefaultValues(product: Product | null): EditProductFormValues {
  return {
    category_id: product?.categoryId ?? "",
    supplier_id: product?.supplierId ?? "",
    sku: product?.sku ?? "",
    name: product?.name ?? "",
    description: product?.description ?? "",
    purchase_price: product?.purchasePrice ?? 0,
    selling_price: product?.sellingPrice ?? 0,
    status: product?.status ?? "active",
  };
}

export function EditProductSheet({
  open,
  onOpenChange,
  product,
  categoryOptions,
  supplierOptions,
  onSubmit,
}: EditProductSheetProps) {
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: getDefaultValues(product),
  });

  useEffect(() => {
    if (open && product) {
      reset(getDefaultValues(product));
      setSubmitError("");
    }
  }, [open, product, reset]);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(getDefaultValues(product));
      setSubmitError("");
    }
    onOpenChange(nextOpen);
  };

  const submitForm = handleSubmit(async (values) => {
    if (!product) return;

    setSubmitError("");

    try {
      await onSubmit?.(product.id, values);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to update product. Please try again."
      );
    }
  });

  if (!product) return null;

  return (
    <SheetLayout
      open={open}
      onOpenChange={handleClose}
      badge="Inventory"
      title="Edit Product"
      description={`Update details for ${product.name}.`}
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
              <>
                <Save className="size-4" />
                Save Changes
              </>
            )}
          </UiButton>
        </>
      }
    >
      <form className="space-y-6" onSubmit={submitForm}>
        {submitError ? <FieldError>{submitError}</FieldError> : null}
        <ProductFormFields
          register={register}
          control={control}
          errors={errors}
          categoryOptions={categoryOptions}
          supplierOptions={supplierOptions}
        />
      </form>
    </SheetLayout>
  );
}
