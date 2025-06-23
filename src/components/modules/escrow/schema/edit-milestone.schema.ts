import { z } from "zod";

export const formSchemaSingle = z.object({
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: "Milestone description is required.",
        }),
        status: z.string(),
        evidence: z.string().optional(),
        approved: z.boolean().optional(),
      }),
    )
    .min(1, { message: "At least one milestone is required." }),
});

export const formSchemaMulti = z.object({
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: "Milestone description is required.",
        }),
        status: z.string(),
        amount: z
          .number()
          .min(1, {
            message: "Milestone amount is required.",
          })
          .refine((val) => val % 1 === 0, {
            message: "Milestone amount must be a whole number.",
          }),
        evidence: z.string().optional(),
        flags: z
          .object({
            approved: z.boolean().optional(),
            disputed: z.boolean().optional(),
            released: z.boolean().optional(),
            resolved: z.boolean().optional(),
          })
          .optional(),
      }),
    )
    .min(1, { message: "At least one milestone is required." }),
});
