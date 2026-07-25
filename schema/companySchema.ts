import { z } from "zod";

export const addCompanySchema = z.object({
  name: z.string().trim().min(2, "Company name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid company email"),
  adminName: z.string().trim().min(2, "Admin name is required"),
  adminEmail: z.string().trim().email("Enter a valid admin email"),
  plan: z.enum(["starter", "pro", "enterprise"]),
  status: z.enum(["active", "trial", "inactive"]),
});

export type AddCompanyFormValues = z.infer<typeof addCompanySchema>;
