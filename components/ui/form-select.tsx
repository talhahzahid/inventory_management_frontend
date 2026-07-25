"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FormSelectOption = {
  label: string;
  value: string;
};

type FormSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
};

export function FormSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled,
  id,
  className,
}: FormSelectProps) {
  return (
    <Select
      value={value || undefined}
      onValueChange={(next) => onChange(next ?? "")}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        className={cn(
          "h-11 w-full rounded-xl border-input bg-transparent px-3.5 text-base shadow-none",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        align="start"
        alignItemWithTrigger={false}
        sideOffset={6}
        className="max-h-64 min-w-[var(--anchor-width)] rounded-xl border border-indigo-100/80 p-1 shadow-lg"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="rounded-lg py-2 pr-8 pl-2.5"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
