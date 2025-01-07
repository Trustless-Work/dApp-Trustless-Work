import { z } from "zod";

export const formSchema = z.object({
  amount: z.string().min(1, {
    message: "Amount is required.",
  }),
});
