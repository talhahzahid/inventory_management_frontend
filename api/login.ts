import { apiRequest } from "@/api/api";
import type { UserRole } from "@/types/auth";

const BACKEND_TO_FRONTEND_ROLE: Record<string, UserRole> = {
  superAdmin: "super_admin",
  admin: "company_admin",
  manager: "company_admin",
  employee: "user",
};

export type LoginUser = {
  id: number;
  name: string;
  email: string;
  company_id: number | null;
  company_name?: string | null;
  role_id: number;
  role: string;
};

export type LoginResponse = {
  token: string;
  user: LoginUser;
};

export function mapBackendRole(backendRole: string): UserRole | null {
  return BACKEND_TO_FRONTEND_ROLE[backendRole] ?? null;
}

export function isRoleAllowedOnPortal(
  portalRole: UserRole,
  backendRole: string
): boolean {
  return mapBackendRole(backendRole) === portalRole;
}

export function getPortalAccessError(portalRole: UserRole) {
  switch (portalRole) {
    case "super_admin":
      return "Invalid email or password for the platform admin portal.";
    case "company_admin":
      return "Invalid email or password for the company admin portal.";
    case "user":
      return "Invalid email or password for the staff portal.";
  }
}

export async function login(credentials: { email: string; password: string }) {
  const data = await apiRequest<LoginResponse>({
    endpoint: "/auth/login",
    method: "POST",
    body: credentials,
    auth: false,
  });

  if (!data?.token || !data?.user) {
    throw new Error("Invalid login response from server");
  }

  return data;
}
