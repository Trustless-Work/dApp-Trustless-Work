import { z } from "zod";

export const formSchema = z
  .object({
    amount: z
      .union([z.string(), z.number()])
      .refine(
        (val) => {
          // Allow partial input like "0." or "0.5"
          if (typeof val === "string") {
            if (val === "" || val === "." || val.endsWith(".")) {
              return true; // Allow partial input
            }
            const numVal = Number(val);
            return !isNaN(numVal) && numVal > 0;
          }
          return val > 0;
        },
        {
          message: "Amount must be greater than 0.",
        },
      )
      .refine(
        (val) => {
          if (typeof val === "string") {
            if (val === "" || val === "." || val.endsWith(".")) {
              return true; // Allow partial input
            }
            const numVal = Number(val);
            if (isNaN(numVal)) return false;
            const decimalPlaces = (numVal.toString().split(".")[1] || "")
              .length;
            return decimalPlaces <= 2;
          }
          const decimalPlaces = (val.toString().split(".")[1] || "").length;
          return decimalPlaces <= 2;
        },
        {
          message: "Amount can have a maximum of 2 decimal places.",
        },
      ),
    paymentMethod: z.string().nonempty({
      message: "Payment method is required.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "card") {
      const amount =
        typeof data.amount === "string" ? Number(data.amount) : data.amount;
      if (isNaN(amount) || amount < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["amount"],
          message:
            "For card payments by Moonpay, the amount must be at least $20.",
        });
      }
    }
  });
