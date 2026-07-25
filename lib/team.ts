import { mockStaff } from "@/data/mock-staff";
import type { AddStaffFormValues } from "@/schema/staffSchema";
import type { StaffMember } from "@/types/team";

const MOCK_DELAY_MS = 900;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchStaff(): Promise<StaffMember[]> {
  await wait(MOCK_DELAY_MS);
  return mockStaff;
}

export async function createStaffMember(
  values: AddStaffFormValues
): Promise<StaffMember> {
  await wait(MOCK_DELAY_MS);

  return {
    id: crypto.randomUUID(),
    name: values.name,
    email: values.email,
    phone: values.phone || undefined,
    department: values.department,
    status: values.status,
    joinedAt: new Date().toISOString().slice(0, 10),
    lastActive: values.status === "active" ? new Date().toISOString().slice(0, 10) : undefined,
  };
}
