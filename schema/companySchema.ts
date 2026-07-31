import { z } from "zod";

export const addCompanySchema = z.object({
  name: z.string().trim().min(2, "Company name must be at least 2 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  email: z.string().trim().email("Enter a valid company email"),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  logo: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]),
});

export type AddCompanyFormValues = z.infer<typeof addCompanySchema>;
export type EditCompanyFormValues = AddCompanyFormValues;
