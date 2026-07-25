"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { PlatformRoleFormFields } from "@/components/roles/platform-role-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import {
  addPlatformRoleSchema,
  type AddPlatformRoleFormValues,
} from "@/schema/platformRoleSchema";

type AddPlatformRoleSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: AddPlatformRoleFormValues) => void | Promise<void>;
};

const defaultValues: AddPlatformRoleFormValues = {
  name: "",
  slug: "",
  description: "",
  scope: "platform",
  status: "active",
};

export function AddPlatformRoleSheet({
  open,
  onOpenChange,
  onSubmit,
}: AddPlatformRoleSheetProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddPlatformRoleFormValues>({
    resolver: zodResolver(addPlatformRoleSchema),
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
      badge="Access Control"
      title="Add Role"
      description="Create a new platform or company role with defined access scope."
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
              "Add Role"
            )}
          </UiButton>
        </>
      }
    >
      <form className="space-y-6" onSubmit={submitForm}>
        <PlatformRoleFormFields
          register={register}
          control={control}
          errors={errors}
        />
      </form>
    </SheetLayout>
  );
}
