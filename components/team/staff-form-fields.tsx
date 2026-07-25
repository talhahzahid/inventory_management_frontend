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
import { staffDepartments } from "@/types/team";

const departmentOptions = staffDepartments
  .filter((item) => item !== "All Departments")
  .map((department) => ({ label: department, value: department }));

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Send Invite", value: "invited" },
];

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
                placeholder="e.g. Sara Ahmed"
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
                placeholder="e.g. sara@company.com"
                aria-invalid={!!errors.email}
                className={sheetInputClassName}
                {...register("email")}
              />
            </SheetFormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Phone"
              htmlFor="phone"
              error={errors.phone?.message}
              hint="Optional contact number"
            >
              <Input
                id="phone"
                placeholder="e.g. +92 300 1234567"
                aria-invalid={!!errors.phone}
                className={sheetInputClassName}
                {...register("phone")}
              />
            </SheetFormField>

            <SheetFormField
              label="Department"
              htmlFor="department"
              required
              error={errors.department?.message}
            >
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    className={sheetSelectClassName}
                    id="department"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select department"
                    options={departmentOptions}
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
          <div className="grid gap-5 sm:grid-cols-2">
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

            <SheetFormField
              label="Temporary Password"
              htmlFor="password"
              error={errors.password?.message}
              hint="Optional — staff can reset on first login"
            >
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                aria-invalid={!!errors.password}
                className={sheetInputClassName}
                {...register("password")}
              />
            </SheetFormField>
          </div>
        </FieldGroup>
      </FieldSet>
    </>
  );
}
