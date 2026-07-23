import type { AuthUser, UserRole } from "@/types/auth";

const AUTH_STORAGE_KEY = "stockflow_session";

type DemoAccount = AuthUser & {
  password: string;
};

export const demoAccounts: DemoAccount[] = [
  {
    role: "super_admin",
    name: "Super Admin",
    email: "admin@stockflow.com",
    password: "Admin@123",
  },
  {
    role: "company_admin",
    name: "Company Admin",
    email: "company@abc.com",
    password: "Company@123",
    company: "ABC Traders",
  },
  {
    role: "user",
    name: "Staff User",
    email: "user@abc.com",
    password: "User@123",
    company: "ABC Traders",
  },
];

export const roleRedirects: Record<UserRole, string> = {
  super_admin: "/admin",
  company_admin: "/company",
  user: "/user",
};

export const roleLoginPaths: Record<UserRole, string> = {
  super_admin: "/admin/login",
  company_admin: "/company/login",
  user: "/user/login",
};

export function authenticate(
  email: string,
  password: string,
  expectedRole?: UserRole
): AuthUser | null {
  const account = demoAccounts.find(
    (item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password &&
      (!expectedRole || item.role === expectedRole)
  );

  if (!account) {
    return null;
  }

  const { password: _, ...user } = account;
  return user;
}

export function saveSession(user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getLoginPathForRole(role: UserRole) {
  return roleLoginPaths[role];
}

export function getDashboardPathForRole(role: UserRole) {
  return roleRedirects[role];
}
