import { mockPlatformRoles } from "@/data/mock-platform-roles";
import type { AddPlatformRoleFormValues } from "@/schema/platformRoleSchema";
import type { PlatformRole } from "@/types/platform-role";

const MOCK_DELAY_MS = 900;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPlatformRoles(): Promise<PlatformRole[]> {
  await wait(MOCK_DELAY_MS);
  return mockPlatformRoles;
}

export async function createPlatformRole(
  values: AddPlatformRoleFormValues
): Promise<PlatformRole> {
  await wait(MOCK_DELAY_MS);

  return {
    id: crypto.randomUUID(),
    name: values.name,
    slug: values.slug,
    description: values.description || undefined,
    scope: values.scope,
    userCount: 0,
    permissionCount: 0,
    status: values.status,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}
