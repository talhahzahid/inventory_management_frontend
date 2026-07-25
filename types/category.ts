export type CategoryStatus = "active" | "inactive";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
  status: CategoryStatus;
  updatedAt: string;
};

export const categoryStatusLabels: Record<CategoryStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};
