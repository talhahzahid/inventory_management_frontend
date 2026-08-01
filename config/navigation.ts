import {
  BarChart3,
  Building2,
  LayoutDashboard,
  Package,
  Settings,
  Shield,
  ShoppingBag,
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
  name: "T&Z",
  description: "Inventory Management System",
  logoIcon: Package,
};

export const loginPortals: LoginPortal[] = [
  {
    role: "super_admin",
    title: "Platform Admin",
    description: "Manage companies, roles, and cross-tenant inventory data.",
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
    description: "Create sales and view catalog, stock, and purchase history.",
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
      { title: "Roles", href: "/admin/roles", icon: Shield },
    ],
  },
  {
    label: "Tenant Data",
    items: [
      { title: "Products", href: "/admin/products", icon: Package },
      { title: "Categories", href: "/admin/categories", icon: Tags },
      { title: "Inventory", href: "/admin/inventory", icon: Warehouse },
      { title: "Suppliers", href: "/admin/suppliers", icon: Truck },
      { title: "Sales", href: "/admin/sales", icon: ShoppingBag },
      { title: "Purchases", href: "/admin/purchases", icon: ShoppingCart },
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
      { title: "Inventory", href: "/company/inventory", icon: Warehouse },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Suppliers", href: "/company/suppliers", icon: Truck },
      { title: "Sales", href: "/company/sales", icon: ShoppingBag },
      { title: "Purchases", href: "/company/purchases", icon: ShoppingCart },
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
    label: "Overview",
    items: [{ title: "Dashboard", href: "/user", icon: LayoutDashboard }],
  },
  {
    label: "Inventory",
    items: [
      { title: "Products", href: "/user/products", icon: Package },
      { title: "Categories", href: "/user/categories", icon: Tags },
      { title: "Inventory", href: "/user/inventory", icon: Warehouse },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Suppliers", href: "/user/suppliers", icon: Truck },
      { title: "Sales", href: "/user/sales", icon: ShoppingBag },
      { title: "Purchases", href: "/user/purchases", icon: ShoppingCart },
    ],
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
    portalSubtitle: "Manage companies, roles, and cross-tenant data.",
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
    portalSubtitle: "Create sales and view catalog, stock, and purchases.",
    navGroups: userNav,
  },
};

export function getNavGroupsForRole(role: UserRole) {
  return roleNavConfig[role].navGroups;
}
