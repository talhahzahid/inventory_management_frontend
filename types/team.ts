export type StaffStatus = "active" | "invited" | "inactive";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roleId?: number;
  roleName?: string;
  department?: string;
  status: StaffStatus;
  joinedAt: string;
  updatedAt?: string;
  lastActive?: string;
  companyId?: number;
  companyName?: string;
};

export const staffStatusLabels: Record<StaffStatus, string> = {
  active: "Active",
  invited: "Invited",
  inactive: "Inactive",
};

export const staffDepartments = [
  "All Departments",
  "Warehouse",
  "Inventory",
  "Sales",
  "Operations",
  "Support",
] as const;

export const staffRoleOptions = [
  { id: 1, label: "Admin" },
  { id: 2, label: "Manager" },
  { id: 3, label: "Employee" },
] as const;
