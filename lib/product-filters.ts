import type { ProductsListParams } from "@/lib/api/products";

export type ProductFilterInput = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  supplierId?: string;
  companyId?: string;
};

export function buildProductListParams(
  filters: ProductFilterInput
): ProductsListParams {
  const params: ProductsListParams = {};

  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const trimmedSearch = filters.search?.trim();
  if (trimmedSearch) params.search = trimmedSearch;

  if (filters.status && filters.status !== "all") {
    params.status = filters.status;
  }

  if (filters.categoryId && filters.categoryId !== "all") {
    params.category_id = Number(filters.categoryId);
  }

  if (filters.supplierId && filters.supplierId !== "all") {
    params.supplier_id = Number(filters.supplierId);
  }

  if (filters.companyId && filters.companyId !== "all") {
    params.company_id = Number(filters.companyId);
  }

  return params;
}
