import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),

  password: z
    .string()
    .regex(
      passwordRegex,
      "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
    ),
});
