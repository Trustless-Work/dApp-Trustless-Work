import { z } from "zod";

export const formSchema = z.object({
  newStatus: z
    .string()
    .min(5, { message: "Status must be at least 5 characters." })
    .refine((val) => !val || val.length >= 1, {
      message: "Status must be at least 5.",
    }),
  newEvidence: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 1, {
      message: "Evidence must be at least 5.",
    }),
});
