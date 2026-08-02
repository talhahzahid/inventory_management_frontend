"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UiButton } from "@/components/Button";
import { ListViewHeader } from "@/components/list-view";
import {
  SheetFormField,
  sheetInputClassName,
} from "@/components/sheet-layout";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api/api";
import { changePasswordApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schema/changePasswordSchema";

const defaultValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function PasswordInput({
  id,
  autoComplete,
  show,
  onToggle,
  disabled,
  invalid,
  ...field
}: {
  id: string;
  autoComplete: string;
  show: boolean;
  onToggle: () => void;
  disabled?: boolean;
  invalid?: boolean;
} & ComponentProps<typeof Input>) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={invalid}
        className={cn(sheetInputClassName, "pr-11")}
        placeholder="••••••••"
        {...field}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function ChangePasswordScreen() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await changePasswordApi({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset(defaultValues);
      toast.success("Password updated", {
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update password."));
    }
  });

  return (
    <div className="space-y-6">
      <ListViewHeader
        badge="Security"
        title="Change Password"
        description="Update your account password. Use a strong password you have not used before."
      />

      <form
        className="surface-card max-w-lg space-y-6 p-6"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-indigo-600" />
          <p className="text-sm text-indigo-900/80">
            After changing your password, keep the new one secure. You will stay
            signed in on this device.
          </p>
        </div>

        <SheetFormField
          label="Current Password"
          htmlFor="currentPassword"
          required
          error={errors.currentPassword?.message}
        >
          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            show={showCurrent}
            onToggle={() => setShowCurrent((value) => !value)}
            disabled={isSubmitting}
            invalid={!!errors.currentPassword}
            {...register("currentPassword")}
          />
        </SheetFormField>

        <SheetFormField
          label="New Password"
          htmlFor="newPassword"
          required
          error={errors.newPassword?.message}
          hint="8+ characters with uppercase, lowercase, number, and special character."
        >
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            show={showNew}
            onToggle={() => setShowNew((value) => !value)}
            disabled={isSubmitting}
            invalid={!!errors.newPassword}
            {...register("newPassword")}
          />
        </SheetFormField>

        <SheetFormField
          label="Confirm New Password"
          htmlFor="confirmPassword"
          required
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            show={showConfirm}
            onToggle={() => setShowConfirm((value) => !value)}
            disabled={isSubmitting}
            invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </SheetFormField>

        <div className="flex justify-end pt-2">
          <UiButton
            type="submit"
            disabled={isSubmitting}
            buttonText={isSubmitting ? "Updating..." : "Update Password"}
            icon={isSubmitting ? Loader2 : Lock}
            className={cn(isSubmitting && "[&_svg]:animate-spin")}
          />
        </div>
      </form>
    </div>
  );
}
