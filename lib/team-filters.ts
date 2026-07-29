import type { UsersListParams } from "@/api/users";

export type TeamFilterInput = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export function buildTeamListParams(
  filters: TeamFilterInput
): UsersListParams {
  const params: UsersListParams = {};

  if (filters.page) {
    params.page = filters.page;
  }

  if (filters.limit) {
    params.limit = filters.limit;
  }

  const trimmedSearch = filters.search?.trim();
  if (trimmedSearch) {
    params.search = trimmedSearch;
  }

  if (filters.status && filters.status !== "all") {
    params.status = filters.status;
  }

  return params;
}
