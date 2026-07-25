"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { CategoryFormFields } from "@/components/categories/category-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import {
  addCategorySchema,
  type AddCategoryFormValues,
} from "@/schema/categorySchema";

type AddCategorySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: AddCategoryFormValues) => void | Promise<void>;
};

const defaultValues: AddCategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  status: "active",
};

export function AddCategorySheet({
  open,
  onOpenChange,
  onSubmit,
}: AddCategorySheetProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCategoryFormValues>({
    resolver: zodResolver(addCategorySchema),
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
      badge="Inventory"
      title="Add Category"
      description="Create a new product category for your inventory catalog."
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
              "Add Category"
            )}
          </UiButton>
        </>
      }
    >
      <form className="space-y-6" onSubmit={submitForm}>
        <CategoryFormFields
          register={register}
          control={control}
          errors={errors}
        />
      </form>
    </SheetLayout>
  );
}
