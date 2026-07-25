import { z } from "zod";

export const addPlatformRoleSchema = z.object({
  name: z.string().trim().min(2, "Role name must be at least 2 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().optional(),
  scope: z.enum(["platform", "company"]),
  status: z.enum(["active", "inactive"]),
});

export type AddPlatformRoleFormValues = z.infer<typeof addPlatformRoleSchema>;
