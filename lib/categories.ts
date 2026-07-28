import {
  createCategoryApi,
  deactivateCategoryApi,
  fetchCategoriesApi,
  fetchCategoryByIdApi,
  updateCategoryApi,
  type CategoriesListParams,
  type CategoryApiRecord,
} from "@/api/categories";
import { getSession } from "@/lib/auth";
import type { AddCategoryFormValues } from "@/schema/categorySchema";
import type { Category } from "@/types/category";

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function formatDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

export function mapCategoryFromApi(record: CategoryApiRecord): Category {
  return {
    id: String(record.id),
    name: record.name,
    slug: slugify(record.name),
    description: record.description ?? undefined,
    productCount: 0,
    status: record.status,
    createdAt: formatDate(record.createdAt),
    updatedAt: formatDate(record.updatedAt),
    companyId: record.company_id,
    companyName: record.company?.name,
    companyEmail: record.company?.email,
  };
}

export async function fetchCategories(
  params?: CategoriesListParams
): Promise<Category[]> {
  const result = await fetchCategoriesApi({
    page: 1,
    limit: 100,
    ...params,
  });

  return result.data.map(mapCategoryFromApi);
}

export async function fetchCategoryById(id: string): Promise<Category> {
  const category = await fetchCategoryByIdApi(id);
  return mapCategoryFromApi(category);
}

export async function createCategory(
  values: AddCategoryFormValues
): Promise<Category> {
  const session = getSession();

  if (!session?.company_id) {
    throw new Error("Company not found in session. Please sign in again.");
  }

  const category = await createCategoryApi({
    company_id: session.company_id,
    name: values.name,
    description: values.description || undefined,
    status: values.status,
  });

  return mapCategoryFromApi(category);
}

export async function updateCategory(
  id: string,
  values: AddCategoryFormValues
): Promise<Category> {
  const category = await updateCategoryApi(id, {
    name: values.name,
    description: values.description || undefined,
    status: values.status,
  });

  return mapCategoryFromApi(category);
}

export async function deactivateCategory(id: string): Promise<Category> {
  const category = await deactivateCategoryApi(id);
  return mapCategoryFromApi(category);
}
