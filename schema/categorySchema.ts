import { z } from "zod";

export const addCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]),
});

export type AddCategoryFormValues = z.infer<typeof addCategorySchema>;
