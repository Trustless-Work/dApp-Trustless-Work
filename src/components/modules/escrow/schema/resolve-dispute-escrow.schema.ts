import { z } from "zod";

export const getFormSchema = () => {
  return z.object({
    approverFunds: z
      .number()
      .min(0, {
        message: "Approver funds must be 0 or greater.",
      })
      .refine(
        (val) => {
          const decimalPlaces = (val.toString().split(".")[1] || "").length;
          return decimalPlaces <= 2;
        },
        {
          message: "Approver funds can have a maximum of 2 decimal places.",
        },
      ),
    receiverFunds: z
      .number()
      .min(0, {
        message: "Receiver funds must be 0 or greater.",
      })
      .refine(
        (val) => {
          const decimalPlaces = (val.toString().split(".")[1] || "").length;
          return decimalPlaces <= 2;
        },
        {
          message: "Receiver funds can have a maximum of 2 decimal places.",
        },
      ),
  });
};
