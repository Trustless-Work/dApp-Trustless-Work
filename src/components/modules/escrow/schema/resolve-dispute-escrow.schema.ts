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
    receiverFunds: z
      .string()
      .min(1, {
        message: "Receiver funds is required.",
      })
      .refine((value) => !isNaN(Number(value)), {
        message: "Receiver funds must be a valid number.",
      }),
  });
};
