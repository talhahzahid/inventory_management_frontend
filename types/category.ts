export type CategoryStatus = "active" | "inactive";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
  status: CategoryStatus;
  createdAt?: string;
  updatedAt: string;
  companyId?: number;
  companyName?: string;
  companyEmail?: string;
};

export const categoryStatusLabels: Record<CategoryStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};
