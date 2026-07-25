export type StaffStatus = "active" | "invited" | "inactive";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  status: StaffStatus;
  joinedAt: string;
  lastActive?: string;
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
