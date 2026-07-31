export type PurchaseStatus = "completed" | "cancelled";

export type PurchaseItem = {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
  productName?: string;
  productSku?: string;
};

export type Purchase = {
  id: string;
  companyId: number;
  supplierId: string;
  purchasedBy: string;
  totalAmount: number;
  status: PurchaseStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  supplierName?: string;
  supplierEmail?: string;
  supplierPhone?: string;
  buyerName?: string;
  buyerEmail?: string;
  items: PurchaseItem[];
};

export const purchaseStatusLabels: Record<PurchaseStatus, string> = {
  completed: "Completed",
  cancelled: "Cancelled",
};
