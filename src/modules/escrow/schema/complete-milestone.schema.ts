import { z } from "zod";

export const formSchema = z.object({
  newEvidence: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 1, {
      message: "Evidence must be at least 5.",
    }),
});
