import { mockCompanies } from "@/data/mock-companies";
import type { AddCompanyFormValues } from "@/schema/companySchema";
import type { Company } from "@/types/company";

const MOCK_DELAY_MS = 900;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchCompanies(): Promise<Company[]> {
  await wait(MOCK_DELAY_MS);
  return mockCompanies;
}

export async function createCompany(
  values: AddCompanyFormValues
): Promise<Company> {
  await wait(MOCK_DELAY_MS);

  return {
    id: crypto.randomUUID(),
    name: values.name,
    email: values.email,
    adminName: values.adminName,
    adminEmail: values.adminEmail,
    plan: values.plan,
    users: 1,
    status: values.status,
    joinedAt: new Date().toISOString().slice(0, 10),
  };
}
