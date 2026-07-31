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
import { companyStatusLabels } from "@/types/company";
import type { CompanyStatus } from "@/types/company";

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
                placeholder="e.g. ABC Corp"
                aria-invalid={!!errors.name}
                className={sheetInputClassName}
                {...register("name")}
              />
            </SheetFormField>

            <SheetFormField
              label="Slug"
              htmlFor="slug"
              required
              error={errors.slug?.message}
              hint="Unique URL-friendly key"
            >
              <Input
                id="slug"
                placeholder="e.g. abc-corp"
                aria-invalid={!!errors.slug}
                className={sheetInputClassName}
                {...register("slug")}
              />
            </SheetFormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Email"
              htmlFor="email"
              required
              error={errors.email?.message}
              hint="Also used as company admin login"
            >
              <Input
                id="email"
                type="email"
                placeholder="e.g. abc@mail.com"
                aria-invalid={!!errors.email}
                className={sheetInputClassName}
                {...register("email")}
              />
            </SheetFormField>

            <SheetFormField
              label="Phone"
              htmlFor="phone"
              error={errors.phone?.message}
            >
              <Input
                id="phone"
                placeholder="e.g. 03001234567"
                className={sheetInputClassName}
                {...register("phone")}
              />
            </SheetFormField>
          </div>

          <SheetFormField
            label="Address"
            htmlFor="address"
            error={errors.address?.message}
          >
            <Input
              id="address"
              placeholder="e.g. Karachi"
              className={sheetInputClassName}
              {...register("address")}
            />
          </SheetFormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Logo"
              htmlFor="logo"
              error={errors.logo?.message}
              hint="Optional logo filename or URL"
            >
              <Input
                id="logo"
                placeholder="e.g. logo.png"
                className={sheetInputClassName}
                {...register("logo")}
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
