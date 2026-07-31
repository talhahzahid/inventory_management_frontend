"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { InventoryFormFields } from "@/components/inventory/inventory-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import { FieldError } from "@/components/ui/field";
import {
  editInventorySchema,
  type EditInventoryFormValues,
} from "@/schema/inventorySchema";
import type { InventoryItem } from "@/types/inventory";

type EditInventorySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onSubmit?: (
    id: string,
    values: EditInventoryFormValues
  ) => void | Promise<void>;
};

function getDefaultValues(item: InventoryItem | null): EditInventoryFormValues {
  return {
    quantity: item?.quantity ?? 0,
    minimum_stock: item?.minimumStock ?? 0,
    maximum_stock: item?.maximumStock ?? 100,
    warehouse_location: item?.warehouseLocation ?? "",
  };
}

export function EditInventorySheet({
  open,
  onOpenChange,
  item,
  onSubmit,
}: EditInventorySheetProps) {
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditInventoryFormValues>({
    resolver: zodResolver(editInventorySchema),
    defaultValues: getDefaultValues(item),
  });

  useEffect(() => {
    if (open && item) {
      reset(getDefaultValues(item));
      setSubmitError("");
    }
  }, [open, item, reset]);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(getDefaultValues(item));
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
          : "Unable to update inventory. Please try again."
      );
    }
  });

  if (!item) return null;

  return (
    <SheetLayout
      open={open}
      onOpenChange={handleClose}
      badge="Inventory"
      title="Edit Stock"
      description={`Update stock levels for ${item.productName ?? "this item"}.`}
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
        <InventoryFormFields register={register} errors={errors} />
      </form>
    </SheetLayout>
  );
}
