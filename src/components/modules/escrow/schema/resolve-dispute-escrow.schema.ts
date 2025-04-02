import { z } from "zod";

export const getFormSchema = () => {
  return z.object({
    approverFunds: z
      .string()
      .min(1, {
        message: "Approver funds is required.",
      })
      .refine((value) => !isNaN(Number(value)), {
        message: "Approver funds must be a valid number.",
      }),
    serviceProviderFunds: z
      .string()
      .min(1, {
        message: "Service Provider funds is required.",
      })
      .refine((value) => !isNaN(Number(value)), {
        message: "Service Provider funds must be a valid number.",
      }),
  });
};
