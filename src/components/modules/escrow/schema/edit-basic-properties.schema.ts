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
    .string()
    .min(1, {
      message: "Platform fee is required.",
    })
    .regex(/^\d+(\.\d{1})?$/, {
      message: "Platform fee must be a number with at most one decimal place.",
    }),
  amount: z
    .string()
    .min(1, {
      message: "Amount is required.",
    })
    .regex(/^[1-9][0-9]*$/, {
      message: "Amount must be a whole number greater than 0 (no decimals).",
    }),
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
    .string()
    .min(1, {
      message: "Platform fee is required.",
    })
    .regex(/^\d+(\.\d{1})?$/, {
      message: "Platform fee must be a number with at most one decimal place.",
    }),
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
