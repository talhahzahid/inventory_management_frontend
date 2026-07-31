import {
  createProductApi,
  deactivateProductApi,
  fetchProductByIdApi,
  fetchProductsApi,
  updateProductApi,
  type ProductApiRecord,
  type ProductsListParams,
} from "@/api/products";
import type { AddProductFormValues, EditProductFormValues } from "@/schema/productSchema";
import type { Product } from "@/types/product";

function formatDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

function parseDecimal(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function mapProductFromApi(record: ProductApiRecord): Product {
  return {
    id: String(record.id),
    companyId: record.company_id,
    categoryId: String(record.category_id),
    supplierId: String(record.supplier_id),
    sku: record.sku,
    name: record.name,
    description: record.description,
    purchasePrice: parseDecimal(record.purchase_price),
    sellingPrice: parseDecimal(record.selling_price),
    status: record.status,
    createdAt: formatDate(record.createdAt),
    updatedAt: formatDate(record.updatedAt),
    companyName: record.company?.name,
    companyEmail: record.company?.email,
    categoryName: record.category?.name,
    supplierName: record.supplier?.name,
    supplierEmail: record.supplier?.email,
    inventory: record.inventory
      ? {
          id: String(record.inventory.id),
          quantity: record.inventory.quantity,
          minimumStock: record.inventory.minimum_stock,
          maximumStock: record.inventory.maximum_stock,
          warehouseLocation: record.inventory.warehouse_location,
        }
      : undefined,
  };
}

export type ProductsListResult = {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchProductsList(
  params?: ProductsListParams
): Promise<ProductsListResult> {
  const result = await fetchProductsApi({
    page: 1,
    limit: 10,
    ...params,
  });

  return {
    products: result.data.map(mapProductFromApi),
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  };
}

export async function fetchProductById(id: string): Promise<Product> {
  const product = await fetchProductByIdApi(id);
  return mapProductFromApi(product);
}

export async function createProduct(
  values: AddProductFormValues
): Promise<Product> {
  const product = await createProductApi({
    category_id: Number(values.category_id),
    supplier_id: Number(values.supplier_id),
    sku: values.sku,
    name: values.name,
    description: values.description || undefined,
    purchase_price: values.purchase_price,
    selling_price: values.selling_price,
    status: values.status,
    quantity: values.quantity,
    minimum_stock: values.minimum_stock,
    maximum_stock: values.maximum_stock,
    warehouse_location: values.warehouse_location || undefined,
  });

  return mapProductFromApi(product);
}

export async function updateProduct(
  id: string,
  values: EditProductFormValues
): Promise<Product> {
  const product = await updateProductApi(id, {
    category_id: Number(values.category_id),
    supplier_id: Number(values.supplier_id),
    sku: values.sku,
    name: values.name,
    description: values.description || undefined,
    purchase_price: values.purchase_price,
    selling_price: values.selling_price,
    status: values.status,
  });

  return mapProductFromApi(product);
}

export async function deactivateProduct(id: string): Promise<Product> {
  const product = await deactivateProductApi(id);
  return mapProductFromApi(product);
}
