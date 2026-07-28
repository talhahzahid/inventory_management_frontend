"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

import { accentStyles } from "@/components/auth/login-layout";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login, mapBackendRole } from "@/api/login";
import { getDashboardPathForRole, saveSession } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

type LoginFormProps = {
  role: UserRole;
  title: string;
  subtitle: string;
  demoEmail: string;
  demoPassword: string;
  alternateLogins?: Array<{ label: string; href: string }>;
};

export function LoginForm({
  role,
  subtitle,
  demoEmail,
  demoPassword,
  alternateLogins = [],
}: LoginFormProps) {
  const router = useRouter();
  const styles = accentStyles[role];

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: demoEmail,
    password: demoPassword,
    rememberMe: true,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { token, user } = await login({
        email: formData.email,
        password: formData.password,
      });

      const mappedRole = mapBackendRole(String(user.role));

      if (!mappedRole) {
        setError("Your account role is not supported on this platform.");
        return;
      }

      const session: AuthUser = {
        id: Number(user.id),
        role: mappedRole,
        name: String(user.name),
        email: String(user.email),
        company: user.company_name ? String(user.company_name) : undefined,
        company_id:
          user.company_id === null || user.company_id === undefined
            ? null
            : Number(user.company_id),
        role_id: user.role_id === undefined ? undefined : Number(user.role_id),
        token,
      };

      saveSession(session);
      router.push(getDashboardPathForRole(mappedRole));
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden space-y-1 lg:block">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field className="gap-2">
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            disabled={isLoading}
            value={formData.email}
            onChange={(event) =>
              setFormData({ ...formData, email: event.target.value })
            }
            className="h-10"
            placeholder="you@example.com"
          />
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isLoading}
              value={formData.password}
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
              className="h-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between gap-3 pt-1">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(event) =>
                setFormData({ ...formData, rememberMe: event.target.checked })
              }
              className="size-4 rounded border-input accent-indigo-600"
            />
            Remember me
          </label>
          <Link
            href="#"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Forgot password?
          </Link>
        </div>

        {error ? <FieldError>{error}</FieldError> : null}

        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "h-11 w-full rounded-xl border-0 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all",
            styles.buttonClass
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
          Demo credentials
        </p>
        <p className="mt-1.5 text-sm font-semibold text-slate-800">{demoEmail}</p>
        <p className="text-sm text-slate-500">{demoPassword}</p>
      </div>

      {alternateLogins.length > 0 ? (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-muted-foreground">Sign in as another role</p>
          <div className="flex flex-wrap gap-2">
            {alternateLogins.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
