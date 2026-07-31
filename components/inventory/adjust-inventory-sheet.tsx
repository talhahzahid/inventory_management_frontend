"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { AdjustInventoryFormFields } from "@/components/inventory/adjust-inventory-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import { FieldError } from "@/components/ui/field";
import {
  adjustInventorySchema,
  type AdjustInventoryFormValues,
} from "@/schema/inventorySchema";
import type { InventoryItem } from "@/types/inventory";

type AdjustInventorySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onSubmit?: (
    id: string,
    values: AdjustInventoryFormValues
  ) => void | Promise<void>;
};

const defaultValues: AdjustInventoryFormValues = {
  adjustment: 0,
};

export function AdjustInventorySheet({
  open,
  onOpenChange,
  item,
  onSubmit,
}: AdjustInventorySheetProps) {
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdjustInventoryFormValues>({
    resolver: zodResolver(adjustInventorySchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setSubmitError("");
    }
  }, [open, reset]);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(defaultValues);
      setSubmitError("");
    }
    onOpenChange(nextOpen);
  };

  const submitForm = handleSubmit(async (values) => {
    if (!item) return;

    setSubmitError("");

    try {
      await onSubmit?.(item.id, values);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to adjust inventory. Please try again."
      );
    }
  });

  if (!item) return null;

  return (
    <SheetLayout
      open={open}
      onOpenChange={handleClose}
      badge="Inventory"
      title="Adjust Stock"
      description={`Add or remove units for ${item.productName ?? "this item"}.`}
      size="lg"
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
                Applying...
              </>
            ) : (
              <>
                <SlidersHorizontal className="size-4" />
                Apply Adjustment
              </>
            )}
          </UiButton>
        </>
      }
    >
      <form className="space-y-6" onSubmit={submitForm}>
        {submitError ? <FieldError>{submitError}</FieldError> : null}
        <AdjustInventoryFormFields
          item={item}
          register={register}
          errors={errors}
        />
      </form>
    </SheetLayout>
  );
}
