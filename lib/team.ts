import {
  createUserApi,
  fetchUsersApi,
  type UserApiRecord,
  type UsersListParams,
} from "@/api/users";
import type { AddStaffFormValues } from "@/schema/staffSchema";
import type { StaffMember, StaffStatus } from "@/types/team";

function formatDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

function mapStaffStatus(status: string): StaffStatus {
  if (status === "active" || status === "invited" || status === "inactive") {
    return status;
  }

  return "inactive";
}

export function mapUserFromApi(record: UserApiRecord): StaffMember {
  return {
    id: String(record.id),
    name: record.name,
    email: record.email,
    roleId: record.role_id,
    roleName: record.role?.name,
    status: mapStaffStatus(record.status),
    joinedAt: formatDate(record.createdAt),
    updatedAt: formatDate(record.updatedAt),
    companyId: record.company_id,
    companyName: record.company?.name,
  };
}

export function formatRoleName(roleName?: string) {
  if (!roleName) return "—";
  return roleName.charAt(0).toUpperCase() + roleName.slice(1);
}

export type StaffListResult = {
  staff: StaffMember[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchStaffList(
  params?: UsersListParams
): Promise<StaffListResult> {
  const result = await fetchUsersApi({
    page: 1,
    limit: 10,
    ...params,
  });

  return {
    staff: result.data.map(mapUserFromApi),
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  };
}

export async function fetchStaff(): Promise<StaffMember[]> {
  const result = await fetchStaffList();
  return result.staff;
}

export async function createStaffMember(
  values: AddStaffFormValues
): Promise<void> {
  await createUserApi({
    name: values.name,
    email: values.email,
    password: values.password,
    role_id: Number(values.role_id),
    status: values.status,
  });
}
