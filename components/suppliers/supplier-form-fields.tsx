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
import type { AddSupplierFormValues } from "@/schema/supplierSchema";
import type { SupplierStatus } from "@/types/supplier";
import { supplierStatusLabels } from "@/types/supplier";

const statusOptions = (
  Object.entries(supplierStatusLabels) as [SupplierStatus, string][]
).map(([value, label]) => ({ label, value }));

type SupplierFormFieldsProps = {
  register: UseFormRegister<AddSupplierFormValues>;
  control: Control<AddSupplierFormValues>;
  errors: FieldErrors<AddSupplierFormValues>;
};

export function SupplierFormFields({
  register,
  control,
  errors,
}: SupplierFormFieldsProps) {
  return (
    <FieldSet className="gap-5">
      <FieldLegend variant="label">Supplier Details</FieldLegend>
      <FieldGroup className="gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <SheetFormField
            label="Supplier Name"
            htmlFor="name"
            required
            error={errors.name?.message}
          >
            <Input
              id="name"
              placeholder="e.g. Prime Industrial Supplies"
              aria-invalid={!!errors.name}
              className={sheetInputClassName}
              {...register("name")}
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

        <div className="grid gap-5 sm:grid-cols-2">
          <SheetFormField
            label="Phone"
            htmlFor="phone"
            required
            error={errors.phone?.message}
          >
            <Input
              id="phone"
              placeholder="e.g. +1-212-555-0101"
              aria-invalid={!!errors.phone}
              className={sheetInputClassName}
              {...register("phone")}
            />
          </SheetFormField>

          <SheetFormField
            label="Email"
            htmlFor="email"
            required
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              placeholder="e.g. info@supplier.com"
              aria-invalid={!!errors.email}
              className={sheetInputClassName}
              {...register("email")}
            />
          </SheetFormField>
        </div>

        <SheetFormField
          label="Address"
          htmlFor="address"
          required
          error={errors.address?.message}
        >
          <Textarea
            id="address"
            placeholder="Full business address..."
            aria-invalid={!!errors.address}
            className={sheetTextareaClassName}
            {...register("address")}
          />
        </SheetFormField>
      </FieldGroup>
    </FieldSet>
  );
}
