import type { SuppliersListParams } from "@/api/suppliers";

export type SupplierFilterInput = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  companyId?: string;
};

export function buildSupplierListParams(
  filters: SupplierFilterInput
): SuppliersListParams {
  const params: SuppliersListParams = {};

  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const trimmedSearch = filters.search?.trim();
  if (trimmedSearch) params.search = trimmedSearch;

  if (filters.status && filters.status !== "all") {
    params.status = filters.status;
  }

  if (filters.companyId && filters.companyId !== "all") {
    params.company_id = Number(filters.companyId);
  }

  return params;
}
