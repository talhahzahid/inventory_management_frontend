import { apiRequest } from "@/api/api";

export type PurchaseStatus = "completed" | "cancelled";

export type PurchaseItemApiRecord = {
  id: number;
  purchase_id: number;
  product_id: number;
  quantity: number;
  unit_cost: string | number;
  subtotal: string | number;
  createdAt?: string;
  updatedAt?: string;
  product?: {
    id: number;
    sku: string;
    name: string;
    purchase_price: string | number;
  };
};

export type PurchaseApiRecord = {
  id: number;
  company_id: number;
  supplier_id: number;
  purchased_by: number;
  total_amount: string | number;
  status: PurchaseStatus;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
  supplier?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  buyer?: {
    id: number;
    name: string;
    email: string;
  };
  items?: PurchaseItemApiRecord[];
};

export type CreatePurchaseItemPayload = {
  product_id: number;
  quantity: number;
  unit_cost?: number;
};

export type CreatePurchasePayload = {
  supplier_id: number;
  notes?: string;
  items: CreatePurchaseItemPayload[];
};

export type PurchasesListParams = {
  page?: number;
  limit?: number;
  search?: string;
  supplier_id?: number;
  from_date?: string;
  to_date?: string;
  company_id?: number;
};

export type PurchasesListResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: PurchaseApiRecord[];
};

export async function fetchPurchasesApi(params?: PurchasesListParams) {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search?.trim()) searchParams.set("search", params.search.trim());
  if (params?.supplier_id) {
    searchParams.set("supplier_id", String(params.supplier_id));
  }
  if (params?.from_date) searchParams.set("from_date", params.from_date);
  if (params?.to_date) searchParams.set("to_date", params.to_date);
  if (params?.company_id) {
    searchParams.set("company_id", String(params.company_id));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/purchases?${query}` : "/purchases";

  const result = await apiRequest<PurchasesListResponse | PurchaseApiRecord[]>({
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

export async function fetchPurchaseByIdApi(id: string | number) {
  return apiRequest<PurchaseApiRecord>({
    endpoint: `/purchases/${id}`,
    method: "GET",
  });
}

export async function createPurchaseApi(payload: CreatePurchasePayload) {
  return apiRequest<PurchaseApiRecord>({
    endpoint: "/purchases/create",
    method: "POST",
    body: payload,
  });
}
