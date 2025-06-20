import { z } from "zod";

export const formSchema = z
  .object({
    amount: z
      .number()
      .min(1, {
        message: "Amount is required.",
      })
      .refine((val) => val % 1 === 0, {
        message: "Amount must be a whole number.",
      }),
    paymentMethod: z.string().nonempty({
      message: "Payment method is required.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "card" && data.amount < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message:
          "For card payments by Moonpay, the amount must be at least $20.",
      });
    }
  });
