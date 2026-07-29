import { z } from "zod";

export const addSupplierSchema = z.object({
  name: z.string().trim().min(2, "Supplier name must be at least 2 characters"),
  phone: z.string().trim().min(5, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email address"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  status: z.enum(["active", "inactive"]),
});

export type AddSupplierFormValues = z.infer<typeof addSupplierSchema>;
