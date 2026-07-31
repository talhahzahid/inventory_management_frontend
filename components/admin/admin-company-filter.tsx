"use client";

import { useEffect, useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { FormSelect } from "@/components/ui/form-select";
import { fetchCompanyOptions } from "@/lib/companies";

type AdminCompanyFilterProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  allowAll?: boolean;
  requiredHint?: string;
};

export function AdminCompanyFilter({
  value,
  onChange,
  label = "Company Scope",
  allowAll = true,
  requiredHint,
}: AdminCompanyFilterProps) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );

  useEffect(() => {
    let cancelled = false;

    fetchCompanyOptions()
      .then((data) => {
        if (!cancelled) setOptions(data);
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="surface-card flex flex-col gap-2 p-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          {requiredHint ||
            "Filter tenant data by company. Leave as All to see every company."}
        </p>
      </div>
      <Field className="min-w-[220px] gap-2 sm:w-72">
        <FieldLabel
          htmlFor="admin_company_id"
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Company
        </FieldLabel>
        <FormSelect
          id="admin_company_id"
          value={value}
          onChange={onChange}
          placeholder="Select company"
          options={
            allowAll
              ? [{ label: "All Companies", value: "all" }, ...options]
              : options
          }
          className="h-10 rounded-xl bg-transparent text-sm shadow-none"
        />
      </Field>
    </div>
  );
}

export function useAdminCompanyScope(defaultValue = "all") {
  const [companyId, setCompanyId] = useState(defaultValue);
  return { companyId, setCompanyId };
}
