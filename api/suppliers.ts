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
  company_id?: number;
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

  if (params?.company_id) {
    searchParams.set("company_id", String(params.company_id));
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

export async function createSupplierApi(
  payload: CreateSupplierPayload,
  companyId?: number
) {
  const query = companyId ? `?company_id=${companyId}` : "";

  return apiRequest<SupplierApiRecord>({
    endpoint: `/supplier/create${query}`,
    method: "POST",
    body: payload,
  });
}

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

export async function updateSupplierApi(
  id: string | number,
  payload: UpdateSupplierPayload
) {
  return apiRequest<SupplierApiRecord>({
    endpoint: `/supplier/${id}`,
    method: "PUT",
    body: payload,
  });
}

export async function deactivateSupplierApi(id: string | number) {
  return apiRequest<SupplierApiRecord>({
    endpoint: `/supplier/${id}`,
    method: "DELETE",
  });
}
