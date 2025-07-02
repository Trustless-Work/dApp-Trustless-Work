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
        message: "Platform fee must be greater than 0.",
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
          const decimalPlaces = (numVal.toString().split(".")[1] || "").length;
          return decimalPlaces <= 2;
        }
        const decimalPlaces = (val.toString().split(".")[1] || "").length;
        return decimalPlaces <= 2;
      },
      {
        message: "Platform fee can have a maximum of 2 decimal places.",
      },
    ),
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
          const decimalPlaces = (numVal.toString().split(".")[1] || "").length;
          return decimalPlaces <= 2;
        }
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
        message: "Platform fee must be greater than 0.",
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
          const decimalPlaces = (numVal.toString().split(".")[1] || "").length;
          return decimalPlaces <= 2;
        }
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
