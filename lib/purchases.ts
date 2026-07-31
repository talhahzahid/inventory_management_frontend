import {
  createPurchaseApi,
  fetchPurchaseByIdApi,
  fetchPurchasesApi,
  type PurchaseApiRecord,
  type PurchaseItemApiRecord,
  type PurchasesListParams,
} from "@/api/purchases";
import type { CreatePurchaseFormValues } from "@/schema/purchaseSchema";
import type { Purchase, PurchaseItem } from "@/types/purchase";

function formatDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

function parseDecimal(value: string | number) {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapPurchaseItem(item: PurchaseItemApiRecord): PurchaseItem {
  return {
    id: String(item.id),
    productId: String(item.product_id),
    quantity: item.quantity,
    unitCost: parseDecimal(item.unit_cost),
    subtotal: parseDecimal(item.subtotal),
    productName: item.product?.name,
    productSku: item.product?.sku,
  };
}

export function mapPurchaseFromApi(record: PurchaseApiRecord): Purchase {
  return {
    id: String(record.id),
    companyId: record.company_id,
    supplierId: String(record.supplier_id),
    purchasedBy: String(record.purchased_by),
    totalAmount: parseDecimal(record.total_amount),
    status: record.status,
    notes: record.notes,
    createdAt: formatDate(record.createdAt),
    updatedAt: formatDate(record.updatedAt),
    supplierName: record.supplier?.name,
    supplierEmail: record.supplier?.email,
    supplierPhone: record.supplier?.phone,
    buyerName: record.buyer?.name,
    buyerEmail: record.buyer?.email,
    items: (record.items ?? []).map(mapPurchaseItem),
  };
}

export type PurchasesListResult = {
  purchases: Purchase[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchPurchasesList(
  params?: PurchasesListParams
): Promise<PurchasesListResult> {
  const result = await fetchPurchasesApi({
    page: 1,
    limit: 10,
    ...params,
  });

  return {
    purchases: result.data.map(mapPurchaseFromApi),
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  };
}

export async function fetchPurchaseById(id: string): Promise<Purchase> {
  const purchase = await fetchPurchaseByIdApi(id);
  return mapPurchaseFromApi(purchase);
}

export async function createPurchase(
  values: CreatePurchaseFormValues
): Promise<Purchase> {
  const purchase = await createPurchaseApi({
    supplier_id: Number(values.supplier_id),
    notes: values.notes || undefined,
    items: values.items.map((item) => ({
      product_id: Number(item.product_id),
      quantity: item.quantity,
      unit_cost: item.unit_cost,
    })),
  });

  return mapPurchaseFromApi(purchase);
}
