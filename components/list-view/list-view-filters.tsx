"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ListFilterConfig } from "@/types/list-view";

type ListViewFiltersProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ListFilterConfig[];
  onClear?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
};

export function ListViewFilters({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onClear,
  hasActiveFilters = false,
  className,
}: ListViewFiltersProps) {
  return (
    <div
      className={cn(
        "surface-card flex flex-col gap-4 p-4 md:flex-row md:items-end md:p-5",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-end">
        <Field className="relative min-w-[220px] flex-1 gap-2">
          <FieldLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Search
          </FieldLabel>
          <Search className="pointer-events-none absolute bottom-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 pl-10"
          />
        </Field>

        {filters.map((filter) => (
          <Field key={filter.id} className="min-w-[160px] flex-1 gap-2">
            <FieldLabel
              htmlFor={filter.id}
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {filter.label}
            </FieldLabel>
            <FormSelect
              id={filter.id}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
              placeholder={filter.placeholder ?? `All ${filter.label}`}
            />
          </Field>
        ))}
      </div>

      <div className="flex items-center gap-2 md:pb-0.5">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl"
        >
          <SlidersHorizontal className="size-4" />
          More filters
        </Button>
        {hasActiveFilters && onClear ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onClear}
            className="h-10 rounded-xl text-muted-foreground"
          >
            <X className="size-4" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
