export type UserRole = "super_admin" | "company_admin" | "user";

export type AuthUser = {
  role: UserRole;
  name: string;
  email: string;
  company?: string;
};

export type LoginPortal = {
  role: UserRole;
  title: string;
  description: string;
  href: string;
  badge: string;
  accent: "slate" | "indigo" | "emerald";
};
