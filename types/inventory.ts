import type { ProductStatus, StockLevel } from "@/types/product";
import { stockLevelLabels } from "@/types/product";

export type { StockLevel };
export { stockLevelLabels };

export type InventoryItem = {
  id: string;
  companyId: number;
  productId: string;
  quantity: number;
  minimumStock: number;
  maximumStock: number;
  warehouseLocation: string | null;
  createdAt: string;
  updatedAt: string;
  productSku?: string;
  productName?: string;
  productStatus?: ProductStatus;
  productPurchasePrice?: number;
  productSellingPrice?: number;
  companyName?: string;
  companyEmail?: string;
};

export function getInventoryStockLevel(item: InventoryItem): StockLevel {
  if (item.quantity === 0) {
    return "out_of_stock";
  }

  if (item.quantity <= item.minimumStock) {
    return "low_stock";
  }

  return "in_stock";
}

export function formatInventoryQuantity(value: number): string {
  return value.toLocaleString();
}
