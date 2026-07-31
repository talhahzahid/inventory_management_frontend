import { apiRequest } from "@/lib/api/api";

export type DashboardReorderApiItem = {
  product_id: number;
  product_name: string | null;
  sku: string | null;
  current_stock: number;
  minimum_stock: number;
  maximum_stock: number;
  suggested_purchase_qty: number;
  warehouse_location: string | null;
};

export type DashboardSalesBucketApi = {
  count: number;
  amount: number;
};

export type DashboardSummaryApiRecord = {
  total_products: number;
  total_categories: number;
  total_suppliers: number;
  total_stock_units: number;
  low_stock_count: number;
  sales: {
    today: DashboardSalesBucketApi;
    total: DashboardSalesBucketApi;
  };
  reorder_list: DashboardReorderApiItem[];
};

export type DashboardSummaryParams = {
  company_id?: number;
};

export async function fetchDashboardSummaryApi(
  params?: DashboardSummaryParams
) {
  const searchParams = new URLSearchParams();

  if (params?.company_id) {
    searchParams.set("company_id", String(params.company_id));
  }

  const query = searchParams.toString();
  const endpoint = query
    ? `/dashboard/summary?${query}`
    : "/dashboard/summary";

  return apiRequest<DashboardSummaryApiRecord>({
    endpoint,
    method: "GET",
  });
}
