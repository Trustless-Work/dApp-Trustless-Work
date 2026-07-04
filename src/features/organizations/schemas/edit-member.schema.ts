import { z } from "zod/v3";

export const editMemberSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
});

export type EditMemberFormData = z.infer<typeof editMemberSchema>;
