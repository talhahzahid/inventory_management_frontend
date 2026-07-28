import { z } from "zod";

export const addCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters"),
  description: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]),
});

export type AddCategoryFormValues = z.infer<typeof addCategorySchema>;
