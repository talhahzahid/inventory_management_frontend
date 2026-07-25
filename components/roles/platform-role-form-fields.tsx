"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  SheetFormField,
  sheetInputClassName,
  sheetSelectClassName,
  sheetTextareaClassName,
} from "@/components/sheet-layout";
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AddPlatformRoleFormValues } from "@/schema/platformRoleSchema";
import {
  platformRoleScopeLabels,
  platformRoleStatusLabels,
} from "@/types/platform-role";
import type {
  PlatformRoleScope,
  PlatformRoleStatus,
} from "@/types/platform-role";

const scopeOptions = (
  Object.entries(platformRoleScopeLabels) as [PlatformRoleScope, string][]
).map(([value, label]) => ({ label, value }));

const statusOptions = (
  Object.entries(platformRoleStatusLabels) as [PlatformRoleStatus, string][]
).map(([value, label]) => ({ label, value }));

type PlatformRoleFormFieldsProps = {
  register: UseFormRegister<AddPlatformRoleFormValues>;
  control: Control<AddPlatformRoleFormValues>;
  errors: FieldErrors<AddPlatformRoleFormValues>;
};

export function PlatformRoleFormFields({
  register,
  control,
  errors,
}: PlatformRoleFormFieldsProps) {
  return (
    <>
      <FieldSet className="gap-5">
        <FieldLegend variant="label">Role Details</FieldLegend>
        <FieldGroup className="gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Role Name"
              htmlFor="name"
              required
              error={errors.name?.message}
            >
              <Input
                id="name"
                placeholder="e.g. Platform Support"
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
              hint="Unique key for this role"
            >
              <Input
                id="slug"
                placeholder="e.g. platform-support"
                aria-invalid={!!errors.slug}
                className={sheetInputClassName}
                {...register("slug")}
              />
            </SheetFormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Scope"
              htmlFor="scope"
              required
              error={errors.scope?.message}
              hint="Platform or company level role"
            >
              <Controller
                name="scope"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    id="scope"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select scope"
                    options={scopeOptions}
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

          <SheetFormField
            label="Description"
            htmlFor="description"
            error={errors.description?.message}
            hint="Explain what this role can access"
          >
            <Textarea
              id="description"
              placeholder="Describe permissions and responsibilities..."
              aria-invalid={!!errors.description}
              className={sheetTextareaClassName}
              {...register("description")}
            />
          </SheetFormField>
        </FieldGroup>
      </FieldSet>
    </>
  );
}
