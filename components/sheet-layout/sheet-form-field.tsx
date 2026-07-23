import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

type SheetFormFieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export function SheetFormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: SheetFormFieldProps) {
  return (
    <Field className={cn("gap-2", className)} data-invalid={!!error}>
      <FieldLabel htmlFor={htmlFor} className="font-semibold text-slate-700">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </FieldLabel>
      {children}
      {error ? <FieldError>{error}</FieldError> : null}
      {!error && hint ? <FieldDescription>{hint}</FieldDescription> : null}
    </Field>
  );
}
