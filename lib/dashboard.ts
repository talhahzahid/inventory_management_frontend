import {
  fetchDashboardSummaryApi,
  type DashboardReorderApiItem,
  type DashboardSalesBucketApi,
  type DashboardSummaryApiRecord,
} from "@/lib/api/dashboard";
import type {
  DashboardReorderItem,
  DashboardSalesBucket,
  DashboardSummary,
} from "@/types/dashboard";

function mapSalesBucket(bucket: DashboardSalesBucketApi): DashboardSalesBucket {
  return {
    count: bucket.count ?? 0,
    amount: Number(bucket.amount) || 0,
  };
}

function mapReorderItem(item: DashboardReorderApiItem): DashboardReorderItem {
  return {
    productId: String(item.product_id),
    productName: item.product_name ?? "Unknown product",
    sku: item.sku ?? "—",
    currentStock: item.current_stock,
    minimumStock: item.minimum_stock,
    maximumStock: item.maximum_stock,
    suggestedPurchaseQty: item.suggested_purchase_qty,
    warehouseLocation: item.warehouse_location,
  };
}

export function mapDashboardSummaryFromApi(
  record: DashboardSummaryApiRecord
): DashboardSummary {
  return {
    totalProducts: record.total_products ?? 0,
    totalCategories: record.total_categories ?? 0,
    totalSuppliers: record.total_suppliers ?? 0,
    totalStockUnits: record.total_stock_units ?? 0,
    lowStockCount: record.low_stock_count ?? 0,
    sales: {
      today: mapSalesBucket(record.sales?.today ?? { count: 0, amount: 0 }),
      total: mapSalesBucket(record.sales?.total ?? { count: 0, amount: 0 }),
    },
    reorderList: (record.reorder_list ?? []).map(mapReorderItem),
  };
}

export async function fetchDashboardSummary(
  companyId?: number
): Promise<DashboardSummary> {
  const result = await fetchDashboardSummaryApi(
    companyId ? { company_id: companyId } : undefined
  );
  return mapDashboardSummaryFromApi(result);
}
