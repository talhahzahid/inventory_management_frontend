export type DashboardSalesBucket = {
  count: number;
  amount: number;
};

export type DashboardReorderItem = {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  suggestedPurchaseQty: number;
  warehouseLocation: string | null;
};

export type DashboardSummary = {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalStockUnits: number;
  lowStockCount: number;
  sales: {
    today: DashboardSalesBucket;
    total: DashboardSalesBucket;
  };
  reorderList: DashboardReorderItem[];
};

export function formatDashboardNumber(value: number): string {
  return value.toLocaleString();
}

export function formatDashboardAmount(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
