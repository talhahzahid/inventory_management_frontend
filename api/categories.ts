import { apiRequest } from "@/api/api";
import type { CategoryStatus } from "@/types/category";

export type CreateCategoryPayload = {
  company_id: number;
  name: string;
  description?: string;
  status: CategoryStatus;
};

export type CategoryApiRecord = {
  id: number;
  company_id: number;
  name: string;
  description?: string | null;
  status: CategoryStatus;
  createdAt?: string;
  updatedAt?: string;
  company?: {
    id: number;
    name: string;
    email: string;
  };
};

export type CategoriesListParams = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  company_id?: number;
};

export type CategoriesListResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: CategoryApiRecord[];
};

export async function fetchCategoriesApi(params?: CategoriesListParams) {
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
  const endpoint = query ? `/categories?${query}` : "/categories";

  const result = await apiRequest<
    CategoriesListResponse | CategoryApiRecord[]
  >({
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

export type UpdateCategoryPayload = {
  name?: string;
  description?: string;
  status?: CategoryStatus;
};

export async function fetchCategoryByIdApi(id: string | number) {
  return apiRequest<CategoryApiRecord>({
    endpoint: `/categories/${id}`,
    method: "GET",
  });
}

export async function createCategoryApi(payload: CreateCategoryPayload) {
  return apiRequest<CategoryApiRecord>({
    endpoint: "/categories/create",
    method: "POST",
    body: payload,
  });
}

export async function updateCategoryApi(
  id: string | number,
  payload: UpdateCategoryPayload
) {
  return apiRequest<CategoryApiRecord>({
    endpoint: `/categories/${id}`,
    method: "PUT",
    body: payload,
  });
}

export async function deactivateCategoryApi(id: string | number) {
  return apiRequest<CategoryApiRecord>({
    endpoint: `/categories/${id}`,
    method: "DELETE",
  });
}
