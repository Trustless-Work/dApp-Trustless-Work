import { z } from "zod";

export const getFormSchema = () => {
  return z.object({
    approverFunds: z
      .number()
      .min(0, {
        message: "Approver funds must be 0 or greater.",
      })
      .refine((val) => val % 1 === 0, {
        message: "Approver funds must be a whole number.",
      }),
    receiverFunds: z
      .number()
      .min(0, {
        message: "Receiver funds must be 0 or greater.",
      })
      .refine((val) => val % 1 === 0, {
        message: "Receiver funds must be a whole number.",
      }),
  });
};
