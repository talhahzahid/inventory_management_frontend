"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { SupplierFormFields } from "@/components/suppliers/supplier-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import { FieldError } from "@/components/ui/field";
import {
  addSupplierSchema,
  type AddSupplierFormValues,
} from "@/schema/supplierSchema";

type AddSupplierSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: AddSupplierFormValues) => void | Promise<void>;
};

const defaultValues: AddSupplierFormValues = {
  name: "",
  phone: "",
  email: "",
  address: "",
  status: "active",
};

export function AddSupplierSheet({
  open,
  onOpenChange,
  onSubmit,
}: AddSupplierSheetProps) {
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddSupplierFormValues>({
    resolver: zodResolver(addSupplierSchema),
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
          : "Unable to create supplier. Please try again."
      );
    }
  });

  return (
    <SheetLayout
      open={open}
      onOpenChange={handleClose}
      badge="Operations"
      title="Add Supplier"
      description="Add a new supplier to manage purchase orders and inventory sourcing."
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
              "Add Supplier"
            )}
          </UiButton>
        </>
      }
    >
      <form className="space-y-6" onSubmit={submitForm}>
        {submitError ? <FieldError>{submitError}</FieldError> : null}
        <SupplierFormFields
          register={register}
          control={control}
          errors={errors}
        />
      </form>
    </SheetLayout>
  );
}
