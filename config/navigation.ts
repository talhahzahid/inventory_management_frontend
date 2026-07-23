import {
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

import type { LoginPortal, UserRole } from "@/types/auth";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const appConfig = {
  name: "StockFlow",
  description: "Inventory Management System",
  logoIcon: Package,
};

export const loginPortals: LoginPortal[] = [
  {
    role: "super_admin",
    title: "Platform Admin",
    description: "Manage companies, subscriptions, and platform analytics.",
    href: "/admin/login",
    badge: "Super Admin",
    accent: "slate",
  },
  {
    role: "company_admin",
    title: "Company Portal",
    description: "Manage your company inventory, team, and operations.",
    href: "/company/login",
    badge: "Company Admin",
    accent: "indigo",
  },
  {
    role: "user",
    title: "Staff Login",
    description: "Access daily tasks, stock updates, and order handling.",
    href: "/user/login",
    badge: "Team Member",
    accent: "emerald",
  },
];

const adminNav: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Companies", href: "/admin/companies", icon: Building2 },
      { title: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
      { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Platform Users", href: "/admin/users", icon: Users },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const companyNav: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/company", icon: LayoutDashboard }],
  },
  {
    label: "Inventory",
    items: [
      { title: "Products", href: "/company/products", icon: Package },
      { title: "Categories", href: "/company/categories", icon: Tags },
      { title: "Stock", href: "/company/inventory", icon: Warehouse },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Suppliers", href: "/company/suppliers", icon: Truck },
      { title: "Purchase Orders", href: "/company/orders", icon: ShoppingCart },
      { title: "Reports", href: "/company/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Company",
    items: [
      { title: "Team", href: "/company/team", icon: Users },
      { title: "Settings", href: "/company/settings", icon: Settings },
    ],
  },
];

const userNav: NavGroup[] = [
  {
    label: "My Work",
    items: [
      { title: "Dashboard", href: "/user", icon: LayoutDashboard },
      { title: "Products", href: "/user/products", icon: Package },
      { title: "Stock", href: "/user/stock", icon: Warehouse },
      { title: "Orders", href: "/user/orders", icon: ShoppingCart },
    ],
  },
  {
    label: "Account",
    items: [{ title: "Profile", href: "/user/profile", icon: Settings }],
  },
];

export const roleNavConfig: Record<
  UserRole,
  {
    basePath: string;
    loginPath: string;
    portalTitle: string;
    portalSubtitle: string;
    navGroups: NavGroup[];
  }
> = {
  super_admin: {
    basePath: "/admin",
    loginPath: "/admin/login",
    portalTitle: "Platform Control Center",
    portalSubtitle: "Monitor every company, plan, and platform metric.",
    navGroups: adminNav,
  },
  company_admin: {
    basePath: "/company",
    loginPath: "/company/login",
    portalTitle: "Company Admin Portal",
    portalSubtitle: "Run inventory, team, and business operations.",
    navGroups: companyNav,
  },
  user: {
    basePath: "/user",
    loginPath: "/user/login",
    portalTitle: "Staff Workspace",
    portalSubtitle: "Handle daily inventory tasks and order updates.",
    navGroups: userNav,
  },
};

export function getNavGroupsForRole(role: UserRole) {
  return roleNavConfig[role].navGroups;
}
