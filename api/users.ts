import { apiRequest } from "@/api/api";
import type { StaffStatus } from "@/types/team";

export type UserApiRecord = {
  id: number;
  company_id: number;
  name: string;
  email: string;
  role_id: number;
  status: StaffStatus;
  createdAt?: string;
  updatedAt?: string;
  company?: {
    id: number;
    name: string;
    email: string;
  };
  role?: {
    id: number;
    name: string;
  };
};

export type UsersListParams = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
};

export type UsersListResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: UserApiRecord[];
};

export async function fetchUsersApi(params?: UsersListParams) {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  if (params?.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  const query = searchParams.toString();
  const endpoint = query ? `/users?${query}` : "/users";

  const result = await apiRequest<UsersListResponse | UserApiRecord[]>({
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

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role_id: number;
  status: "active" | "inactive";
};

export async function createUserApi(payload: CreateUserPayload) {
  return apiRequest<UserApiRecord | null>({
    endpoint: "/users/create",
    method: "POST",
    body: payload,
  });
}
