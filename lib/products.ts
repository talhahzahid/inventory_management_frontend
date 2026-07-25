import { mockProducts } from "@/data/mock-products";
import type { AddProductFormValues } from "@/schema/productSchema";
import type { Product } from "@/types/product";

const MOCK_DELAY_MS = 900;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchProducts(): Promise<Product[]> {
  await wait(MOCK_DELAY_MS);
  return mockProducts;
}

export async function createProduct(
  values: AddProductFormValues
): Promise<Product> {
  await wait(MOCK_DELAY_MS);

  return {
    id: crypto.randomUUID(),
    sku: values.sku,
    name: values.name,
    category: values.category,
    supplier: values.supplier,
    price: values.price,
    stock: values.stock,
    status: values.status,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}
