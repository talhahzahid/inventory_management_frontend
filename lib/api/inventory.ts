import { apiRequest } from "@/lib/api/api";
import type { ProductStatus } from "@/types/product";

export type InventoryProductApiRecord = {
  id: number;
  sku: string;
  name: string;
  status: ProductStatus;
  purchase_price: string;
  selling_price: string;
};

export type InventoryApiRecord = {
  id: number;
  company_id: number;
  product_id: number;
  quantity: number;
  minimum_stock: number;
  maximum_stock: number;
  warehouse_location: string | null;
  createdAt?: string;
  updatedAt?: string;
  product?: InventoryProductApiRecord;
  company?: {
    id: number;
    name: string;
    email: string;
  };
};

export type InventoryListParams = {
  page?: number;
  limit?: number;
  search?: string;
  low_stock?: boolean | string;
  company_id?: number;
};

export type InventoryListResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: InventoryApiRecord[];
};

export type UpdateInventoryPayload = {
  quantity?: number;
  minimum_stock?: number;
  maximum_stock?: number;
  warehouse_location?: string;
};

export type AdjustInventoryPayload = {
  adjustment: number;
};

export async function fetchInventoryApi(params?: InventoryListParams) {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params?.low_stock === true || params?.low_stock === "true") {
    searchParams.set("low_stock", "true");
  }

  if (params?.company_id) {
    searchParams.set("company_id", String(params.company_id));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/inventory?${query}` : "/inventory";

  const result = await apiRequest<InventoryListResponse | InventoryApiRecord[]>({
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

export async function fetchInventoryByIdApi(id: string | number) {
  return apiRequest<InventoryApiRecord>({
    endpoint: `/inventory/${id}`,
    method: "GET",
  });
}

export async function updateInventoryApi(
  id: string | number,
  payload: UpdateInventoryPayload
) {
  return apiRequest<InventoryApiRecord>({
    endpoint: `/inventory/${id}`,
    method: "PUT",
    body: payload,
  });
}

export async function adjustInventoryApi(
  id: string | number,
  payload: AdjustInventoryPayload
) {
  return apiRequest<InventoryApiRecord>({
    endpoint: `/inventory/${id}/adjust`,
    method: "PATCH",
    body: payload,
  });
}
