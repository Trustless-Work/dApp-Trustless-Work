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
    .refine((val) => val % 1 === 0, {
      message: "Platform fee must be a whole number.",
    }),
  amount: z
    .number()
    .min(1, {
      message: "Amount is required.",
    })
    .refine((val) => val % 1 === 0, {
      message: "Amount must be a whole number.",
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
    .number()
    .min(1, {
      message: "Platform fee is required.",
    })
    .refine((val) => val % 1 === 0, {
      message: "Platform fee must be a whole number.",
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
