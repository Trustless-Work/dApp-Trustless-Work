import { z } from "zod";

export const formSchema = z.object({
  contractId: z.string().min(1, {
    message: "Contract Identifier is required.",
  }),
  amount: z.string().min(1, {
    message: "Amount is required.",
  }),
  engagementId: z.string().min(1, {
    message: "Engagement is required.",
  }),
});
