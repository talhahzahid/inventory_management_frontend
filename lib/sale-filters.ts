import type { SalesListParams } from "@/api/sales";

export type SaleFilterInput = {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  companyId?: string;
};

export function buildSaleListParams(filters: SaleFilterInput): SalesListParams {
  const params: SalesListParams = {};

  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const trimmedSearch = filters.search?.trim();
  if (trimmedSearch) params.search = trimmedSearch;

  if (filters.fromDate) params.from_date = filters.fromDate;
  if (filters.toDate) params.to_date = filters.toDate;

  if (filters.companyId && filters.companyId !== "all") {
    params.company_id = Number(filters.companyId);
  }

  return params;
}
