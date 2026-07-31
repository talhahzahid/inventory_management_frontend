export type PlatformRoleName =
  | "superAdmin"
  | "admin"
  | "manager"
  | "employee";

export type PlatformRole = {
  id: string;
  name: PlatformRoleName;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export const platformRoleNameLabels: Record<PlatformRoleName, string> = {
  superAdmin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  employee: "Employee",
};

export const platformRoleNameOptions = (
  Object.entries(platformRoleNameLabels) as [PlatformRoleName, string][]
).map(([value, label]) => ({ label, value }));
