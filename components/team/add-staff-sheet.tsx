"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api/api";

import { UiButton } from "@/components/Button";
import { StaffFormFields } from "@/components/team/staff-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import { FieldError } from "@/components/ui/field";
import {
  addStaffSchema,
  type AddStaffFormValues,
} from "@/schema/staffSchema";

type AddStaffSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: AddStaffFormValues) => void | Promise<void>;
};

const defaultValues: AddStaffFormValues = {
  name: "",
  email: "",
  password: "",
  role_id: "",
  status: "active",
};

export function AddStaffSheet({
  open,
  onOpenChange,
  onSubmit,
}: AddStaffSheetProps) {
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddStaffFormValues>({
    resolver: zodResolver(addStaffSchema),
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
      const message = getErrorMessage(
        error,
        "Unable to add staff member. Please try again."
      );
      setSubmitError(message);
      toast.error("Failed to add staff member", {
        description: message,
      });
    }
  });

  return (
    <SheetLayout
      open={open}
      onOpenChange={handleClose}
      badge="Team Member"
      title="Add Staff"
      description="Add a staff member to your company workspace."
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
              "Add Staff"
            )}
          </UiButton>
        </>
      }
    >
      <form className="space-y-6" onSubmit={submitForm}>
        {submitError ? <FieldError>{submitError}</FieldError> : null}
        <StaffFormFields
          register={register}
          control={control}
          errors={errors}
        />
      </form>
    </SheetLayout>
  );
}
