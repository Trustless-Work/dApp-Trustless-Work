import { z } from "zod";
import { isValidWallet } from "../../../../wallet-kit/validators";

export const getFormSchema = () => {
  const amountSchema = z
    .union([z.string(), z.number()])
    .refine(
      (val) => {
        if (typeof val === "string") {
          if (val === "" || val === "." || val.endsWith(".")) {
            return true; // Allow partial input
          }
          const numVal = Number(val);
          return !isNaN(numVal) && numVal >= 0;
        }
        return val >= 0;
      },
      { message: "Amount must be 0 or greater." }
    )
    .refine(
      (val) => {
        if (typeof val === "string") {
          if (val === "" || val === "." || val.endsWith(".")) {
            return true; // Allow partial input
          }
          const numVal = Number(val);
          if (isNaN(numVal)) return false;
          const decimalPlaces = (numVal.toString().split(".")[1] || "").length;
          return decimalPlaces <= 2;
        }
        const decimalPlaces = (val.toString().split(".")[1] || "").length;
        return decimalPlaces <= 2;
      },
      { message: "Amount can have a maximum of 2 decimal places." }
    );

  return z
    .object({
      distributions: z
        .array(
          z.object({
            address: z
              .string()
              .min(1, { message: "Address is required." })
              .refine((addr) => isValidWallet(addr), {
                message: "Invalid Stellar address.",
              }),
            amount: amountSchema,
          })
        )
        .min(2, { message: "At least two distributions are required." }),
      milestoneIndex: z
        .string({ required_error: "Milestone is required" })
        .min(1, { message: "Milestone is required" }),
    })
    .superRefine((data, ctx) => {
      const seen = new Map<string, number>();
      data.distributions.forEach((item, idx) => {
        const key = (item.address || "").trim().toUpperCase();
        if (!key) return;
        if (seen.has(key)) {
          const firstIdx = seen.get(key)!;
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["distributions", idx, "address"],
            message: "Duplicate address. Each recipient must be unique.",
          });
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["distributions", firstIdx, "address"],
            message: "Duplicate address. Each recipient must be unique.",
          });
        } else {
          seen.set(key, idx);
        }
      });
    });
};

export const resolveDisputeSchema = getFormSchema();

export type ResolveDisputeValues = z.infer<typeof resolveDisputeSchema>;
