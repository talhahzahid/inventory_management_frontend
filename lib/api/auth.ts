import { apiRequest } from "@/lib/api/api";

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export async function   changePasswordApi(payload: ChangePasswordPayload) {
  return apiRequest<null>({
    endpoint: "/auth/change-password",
    method: "PATCH",
    body: payload,
  });
}
