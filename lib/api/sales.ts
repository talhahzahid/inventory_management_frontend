import { apiRequest } from "@/lib/api/api";

export type SaleStatus = "completed" | "cancelled";

export type SaleItemApiRecord = {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: string | number;
  subtotal: string | number;
  createdAt?: string;
  updatedAt?: string;
  product?: {
    id: number;
    sku: string;
    name: string;
    selling_price: string | number;
  };
};

export type SaleApiRecord = {
  id: number;
  company_id: number;
  sold_by: number;
  customer_name: string | null;
  total_amount: string | number;
  status: SaleStatus;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
  seller?: {
    id: number;
    name: string;
    email: string;
  };
  items?: SaleItemApiRecord[];
};

export type CreateSaleItemPayload = {
  product_id: number;
  quantity: number;
  unit_price?: number;
};

export type CreateSalePayload = {
  customer_name?: string;
  notes?: string;
  items: CreateSaleItemPayload[];
};

export type SalesListParams = {
  page?: number;
  limit?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
  company_id?: number;
};

export type SalesListResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: SaleApiRecord[];
};

export type SalesSummaryApiRecord = {
  today: { count: number; amount: number };
  total: { count: number; amount: number };
};

export async function fetchSalesApi(params?: SalesListParams) {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search?.trim()) searchParams.set("search", params.search.trim());
  if (params?.from_date) searchParams.set("from_date", params.from_date);
  if (params?.to_date) searchParams.set("to_date", params.to_date);
  if (params?.company_id) {
    searchParams.set("company_id", String(params.company_id));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/sales?${query}` : "/sales";

  const result = await apiRequest<SalesListResponse | SaleApiRecord[]>({
    endpoint,
    method: "GET",
  });

  if (Array.isArray(result)) {
    return {
      total: result.length,
      page: 1,
      limit: result.length,
      totalPages: 1,
      data: result,
    };
  }

  return result;
}

export async function fetchSaleByIdApi(id: string | number) {
  return apiRequest<SaleApiRecord>({
    endpoint: `/sales/${id}`,
    method: "GET",
  });
}

export async function fetchSalesSummaryApi(companyId?: number) {
  const query = companyId ? `?company_id=${companyId}` : "";

  return apiRequest<SalesSummaryApiRecord>({
    endpoint: `/sales/summary${query}`,
    method: "GET",
  });
}

export async function createSaleApi(payload: CreateSalePayload) {
  return apiRequest<SaleApiRecord>({
    endpoint: "/sales/create",
    method: "POST",
    body: payload,
  });
}
