export type ProductStatus = "active" | "inactive";

export type StockLevel = "in_stock" | "low_stock" | "out_of_stock";

export type ProductInventory = {
  id: string;
  quantity: number;
  minimumStock: number;
  maximumStock: number;
  warehouseLocation: string | null;
};

export type Product = {
  id: string;
  companyId: number;
  categoryId: string;
  supplierId: string;
  sku: string;
  name: string;
  description?: string | null;
  purchasePrice: number;
  sellingPrice: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  companyName?: string;
  companyEmail?: string;
  categoryName?: string;
  supplierName?: string;
  supplierEmail?: string;
  inventory?: ProductInventory;
};

export const productStatusLabels: Record<ProductStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export const stockLevelLabels: Record<StockLevel, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

export function getProductStockLevel(product: Product): StockLevel {
  const quantity = product.inventory?.quantity ?? 0;
  const minimumStock = product.inventory?.minimumStock ?? 0;

  if (quantity === 0) {
    return "out_of_stock";
  }

  if (quantity <= minimumStock) {
    return "low_stock";
  }

  return "in_stock";
}

export function formatProductPrice(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
