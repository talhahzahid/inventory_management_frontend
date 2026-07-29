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
import type { AddStaffFormValues } from "@/schema/staffSchema";
import { staffRoleOptions, staffStatusLabels } from "@/types/team";
import type { StaffStatus } from "@/types/team";

const roleOptions = staffRoleOptions.map((role) => ({
  label: role.label,
  value: String(role.id),
}));

const statusOptions = (
  Object.entries(staffStatusLabels) as [StaffStatus, string][]
)
  .filter(([value]) => value !== "invited")
  .map(([value, label]) => ({ label, value }));

type StaffFormFieldsProps = {
  register: UseFormRegister<AddStaffFormValues>;
  control: Control<AddStaffFormValues>;
  errors: FieldErrors<AddStaffFormValues>;
};

export function StaffFormFields({
  register,
  control,
  errors,
}: StaffFormFieldsProps) {
  return (
    <>
      <FieldSet className="gap-5">
        <FieldLegend variant="label">Staff Details</FieldLegend>
        <FieldGroup className="gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Full Name"
              htmlFor="name"
              required
              error={errors.name?.message}
            >
              <Input
                id="name"
                placeholder="e.g. John Doe"
                aria-invalid={!!errors.name}
                className={sheetInputClassName}
                {...register("name")}
              />
            </SheetFormField>

            <SheetFormField
              label="Email"
              htmlFor="email"
              required
              error={errors.email?.message}
              hint="Staff will use this email to login"
            >
              <Input
                id="email"
                type="email"
                placeholder="e.g. john.doe@mailinator.com"
                aria-invalid={!!errors.email}
                className={sheetInputClassName}
                {...register("email")}
              />
            </SheetFormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Password"
              htmlFor="password"
              required
              error={errors.password?.message}
              hint="Minimum 6 characters"
            >
              <Input
                id="password"
                type="password"
                placeholder="e.g. John@123"
                aria-invalid={!!errors.password}
                className={sheetInputClassName}
                {...register("password")}
              />
            </SheetFormField>

            <SheetFormField
              label="Role"
              htmlFor="role_id"
              required
              error={errors.role_id?.message}
            >
              <Controller
                name="role_id"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    className={sheetSelectClassName}
                    id="role_id"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select role"
                    options={roleOptions}
                  />
                )}
              />
            </SheetFormField>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="gap-5">
        <FieldLegend variant="label">Access</FieldLegend>
        <FieldGroup className="gap-5">
          <SheetFormField
            label="Account Status"
            htmlFor="status"
            required
            error={errors.status?.message}
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect
                  className={sheetSelectClassName}
                  id="status"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select status"
                  options={statusOptions}
                />
              )}
            />
          </SheetFormField>
        </FieldGroup>
      </FieldSet>
    </>
  );
}
