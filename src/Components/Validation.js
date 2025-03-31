import { z } from "zod";

export const userValidationSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().min(1, "Middle Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  contact: z.string().min(1, "Contact is required"),
  // image: z
  //   .instanceof(FileList)
  //   .refine((files) => files.length === 0 || files.length === 1, {
  //     message: "Profile Image is required",
  //   })
  //   .optional(),
  role: z.enum(["buyer", "seller"], { required_error: "Role is required" }),
  shopName: z.string().optional(),
});

export const userValidationSchemaForLogin = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  // .refine((password) => /[A-Z]/.test(password), {
  //   message: "Password must contain at least one uppercase letter",
  // })
  // .refine((password) => /\d/.test(password), {
  //   message: "Password must contain at least one number",
  // }),
});
