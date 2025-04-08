import { useValidData } from "@/utils/hook/valid-data.hook";
import { z } from "zod";

export const GetFormSchema = () => {
  const { isValidWallet } = useValidData();

  return z.object({
    trustline: z.string().min(1, {
      message: "Trustline is required.",
    }),
    approver: z
      .string()
      .min(1, {
        message: "Approver is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Approver must be a valid wallet.",
      }),
    engagementId: z.string().min(1, {
      message: "Engagement is required.",
    }),
    title: z.string().min(1, {
      message: "Title is required.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters long.",
    }),
    serviceProvider: z
      .string()
      .min(1, {
        message: "Service provider is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Service provider must be a valid wallet.",
      }),
    platformAddress: z
      .string()
      .min(1, {
        message: "Platform address is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Platform address must be a valid wallet.",
      }),
    receiver: z
      .string()
      .min(1, {
        message: "Receiver address is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Receiver address must be a valid wallet.",
      }),
    platformFee: z
      .string()
      .min(1, {
        message: "Platform fee is required.",
      })
      .regex(/^\d+(\.\d{1})?$/, {
        message:
          "Platform fee must be a number with at most one decimal place.",
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
    releaseSigner: z
      .string()
      .min(1, {
        message: "Release signer is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Release signer must be a valid wallet.",
      }),
    disputeResolver: z
      .string()
      .min(1, {
        message: "Dispute resolver is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Dispute resolver must be a valid wallet.",
      }),
    milestones: z
      .array(
        z.object({
          description: z.string().min(1, {
            message: "Milestone description is required.",
          }),
        }),
      )
      .min(1, { message: "At least one milestone is required." }),
  });
};
