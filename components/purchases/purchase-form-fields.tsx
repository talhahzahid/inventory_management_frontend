"use client";

import { Plus, Trash2 } from "lucide-react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Controller, useFieldArray } from "react-hook-form";

import {
  SheetFormField,
  sheetInputClassName,
  sheetSelectClassName,
  sheetTextareaClassName,
} from "@/components/sheet-layout";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreatePurchaseFormValues } from "@/schema/purchaseSchema";
import { formatMoney } from "@/types/sale";

export type PurchaseProductOption = {
  label: string;
  value: string;
  purchasePrice: number;
};

type PurchaseFormFieldsProps = {
  register: UseFormRegister<CreatePurchaseFormValues>;
  control: Control<CreatePurchaseFormValues>;
  errors: FieldErrors<CreatePurchaseFormValues>;
  watch: UseFormWatch<CreatePurchaseFormValues>;
  setValue: UseFormSetValue<CreatePurchaseFormValues>;
  productOptions: PurchaseProductOption[];
  supplierOptions: { label: string; value: string }[];
};

export function PurchaseFormFields({
  register,
  control,
  errors,
  watch,
  setValue,
  productOptions,
  supplierOptions,
}: PurchaseFormFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const estimatedTotal = (items ?? []).reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitCost = Number(item.unit_cost) || 0;
    return sum + quantity * unitCost;
  }, 0);

  return (
    <>
      <FieldSet className="gap-5">
        <FieldLegend variant="label">Purchase Details</FieldLegend>
        <FieldGroup className="gap-5">
          <SheetFormField
            label="Supplier"
            htmlFor="supplier_id"
            required
            error={errors.supplier_id?.message}
          >
            <Controller
              name="supplier_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  id="supplier_id"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select supplier"
                  options={supplierOptions}
                  className={sheetSelectClassName}
                />
              )}
            />
          </SheetFormField>

          <SheetFormField
            label="Notes"
            htmlFor="notes"
            error={errors.notes?.message}
          >
            <Textarea
              id="notes"
              placeholder="e.g. Restock"
              className={sheetTextareaClassName}
              {...register("notes")}
            />
          </SheetFormField>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="gap-5">
        <div className="flex items-center justify-between gap-3">
          <FieldLegend variant="label" className="mb-0">
            Line Items
          </FieldLegend>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() =>
              append({ product_id: "", quantity: 1, unit_cost: 0 })
            }
          >
            <Plus className="size-4" />
            Add Item
          </Button>
        </div>

        {errors.items?.message || errors.items?.root?.message ? (
          <p className="text-sm text-rose-600">
            {errors.items.message ?? errors.items.root?.message}
          </p>
        ) : null}

        <FieldGroup className="gap-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 rounded-xl border border-indigo-100/80 bg-slate-50/50 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Item {index + 1}
                </p>
                {fields.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-lg text-rose-600 hover:bg-rose-50"
                    onClick={() => remove(index)}
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </div>

              <SheetFormField
                label="Product"
                htmlFor={`items.${index}.product_id`}
                required
                error={errors.items?.[index]?.product_id?.message}
              >
                <Controller
                  name={`items.${index}.product_id`}
                  control={control}
                  render={({ field: productField }) => (
                    <FormSelect
                      id={`items.${index}.product_id`}
                      value={productField.value}
                      onChange={(value) => {
                        productField.onChange(value);
                        const selected = productOptions.find(
                          (option) => option.value === value
                        );
                        if (selected) {
                          setValue(
                            `items.${index}.unit_cost`,
                            selected.purchasePrice,
                            { shouldValidate: true }
                          );
                        }
                      }}
                      placeholder="Select product"
                      options={productOptions}
                      className={sheetSelectClassName}
                    />
                  )}
                />
              </SheetFormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <SheetFormField
                  label="Quantity"
                  htmlFor={`items.${index}.quantity`}
                  required
                  error={errors.items?.[index]?.quantity?.message}
                >
                  <Input
                    id={`items.${index}.quantity`}
                    type="number"
                    min="1"
                    className={sheetInputClassName}
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />
                </SheetFormField>

                <SheetFormField
                  label="Unit Cost"
                  htmlFor={`items.${index}.unit_cost`}
                  required
                  error={errors.items?.[index]?.unit_cost?.message}
                >
                  <Input
                    id={`items.${index}.unit_cost`}
                    type="number"
                    min="0"
                    step="0.01"
                    className={sheetInputClassName}
                    {...register(`items.${index}.unit_cost`, {
                      valueAsNumber: true,
                    })}
                  />
                </SheetFormField>
              </div>
            </div>
          ))}
        </FieldGroup>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Estimated total: </span>
          <span className="font-bold text-foreground">
            {formatMoney(estimatedTotal)}
          </span>
        </div>
      </FieldSet>
    </>
  );
}
