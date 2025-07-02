import { z } from "zod";

export const formSchemaSingle = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  engagementId: z.string().min(1, {
    message: "Engagement is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long.",
  }),
  platformFee: z
    .number()
    .min(1, {
      message: "Platform fee is required.",
    })
    .refine(
      (val) => {
        const decimalPlaces = (val.toString().split(".")[1] || "").length;
        return decimalPlaces <= 2;
      },
      {
        message: "Platform fee can have a maximum of 2 decimal places.",
      },
    ),
  amount: z
    .number()
    .min(1, {
      message: "Amount is required.",
    })
    .refine(
      (val) => {
        const decimalPlaces = (val.toString().split(".")[1] || "").length;
        return decimalPlaces <= 2;
      },
      {
        message: "Amount can have a maximum of 2 decimal places.",
      },
    ),
  receiverMemo: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 1, {
      message: "Receiver Memo must be at least 1.",
    })
    .refine((val) => !val || /^[1-9][0-9]*$/.test(val), {
      message:
        "Receiver Memo must be a whole number greater than 0 (no decimals).",
    }),
});

export const formSchemaMulti = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  engagementId: z.string().min(1, {
    message: "Engagement is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long.",
  }),
  platformFee: z
    .number()
    .min(1, {
      message: "Platform fee is required.",
    })
    .refine(
      (val) => {
        const decimalPlaces = (val.toString().split(".")[1] || "").length;
        return decimalPlaces <= 2;
      },
      {
        message: "Platform fee can have a maximum of 2 decimal places.",
      },
    ),
  receiverMemo: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 1, {
      message: "Receiver Memo must be at least 1.",
    })
    .refine((val) => !val || /^[1-9][0-9]*$/.test(val), {
      message:
        "Receiver Memo must be a whole number greater than 0 (no decimals).",
    }),
});
