import { z } from "zod";

export const addStaffSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional(),
  department: z.string().min(1, "Please select a department"),
  status: z.enum(["active", "invited"]),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
});

export type AddStaffFormValues = z.infer<typeof addStaffSchema>;
