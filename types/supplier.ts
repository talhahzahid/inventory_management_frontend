export type SupplierStatus = "active" | "inactive";

export type Supplier = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: SupplierStatus;
  createdAt?: string;
  updatedAt: string;
  companyId?: number;
};

export const supplierStatusLabels: Record<SupplierStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};
