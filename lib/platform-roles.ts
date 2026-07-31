import {
  createRoleApi,
  fetchRoleByIdApi,
  fetchRolesApi,
  type RoleApiRecord,
  type RolesListParams,
} from "@/lib/api/roles";
import type { AddPlatformRoleFormValues } from "@/schema/platformRoleSchema";
import type { PlatformRole } from "@/types/platform-role";

function formatDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

export function mapRoleFromApi(record: RoleApiRecord): PlatformRole {
  return {
    id: String(record.id),
    name: record.name,
    description: record.description,
    createdAt: formatDate(record.createdAt),
    updatedAt: formatDate(record.updatedAt),
  };
}

export type RolesListResult = {
  roles: PlatformRole[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchPlatformRolesList(
  params?: RolesListParams
): Promise<RolesListResult> {
  const result = await fetchRolesApi({
    page: 1,
    limit: 10,
    ...params,
  });

  return {
    roles: result.data.map(mapRoleFromApi),
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  };
}

export async function fetchPlatformRoleById(id: string): Promise<PlatformRole> {
  const role = await fetchRoleByIdApi(id);
  return mapRoleFromApi(role);
}

export async function createPlatformRole(
  values: AddPlatformRoleFormValues
): Promise<PlatformRole> {
  const role = await createRoleApi({
    name: values.name,
    description: values.description || undefined,
  });

  return mapRoleFromApi(role);
}
