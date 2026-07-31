import {
  createCompanyApi,
  deactivateCompanyApi,
  fetchCompaniesApi,
  fetchCompanyByIdApi,
  updateCompanyApi,
  type CompaniesListParams,
  type CompanyApiRecord,
} from "@/api/companies";
import type { AddCompanyFormValues } from "@/schema/companySchema";
import type { Company } from "@/types/company";

function formatDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

export function mapCompanyFromApi(record: CompanyApiRecord): Company {
  return {
    id: String(record.id),
    name: record.name,
    slug: record.slug,
    email: record.email,
    phone: record.phone,
    address: record.address,
    logo: record.logo,
    status: record.status,
    createdAt: formatDate(record.createdAt),
    updatedAt: formatDate(record.updatedAt),
  };
}

export type CompaniesListResult = {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchCompaniesList(
  params?: CompaniesListParams
): Promise<CompaniesListResult> {
  const result = await fetchCompaniesApi({
    page: 1,
    limit: 10,
    ...params,
  });

  return {
    companies: result.data.map(mapCompanyFromApi),
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  };
}

export async function fetchCompanyById(id: string): Promise<Company> {
  const company = await fetchCompanyByIdApi(id);
  return mapCompanyFromApi(company);
}

export async function createCompany(
  values: AddCompanyFormValues
): Promise<Company> {
  const company = await createCompanyApi({
    name: values.name,
    slug: values.slug,
    email: values.email,
    phone: values.phone || undefined,
    address: values.address || undefined,
    logo: values.logo || undefined,
    status: values.status,
  });

  return mapCompanyFromApi(company);
}

export async function updateCompany(
  id: string,
  values: AddCompanyFormValues
): Promise<Company> {
  const company = await updateCompanyApi(id, {
    name: values.name,
    slug: values.slug,
    email: values.email,
    phone: values.phone || undefined,
    address: values.address || undefined,
    logo: values.logo || undefined,
    status: values.status,
  });

  return mapCompanyFromApi(company);
}

export async function deactivateCompany(id: string): Promise<Company> {
  const company = await deactivateCompanyApi(id);
  return mapCompanyFromApi(company);
}

/** Convenience for dropdowns — fetches a larger page of active companies */
export async function fetchCompanyOptions() {
  const result = await fetchCompaniesList({
    page: 1,
    limit: 100,
    status: "active",
  });

  return result.companies.map((company) => ({
    label: company.name,
    value: company.id,
  }));
}
