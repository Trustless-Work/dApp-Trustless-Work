import { z } from "zod";

export const formSchema = z.object({
  clientFunds: z.string().min(1, {
    message: "Client funds is required.",
  }),
  serviceProviderFunds: z.string().min(1, {
    message: "Service Provider funds is required.",
  }),
});
