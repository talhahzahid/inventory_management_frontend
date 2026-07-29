import { z } from "zod";

export const addStaffSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role_id: z.string().min(1, "Please select a role"),
  status: z.enum(["active", "inactive"]),
});

export type AddStaffFormValues = z.infer<typeof addStaffSchema>;
