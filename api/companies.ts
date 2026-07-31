import { apiRequest } from "@/api/api";
import type { CompanyStatus } from "@/types/company";

export type CompanyApiRecord = {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  logo?: string | null;
  status: CompanyStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCompanyPayload = {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  status: CompanyStatus;
};

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;

export type CompaniesListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type CompaniesListResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: CompanyApiRecord[];
};

export async function fetchCompaniesApi(params?: CompaniesListParams) {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search?.trim()) searchParams.set("search", params.search.trim());
  if (params?.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  const query = searchParams.toString();
  const endpoint = query ? `/companies?${query}` : "/companies";

  const result = await apiRequest<CompaniesListResponse | CompanyApiRecord[]>({
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

export async function fetchCompanyByIdApi(id: string | number) {
  return apiRequest<CompanyApiRecord>({
    endpoint: `/companies/${id}`,
    method: "GET",
  });
}

export async function createCompanyApi(payload: CreateCompanyPayload) {
  return apiRequest<CompanyApiRecord>({
    endpoint: "/companies/create",
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function updateCompanyApi(
  id: string | number,
  payload: UpdateCompanyPayload
) {
  return apiRequest<CompanyApiRecord>({
    endpoint: `/companies/${id}`,
    method: "PUT",
    body: payload,
  });
}

export async function deactivateCompanyApi(id: string | number) {
  return apiRequest<CompanyApiRecord>({
    endpoint: `/companies/${id}`,
    method: "DELETE",
  });
}
