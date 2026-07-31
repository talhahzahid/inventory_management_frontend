"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { ProductFormFields } from "@/components/products/product-form-fields";
import { ProductInventoryFormFields } from "@/components/products/product-inventory-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import {
  addProductSchema,
  type AddProductFormValues,
  type EditProductFormValues,
} from "@/schema/productSchema";

type SelectOption = {
  label: string;
  value: string;
};

type AddProductSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryOptions: SelectOption[];
  supplierOptions: SelectOption[];
  onSubmit?: (values: AddProductFormValues) => void | Promise<void>;
};

const defaultValues: AddProductFormValues = {
  name: "",
  sku: "",
  category_id: "",
  supplier_id: "",
  purchase_price: 0,
  selling_price: 0,
  status: "active",
  quantity: 0,
  minimum_stock: 0,
  maximum_stock: 100,
  description: "",
  warehouse_location: "",
};

export function AddProductSheet({
  open,
  onOpenChange,
  categoryOptions,
  supplierOptions,
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
    try {
      await onSubmit?.(values);
      reset(defaultValues);
      onOpenChange(false);
    } catch (error) {
      throw error;
    }
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
        <ProductFormFields
          register={
            register as unknown as UseFormRegister<EditProductFormValues>
          }
          control={control as unknown as Control<EditProductFormValues>}
          errors={errors as FieldErrors<EditProductFormValues>}
          categoryOptions={categoryOptions}
          supplierOptions={supplierOptions}
        />
        <ProductInventoryFormFields register={register} errors={errors} />
      </form>
    </SheetLayout>
  );
}
