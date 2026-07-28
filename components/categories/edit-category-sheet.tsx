"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { CategoryFormFields } from "@/components/categories/category-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import { FieldError } from "@/components/ui/field";
import {
  addCategorySchema,
  type AddCategoryFormValues,
} from "@/schema/categorySchema";
import type { Category } from "@/types/category";

type EditCategorySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSubmit?: (
    id: string,
    values: AddCategoryFormValues
  ) => void | Promise<void>;
};

function getDefaultValues(category: Category | null): AddCategoryFormValues {
  return {
    name: category?.name ?? "",
    description: category?.description ?? "",
    status: category?.status ?? "active",
  };
}

export function EditCategorySheet({
  open,
  onOpenChange,
  category,
  onSubmit,
}: EditCategorySheetProps) {
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCategoryFormValues>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: getDefaultValues(category),
  });

  useEffect(() => {
    if (open && category) {
      reset(getDefaultValues(category));
      setSubmitError("");
    }
  }, [open, category, reset]);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(getDefaultValues(category));
      setSubmitError("");
    }
    onOpenChange(nextOpen);
  };

  const submitForm = handleSubmit(async (values) => {
    if (!category) return;

    setSubmitError("");

    try {
      await onSubmit?.(category.id, values);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to update category. Please try again."
      );
    }
  });

  if (!category) return null;

  return (
    <SheetLayout
      open={open}
      onOpenChange={handleClose}
      badge="Inventory"
      title="Edit Category"
      description={`Update details for ${category.name}.`}
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
        <CategoryFormFields
          register={register}
          control={control}
          errors={errors}
        />
      </form>
    </SheetLayout>
  );
}
