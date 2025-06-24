import { z } from "zod";

export const getFormSchema = () => {
  return z.object({
    approverFunds: z
      .number()
      .min(1, {
        message: "Approver funds is required.",
      })
      .refine((val) => val % 1 === 0, {
        message: "Approver funds be a whole number.",
      }),
    receiverFunds: z
      .number()
      .min(1, {
        message: "Receiver funds is required.",
      })
      .refine((val) => val % 1 === 0, {
        message: "Receiver funds be a whole number.",
      }),
  });
};
