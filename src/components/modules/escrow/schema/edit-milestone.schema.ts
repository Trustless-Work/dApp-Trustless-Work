import { z } from "zod";

export const formSchema = z.object({
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: "Milestone description is required.",
        }),
      }),
    )
    .min(1, { message: "At least one milestone is required." }),
});
