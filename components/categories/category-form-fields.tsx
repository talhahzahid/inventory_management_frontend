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
import type { AddCategoryFormValues } from "@/schema/categorySchema";
import { categoryStatusLabels } from "@/types/category";
import type { CategoryStatus } from "@/types/category";

const statusOptions = (
  Object.entries(categoryStatusLabels) as [CategoryStatus, string][]
).map(([value, label]) => ({ label, value }));

type CategoryFormFieldsProps = {
  register: UseFormRegister<AddCategoryFormValues>;
  control: Control<AddCategoryFormValues>;
  errors: FieldErrors<AddCategoryFormValues>;
};

export function CategoryFormFields({
  register,
  control,
  errors,
}: CategoryFormFieldsProps) {
  return (
    <>
      <FieldSet className="gap-5">
        <FieldLegend variant="label">Category Details</FieldLegend>
        <FieldGroup className="gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <SheetFormField
              label="Category Name"
              htmlFor="name"
              required
              error={errors.name?.message}
            >
              <Input
                id="name"
                placeholder="e.g. Electronics"
                aria-invalid={!!errors.name}
                className={sheetInputClassName}
                {...register("name")}
              />
            </SheetFormField>

            {/* <SheetFormField
              label="Slug"
              htmlFor="slug"
              required
              error={errors.slug?.message}
              hint="URL-friendly identifier"
            >
              <Input
                id="slug"
                placeholder="e.g. electronics"
                aria-invalid={!!errors.slug}
                className={sheetInputClassName}
                {...register("slug")}
              />
            </SheetFormField> */}


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
            hint="Optional notes about this category"
          >
            <Textarea
              id="description"
              placeholder="Describe what products belong in this category..."
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
