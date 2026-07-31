import { apiRequest } from "@/lib/api/api";
import type { ProductStatus } from "@/types/product";

export type ProductInventoryApiRecord = {
  id: number;
  quantity: number;
  minimum_stock: number;
  maximum_stock: number;
  warehouse_location: string | null;
};

export type ProductApiRecord = {
  id: number;
  company_id: number;
  category_id: number;
  supplier_id: number;
  sku: string;
  name: string;
  description: string | null;
  purchase_price: string;
  selling_price: string;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
  company?: {
    id: number;
    name: string;
    email: string;
  };
  category?: {
    id: number;
    name: string;
  };
  supplier?: {
    id: number;
    name: string;
    email: string;
  };
  inventory?: ProductInventoryApiRecord;
};

export type CreateProductPayload = {
  category_id: number;
  supplier_id: number;
  sku: string;
  name: string;
  description?: string;
  purchase_price: number;
  selling_price: number;
  status: ProductStatus;
  quantity: number;
  minimum_stock: number;
  maximum_stock: number;
  warehouse_location?: string;
};

export type UpdateProductPayload = {
  category_id?: number;
  supplier_id?: number;
  sku?: string;
  name?: string;
  description?: string;
  purchase_price?: number;
  selling_price?: number;
  status?: ProductStatus;
};

export type ProductsListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category_id?: number;
  supplier_id?: number;
  company_id?: number;
};

export type ProductsListResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: ProductApiRecord[];
};

export async function fetchProductsApi(params?: ProductsListParams) {
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

  if (params?.category_id) {
    searchParams.set("category_id", String(params.category_id));
  }

  if (params?.supplier_id) {
    searchParams.set("supplier_id", String(params.supplier_id));
  }

  if (params?.company_id) {
    searchParams.set("company_id", String(params.company_id));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/products?${query}` : "/products";

  const result = await apiRequest<ProductsListResponse | ProductApiRecord[]>({
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

export async function fetchProductByIdApi(id: string | number) {
  return apiRequest<ProductApiRecord>({
    endpoint: `/products/${id}`,
    method: "GET",
  });
}

export async function createProductApi(payload: CreateProductPayload) {
  return apiRequest<ProductApiRecord>({
    endpoint: "/products/create",
    method: "POST",
    body: payload,
  });
}

export async function updateProductApi(
  id: string | number,
  payload: UpdateProductPayload
) {
  return apiRequest<ProductApiRecord>({
    endpoint: `/products/${id}`,
    method: "PUT",
    body: payload,
  });
}

export async function deactivateProductApi(id: string | number) {
  return apiRequest<ProductApiRecord>({
    endpoint: `/products/${id}`,
    method: "DELETE",
  });
}
