"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import {
  PurchaseFormFields,
  type PurchaseProductOption,
} from "@/components/purchases/purchase-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import { FieldError } from "@/components/ui/field";
import {
  createPurchaseSchema,
  type CreatePurchaseFormValues,
} from "@/schema/purchaseSchema";

type CreatePurchaseSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productOptions: PurchaseProductOption[];
  supplierOptions: { label: string; value: string }[];
  onSubmit?: (values: CreatePurchaseFormValues) => void | Promise<void>;
};

const defaultValues: CreatePurchaseFormValues = {
  supplier_id: "",
  notes: "",
  items: [{ product_id: "", quantity: 1, unit_cost: 0 }],
};

export function CreatePurchaseSheet({
  open,
  onOpenChange,
  productOptions,
  supplierOptions,
  onSubmit,
}: CreatePurchaseSheetProps) {
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePurchaseFormValues>({
    resolver: zodResolver(createPurchaseSchema),
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
          : "Unable to create purchase. Please try again."
      );
    }
  });

  return (
    <SheetLayout
      open={open}
      onOpenChange={handleClose}
      badge="Purchases"
      title="Create Purchase"
      description="Record a purchase. Stock will be increased automatically."
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
              "Create Purchase"
            )}
          </UiButton>
        </>
      }
    >
      <form className="space-y-6" onSubmit={submitForm}>
        {submitError ? <FieldError>{submitError}</FieldError> : null}
        <PurchaseFormFields
          register={register}
          control={control}
          errors={errors}
          watch={watch}
          setValue={setValue}
          productOptions={productOptions}
          supplierOptions={supplierOptions}
        />
      </form>
    </SheetLayout>
  );
}
