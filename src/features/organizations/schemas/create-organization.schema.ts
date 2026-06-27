import { z } from "zod/v3";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Organization name is required")
    .max(100, "Organization name must be 100 characters or less"),
});

export type CreateOrganizationFormData = z.infer<
  typeof createOrganizationSchema
>;
