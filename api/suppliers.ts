import { apiRequest } from "@/api/api";
import type { SupplierStatus } from "@/types/supplier";

export type CreateSupplierPayload = {
  name: string;
  phone: string;
  email: string;
  address: string;
  status: SupplierStatus;
};

export type SupplierApiRecord = {
  id: number;
  company_id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: SupplierStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type SuppliersListParams = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
};

export type SuppliersListResponse = {
  page: number;
  limit: number;
  totalPages: number | null;
  total?: number;
  data: SupplierApiRecord[];
};

export async function fetchSuppliersApi(params?: SuppliersListParams) {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  if (params?.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  const query = searchParams.toString();
  const endpoint = query ? `/supplier?${query}` : "/supplier";

  const result = await apiRequest<
    SuppliersListResponse | SupplierApiRecord[]
  >({
    endpoint,
    method: "GET",
  });

  if (Array.isArray(result)) {
    return {
      page: 1,
      limit: result.length,
      totalPages: 1,
      total: result.length,
      data: result,
    };
  }

  return {
    ...result,
    total: result.total ?? result.data.length,
  };
}

export async function createSupplierApi(payload: CreateSupplierPayload) {
  return apiRequest<SupplierApiRecord>({
    endpoint: "/supplier/create",
    method: "POST",
    body: payload,
  });
}
