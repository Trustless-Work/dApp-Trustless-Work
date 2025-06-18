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

export const formSchemaMulti = z.object({
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: "Milestone description is required.",
        }),
        status: z.string(),
        amount: z
          .string()
          .min(1, {
            message: "Milestone amount is required.",
          })
          .regex(/^[1-9][0-9]*$/, {
            message:
              "Milestone amount must be a whole number greater than 0 (no decimals).",
          }),
        evidence: z.string().optional(),
      }),
    )
    .min(1, { message: "At least one milestone is required." }),
});
