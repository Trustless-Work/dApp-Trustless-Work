import { z } from "zod";

export const formSchema = z.object({
  amount: z
    .string()
    .min(1, {
      message: "Amount is required.",
    })
    .regex(/^[1-9][0-9]*$/, {
      message: "Amount must be a number greater than 0.",
    }),
});
