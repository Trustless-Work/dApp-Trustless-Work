import { z } from "zod";

export const formSchema = z.object({
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: "Milestone description is required.",
        }),
        status: z.string(),
        evidence: z.string().optional(),
        flags: z
          .object({
            approved: z.boolean().optional(),
            disputed: z.boolean().optional(),
          })
          .optional(),
      }),
    )
    .min(1, { message: "At least one milestone is required." }),
});
