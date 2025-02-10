import { z } from "zod";

export const formSchema = z
  .object({
    amount: z
      .string()
      .min(1, {
        message: "Amount is required.",
      })
      .regex(/^[1-9][0-9]*$/, {
        message: "Amount must be a number greater than 0.",
      }),
    paymentMethod: z.string().nonempty({
      message: "Payment method is required.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "card" && parseInt(data.amount, 10) < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message:
          "For card payments by Moonpay, the amount must be at least $20.",
      });
    }
  });
