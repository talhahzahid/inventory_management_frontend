import { mockCategories } from "@/data/mock-categories";
import type { AddCategoryFormValues } from "@/schema/categorySchema";
import type { Category } from "@/types/category";

const MOCK_DELAY_MS = 900;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchCategories(): Promise<Category[]> {
  await wait(MOCK_DELAY_MS);
  return mockCategories;
}

export async function createCategory(
  values: AddCategoryFormValues
): Promise<Category> {
  await wait(MOCK_DELAY_MS);

  return {
    id: crypto.randomUUID(),
    name: values.name,
    slug: values.slug,
    description: values.description || undefined,
    productCount: 0,
    status: values.status,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}
