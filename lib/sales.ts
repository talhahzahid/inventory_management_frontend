import {
  createSaleApi,
  fetchSaleByIdApi,
  fetchSalesApi,
  fetchSalesSummaryApi,
  type SaleApiRecord,
  type SaleItemApiRecord,
  type SalesListParams,
} from "@/lib/api/sales";
import type { CreateSaleFormValues } from "@/schema/saleSchema";
import type { Sale, SaleItem } from "@/types/sale";

function formatDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

function parseDecimal(value: string | number) {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapSaleItem(item: SaleItemApiRecord): SaleItem {
  return {
    id: String(item.id),
    productId: String(item.product_id),
    quantity: item.quantity,
    unitPrice: parseDecimal(item.unit_price),
    subtotal: parseDecimal(item.subtotal),
    productName: item.product?.name,
    productSku: item.product?.sku,
  };
}

export function mapSaleFromApi(record: SaleApiRecord): Sale {
  return {
    id: String(record.id),
    companyId: record.company_id,
    soldBy: String(record.sold_by),
    customerName: record.customer_name,
    totalAmount: parseDecimal(record.total_amount),
    status: record.status,
    notes: record.notes,
    createdAt: formatDate(record.createdAt),
    updatedAt: formatDate(record.updatedAt),
    sellerName: record.seller?.name,
    sellerEmail: record.seller?.email,
    items: (record.items ?? []).map(mapSaleItem),
  };
}

export type SalesListResult = {
  sales: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchSalesList(
  params?: SalesListParams
): Promise<SalesListResult> {
  const result = await fetchSalesApi({
    page: 1,
    limit: 10,
    ...params,
  });

  return {
    sales: result.data.map(mapSaleFromApi),
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  };
}

export async function fetchSaleById(id: string): Promise<Sale> {
  const sale = await fetchSaleByIdApi(id);
  return mapSaleFromApi(sale);
}

export async function fetchSalesSummary(companyId?: number) {
  return fetchSalesSummaryApi(companyId);
}

export async function createSale(values: CreateSaleFormValues): Promise<Sale> {
  const sale = await createSaleApi({
    customer_name: values.customer_name || undefined,
    notes: values.notes || undefined,
    items: values.items.map((item) => ({
      product_id: Number(item.product_id),
      quantity: item.quantity,
      unit_price: item.unit_price,
    })),
  });

  return mapSaleFromApi(sale);
}
