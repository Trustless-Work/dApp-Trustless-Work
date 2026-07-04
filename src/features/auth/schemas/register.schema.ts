import { z } from "zod/v3";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name must be 100 characters or less"),
  lastName: z
    .string()
    .trim()
    .max(100, "Last name must be 100 characters or less"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address (e.g. name@example.com)"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
