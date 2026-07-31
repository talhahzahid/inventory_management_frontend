import {
  adjustInventoryApi,
  fetchInventoryApi,
  fetchInventoryByIdApi,
  updateInventoryApi,
  type InventoryApiRecord,
  type InventoryListParams,
} from "@/lib/api/inventory";
import type {
  AdjustInventoryFormValues,
  EditInventoryFormValues,
} from "@/schema/inventorySchema";
import type { InventoryItem } from "@/types/inventory";

function formatDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

function parseDecimal(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function mapInventoryFromApi(record: InventoryApiRecord): InventoryItem {
  return {
    id: String(record.id),
    companyId: record.company_id,
    productId: String(record.product_id),
    quantity: record.quantity,
    minimumStock: record.minimum_stock,
    maximumStock: record.maximum_stock,
    warehouseLocation: record.warehouse_location,
    createdAt: formatDate(record.createdAt),
    updatedAt: formatDate(record.updatedAt),
    productSku: record.product?.sku,
    productName: record.product?.name,
    productStatus: record.product?.status,
    productPurchasePrice: record.product
      ? parseDecimal(record.product.purchase_price)
      : undefined,
    productSellingPrice: record.product
      ? parseDecimal(record.product.selling_price)
      : undefined,
    companyName: record.company?.name,
    companyEmail: record.company?.email,
  };
}

export type InventoryListResult = {
  items: InventoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchInventoryList(
  params?: InventoryListParams
): Promise<InventoryListResult> {
  const result = await fetchInventoryApi({
    page: 1,
    limit: 10,
    ...params,
  });

  return {
    items: result.data.map(mapInventoryFromApi),
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  };
}

export async function fetchInventoryById(id: string): Promise<InventoryItem> {
  const item = await fetchInventoryByIdApi(id);
  return mapInventoryFromApi(item);
}

export async function updateInventory(
  id: string,
  values: EditInventoryFormValues
): Promise<InventoryItem> {
  const item = await updateInventoryApi(id, {
    quantity: values.quantity,
    minimum_stock: values.minimum_stock,
    maximum_stock: values.maximum_stock,
    warehouse_location: values.warehouse_location || undefined,
  });

  return mapInventoryFromApi(item);
}

export async function adjustInventory(
  id: string,
  values: AdjustInventoryFormValues
): Promise<InventoryItem> {
  const item = await adjustInventoryApi(id, {
    adjustment: values.adjustment,
  });

  return mapInventoryFromApi(item);
}
