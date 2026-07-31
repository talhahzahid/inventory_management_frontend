"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  SheetFormField,
  sheetSelectClassName,
  sheetTextareaClassName,
} from "@/components/sheet-layout";
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { FormSelect } from "@/components/ui/form-select";
import { Textarea } from "@/components/ui/textarea";
import type { AddPlatformRoleFormValues } from "@/schema/platformRoleSchema";
import { platformRoleNameOptions } from "@/types/platform-role";

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
    <FieldSet className="gap-5">
      <FieldLegend variant="label">Role Details</FieldLegend>
      <FieldGroup className="gap-5">
        <SheetFormField
          label="Role Name"
          htmlFor="name"
          required
          error={errors.name?.message}
          hint="Must match a system role key"
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormSelect
                id="name"
                value={field.value}
                onChange={field.onChange}
                placeholder="Select role"
                options={platformRoleNameOptions}
                className={sheetSelectClassName}
              />
            )}
          />
        </SheetFormField>

        <SheetFormField
          label="Description"
          htmlFor="description"
          error={errors.description?.message}
        >
          <Textarea
            id="description"
            placeholder="Explain what this role can access..."
            aria-invalid={!!errors.description}
            className={sheetTextareaClassName}
            {...register("description")}
          />
        </SheetFormField>
      </FieldGroup>
    </FieldSet>
  );
}
