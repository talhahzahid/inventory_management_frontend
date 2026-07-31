import {
  createSupplierApi,
  deactivateSupplierApi,
  fetchSuppliersApi,
  updateSupplierApi,
  type SupplierApiRecord,
  type SuppliersListParams,
} from "@/lib/api/suppliers";
import type { AddSupplierFormValues } from "@/schema/supplierSchema";
import type { Supplier } from "@/types/supplier";

function formatDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

export function mapSupplierFromApi(record: SupplierApiRecord): Supplier {
  return {
    id: String(record.id),
    name: record.name,
    phone: record.phone,
    email: record.email,
    address: record.address,
    status: record.status,
    createdAt: formatDate(record.createdAt),
    updatedAt: formatDate(record.updatedAt),
    companyId: record.company_id,
  };
}

export type SuppliersListResult = {
  suppliers: Supplier[];
  total: number;
  page: number;
  limit: number;
  totalPages: number | null;
};

export async function fetchSuppliersList(
  params?: SuppliersListParams
): Promise<SuppliersListResult> {
  const result = await fetchSuppliersApi({
    page: 1,
    limit: 10,
    ...params,
  });

  return {
    suppliers: result.data.map(mapSupplierFromApi),
    total: result.total ?? result.data.length,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  };
}

export async function createSupplier(
  values: AddSupplierFormValues,
  companyId?: number
): Promise<Supplier> {
  const supplier = await createSupplierApi(
    {
      name: values.name,
      phone: values.phone,
      email: values.email,
      address: values.address,
      status: values.status,
    },
    companyId
  );

  return mapSupplierFromApi(supplier);
}

export async function updateSupplier(
  id: string,
  values: AddSupplierFormValues
): Promise<Supplier> {
  const supplier = await updateSupplierApi(id, {
    name: values.name,
    phone: values.phone,
    email: values.email,
    address: values.address,
    status: values.status,
  });

  return mapSupplierFromApi(supplier);
}

export async function deactivateSupplier(id: string): Promise<Supplier> {
  const supplier = await deactivateSupplierApi(id);
  return mapSupplierFromApi(supplier);
}
