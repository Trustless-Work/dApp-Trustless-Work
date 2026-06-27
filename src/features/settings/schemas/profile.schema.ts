import { z } from "zod/v3";

function isValidEmail(value: string): boolean {
  return z.string().email().safeParse(value).success;
}

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name must be 100 characters or less"),
  lastName: z
    .string()
    .trim()
    .max(100, "Last name must be 100 characters or less"),
  email: z.string().superRefine((value, ctx) => {
    const trimmed = value.trim();

    if (trimmed === "") {
      return;
    }

    if (!trimmed.includes("@")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Include @ in your email (e.g. name@example.com)",
      });
      return;
    }

    if (!isValidEmail(trimmed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid email address (e.g. name@example.com)",
      });
    }
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export type UpdateProfileInput = {
  firstName: string;
  lastName?: string;
  email?: string;
};
