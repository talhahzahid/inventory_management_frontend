export type SaleStatus = "completed" | "cancelled";

export type SaleItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  productName?: string;
  productSku?: string;
};

export type Sale = {
  id: string;
  companyId: number;
  soldBy: string;
  customerName: string | null;
  totalAmount: number;
  status: SaleStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  sellerName?: string;
  sellerEmail?: string;
  items: SaleItem[];
};

export const saleStatusLabels: Record<SaleStatus, string> = {
  completed: "Completed",
  cancelled: "Cancelled",
};

export function formatMoney(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
