import { appConfig } from "@/config/navigation";
import type { AuthUser } from "@/types/auth";

export type SidebarBranding = {
  title: string;
  subtitle: string;
};

export function getUserRoleLabel(role: AuthUser["role"]) {
  switch (role) {
    case "super_admin":
      return "Platform Admin";
    case "company_admin":
      return "Company Admin";
    case "user":
      return "Staff Member";
  }
}

export function getSidebarBranding(user: AuthUser): SidebarBranding {
  if (user.role === "super_admin") {
    return {
      title: appConfig.name,
      subtitle: appConfig.description,
    };
  }

  return {
    title: user.company ?? appConfig.name,
    subtitle: getUserRoleLabel(user.role),
  };
}

export function getNavUserSubtitle(user: AuthUser) {
  if (user.role === "super_admin") {
    return user.email;
  }

  return `${getUserRoleLabel(user.role)} · ${user.email}`;
}
