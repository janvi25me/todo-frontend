import { z } from "zod";

export const userValidationSchema = z.object({
  name: z.string().min(3, "Name is required").optional(),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((password) => /\d/.test(password), {
      message: "Password must contain at least one number",
    }),
});
