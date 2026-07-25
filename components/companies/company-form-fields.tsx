"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  SheetFormField,
  sheetInputClassName,
  sheetSelectClassName,
} from "@/components/sheet-layout";
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import type { AddCompanyFormValues } from "@/schema/companySchema";
import {
  companyPlanLabels,
  companyStatusLabels,
} from "@/types/company";
import type { CompanyPlan, CompanyStatus } from "@/types/company";

const planOptions = (
  Object.entries(companyPlanLabels) as [CompanyPlan, string][]
).map(([value, label]) => ({ label, value }));

const statusOptions = (
  Object.entries(companyStatusLabels) as [CompanyStatus, string][]
).map(([value, label]) => ({ label, value }));

type CompanyFormFieldsProps = {
  register: UseFormRegister<AddCompanyFormValues>;
  control: Control<AddCompanyFormValues>;
  errors: FieldErrors<AddCompanyFormValues>;
};

export function CompanyFormFields({
  register,
  control,
  errors,
}: CompanyFormFieldsProps) {
  return (
    <>
      <FieldSet className="gap-5">
        <FieldLegend variant="label">Company Details</FieldLegend>
        <FieldGroup className="gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Company Name"
              htmlFor="name"
              required
              error={errors.name?.message}
            >
              <Input
                id="name"
                placeholder="e.g. Universal Trading Co."
                aria-invalid={!!errors.name}
                className={sheetInputClassName}
                {...register("name")}
              />
            </SheetFormField>

            <SheetFormField
              label="Company Email"
              htmlFor="email"
              required
              error={errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                placeholder="e.g. info@company.com"
                aria-invalid={!!errors.email}
                className={sheetInputClassName}
                {...register("email")}
              />
            </SheetFormField>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="gap-5">
        <FieldLegend variant="label">Company Admin</FieldLegend>
        <FieldGroup className="gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Admin Name"
              htmlFor="adminName"
              required
              error={errors.adminName?.message}
            >
              <Input
                id="adminName"
                placeholder="e.g. Ahmed Khan"
                aria-invalid={!!errors.adminName}
                className={sheetInputClassName}
                {...register("adminName")}
              />
            </SheetFormField>

            <SheetFormField
              label="Admin Email"
              htmlFor="adminEmail"
              required
              error={errors.adminEmail?.message}
              hint="Primary login email for company admin"
            >
              <Input
                id="adminEmail"
                type="email"
                placeholder="e.g. admin@company.com"
                aria-invalid={!!errors.adminEmail}
                className={sheetInputClassName}
                {...register("adminEmail")}
              />
            </SheetFormField>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="gap-5">
        <FieldLegend variant="label">Subscription</FieldLegend>
        <FieldGroup className="gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Plan"
              htmlFor="plan"
              required
              error={errors.plan?.message}
            >
              <Controller
                name="plan"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    id="plan"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select plan"
                    options={planOptions}
                    className={sheetSelectClassName}
                  />
                )}
              />
            </SheetFormField>

            <SheetFormField
              label="Status"
              htmlFor="status"
              required
              error={errors.status?.message}
            >
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    id="status"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select status"
                    options={statusOptions}
                    className={sheetSelectClassName}
                  />
                )}
              />
            </SheetFormField>
          </div>
        </FieldGroup>
      </FieldSet>
    </>
  );
}
