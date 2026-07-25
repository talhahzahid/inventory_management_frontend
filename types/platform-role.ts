export type PlatformRoleScope = "platform" | "company";
export type PlatformRoleStatus = "active" | "inactive";

export type PlatformRole = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  scope: PlatformRoleScope;
  userCount: number;
  permissionCount: number;
  status: PlatformRoleStatus;
  updatedAt: string;
};

export const platformRoleScopeLabels: Record<PlatformRoleScope, string> = {
  platform: "Platform",
  company: "Company",
};

export const platformRoleStatusLabels: Record<PlatformRoleStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};
