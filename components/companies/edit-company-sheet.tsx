"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { CompanyFormFields } from "@/components/companies/company-form-fields";
import { SheetLayout } from "@/components/sheet-layout";
import { FieldError } from "@/components/ui/field";
import {
  addCompanySchema,
  type AddCompanyFormValues,
} from "@/schema/companySchema";
import type { Company } from "@/types/company";

type EditCompanySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
  onSubmit?: (
    id: string,
    values: AddCompanyFormValues
  ) => void | Promise<void>;
};

function getDefaultValues(company: Company | null): AddCompanyFormValues {
  return {
    name: company?.name ?? "",
    slug: company?.slug ?? "",
    email: company?.email ?? "",
    phone: company?.phone ?? "",
    address: company?.address ?? "",
    logo: company?.logo ?? "",
    status: company?.status ?? "active",
  };
}

export function EditCompanySheet({
  open,
  onOpenChange,
  company,
  onSubmit,
}: EditCompanySheetProps) {
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCompanyFormValues>({
    resolver: zodResolver(addCompanySchema),
    defaultValues: getDefaultValues(company),
  });

  useEffect(() => {
    if (open && company) {
      reset(getDefaultValues(company));
      setSubmitError("");
    }
  }, [open, company, reset]);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(getDefaultValues(company));
      setSubmitError("");
    }
    onOpenChange(nextOpen);
  };

  const submitForm = handleSubmit(async (values) => {
    if (!company) return;
    setSubmitError("");
    try {
      await onSubmit?.(company.id, values);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to update company. Please try again."
      );
    }
  });

  if (!company) return null;

  return (
    <SheetLayout
      open={open}
      onOpenChange={handleClose}
      badge="Platform"
      title="Edit Company"
      description={`Update details for ${company.name}.`}
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
        <CompanyFormFields
          register={register}
          control={control}
          errors={errors}
        />
      </form>
    </SheetLayout>
  );
}
