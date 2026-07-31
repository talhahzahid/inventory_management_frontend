import type { InventoryListParams } from "@/lib/api/inventory";

export type InventoryFilterInput = {
  page?: number;
  limit?: number;
  search?: string;
  lowStock?: string;
  companyId?: string;
};

export function buildInventoryListParams(
  filters: InventoryFilterInput
): InventoryListParams {
  const params: InventoryListParams = {};

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

  if (filters.lowStock === "true") {
    params.low_stock = "true";
  }

  if (filters.companyId && filters.companyId !== "all") {
    params.company_id = Number(filters.companyId);
  }

  return params;
}
