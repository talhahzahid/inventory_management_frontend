export type CompanyStatus = "active" | "inactive";

export type Company = {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  logo?: string | null;
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
};

export const companyStatusLabels: Record<CompanyStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};
