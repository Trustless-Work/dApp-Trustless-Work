import { z } from "zod/v3";

export const createApiKeySchema = z.object({
  description: z
    .string()
    .trim()
    .max(200, "Description must be 200 characters or less"),
});

export type CreateApiKeyFormData = z.infer<typeof createApiKeySchema>;
