"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { CompanyFormFields } from "@/components/companies/company-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import {
  addCompanySchema,
  type AddCompanyFormValues,
} from "@/schema/companySchema";

type AddCompanySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: AddCompanyFormValues) => void | Promise<void>;
};

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const defaultValues: AddCompanyFormValues = {
  name: "",
  slug: "",
  email: "",
  phone: "",
  address: "",
  logo: "",
  status: "active",
};

export function AddCompanySheet({
  open,
  onOpenChange,
  onSubmit,
}: AddCompanySheetProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddCompanyFormValues>({
    resolver: zodResolver(addCompanySchema),
    defaultValues,
  });

  const name = watch("name");

  useEffect(() => {
    if (!open) return;
    setValue("slug", slugify(name), { shouldValidate: false });
  }, [name, open, setValue]);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset(defaultValues);
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
      badge="Platform"
      title="Add Company"
      description="Register a new company. An admin login will be emailed automatically."
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
              "Add Company"
            )}
          </UiButton>
        </>
      }
    >
      <form className="space-y-6" onSubmit={submitForm}>
        <CompanyFormFields
          register={register}
          control={control}
          errors={errors}
        />
      </form>
    </SheetLayout>
  );
}
