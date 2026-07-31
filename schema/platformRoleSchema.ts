import { z } from "zod";

export const addPlatformRoleSchema = z.object({
  name: z.enum(["superAdmin", "admin", "manager", "employee"], {
    error: "Please select a role",
  }),
  description: z.string().trim().optional(),
});

export type AddPlatformRoleFormValues = z.infer<typeof addPlatformRoleSchema>;
