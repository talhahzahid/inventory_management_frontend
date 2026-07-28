export type UserRole = "super_admin" | "company_admin" | "user";

export type AuthUser = {
  id?: number;
  role: UserRole;
  name: string;
  email: string;
  company?: string;
  company_id?: number | null;
  role_id?: number;
  token?: string;
};

export type LoginPortal = {
  role: UserRole;
  title: string;
  description: string;
  href: string;
  badge: string;
  accent: "slate" | "indigo" | "emerald";
};
