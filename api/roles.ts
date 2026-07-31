import { apiRequest } from "@/api/api";
import type { PlatformRoleName } from "@/types/platform-role";

export type RoleApiRecord = {
  id: number;
  name: PlatformRoleName;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateRolePayload = {
  name: PlatformRoleName;
  description?: string;
};

export type RolesListParams = {
  page?: number;
  limit?: number;
};

export type RolesListResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: RoleApiRecord[];
};

export async function fetchRolesApi(params?: RolesListParams) {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const endpoint = query ? `/roles?${query}` : "/roles";

  const result = await apiRequest<RolesListResponse | RoleApiRecord[]>({
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

export async function fetchRoleByIdApi(id: string | number) {
  return apiRequest<RoleApiRecord>({
    endpoint: `/roles/${id}`,
    method: "GET",
  });
}

export async function createRoleApi(payload: CreateRolePayload) {
  return apiRequest<RoleApiRecord>({
    endpoint: "/roles/create",
    method: "POST",
    body: payload,
  });
}
