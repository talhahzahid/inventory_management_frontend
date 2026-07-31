import type { CategoriesListParams } from "@/lib/api/categories";

export type CategoryFilterInput = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  companyId?: string;
};

export function buildCategoryListParams(
  filters: CategoryFilterInput
): CategoriesListParams {
  const params: CategoriesListParams = {};

  if (filters.page) {
    params.page = filters.page;
  }

  if (filters.limit) {
    params.limit = filters.limit;
  }

  const trimmedSearch = filters.search?.trim();
  if (trimmedSearch) {
    params.search = trimmedSearch;
  }

  if (filters.status && filters.status !== "all") {
    params.status = filters.status;
  }

  if (filters.companyId && filters.companyId !== "all") {
    params.company_id = Number(filters.companyId);
  }

  return params;
}
