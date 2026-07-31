"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import {
  SaleFormFields,
  type SaleProductOption,
} from "@/components/sales/sale-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import { FieldError } from "@/components/ui/field";
import {
  createSaleSchema,
  type CreateSaleFormValues,
} from "@/schema/saleSchema";
import { useState } from "react";

type CreateSaleSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productOptions: SaleProductOption[];
  onSubmit?: (values: CreateSaleFormValues) => void | Promise<void>;
};

const defaultValues: CreateSaleFormValues = {
  customer_name: "",
  notes: "",
  items: [{ product_id: "", quantity: 1, unit_price: 0 }],
};

export function CreateSaleSheet({
  open,
  onOpenChange,
  productOptions,
  onSubmit,
}: CreateSaleSheetProps) {
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateSaleFormValues>({
    resolver: zodResolver(createSaleSchema),
    defaultValues,
  });

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(defaultValues);
      setSubmitError("");
    }
    onOpenChange(nextOpen);
  };

  const submitForm = handleSubmit(async (values) => {
    setSubmitError("");
    try {
      await onSubmit?.(values);
      reset(defaultValues);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to create sale. Please try again."
      );
    }
  });

  return (
    <SheetLayout
      open={open}
      onOpenChange={handleClose}
      badge="Sales"
      title="Create Sale"
      description="Record a sale. Stock will be deducted automatically."
      size="3xl"
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
              "Create Sale"
            )}
          </UiButton>
        </>
      }
    >
      <form className="space-y-6" onSubmit={submitForm}>
        {submitError ? <FieldError>{submitError}</FieldError> : null}
        <SaleFormFields
          register={register}
          control={control}
          errors={errors}
          watch={watch}
          setValue={setValue}
          productOptions={productOptions}
        />
      </form>
    </SheetLayout>
  );
}
