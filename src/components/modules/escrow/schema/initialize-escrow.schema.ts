import { useValidData } from "@/utils/hook/valid-data.hook";
import { z } from "zod";

export const useInitializeEscrowSchema = () => {
  const { isValidWallet } = useValidData();

  const getBaseSchema = () => {
    return z.object({
      trustline: z.object({
        address: z.string().min(1, {
          message: "Trustline address is required.",
        }),
        decimals: z.number().default(10000000),
      }),
      roles: z.object({
        approver: z
          .string()
          .min(1, {
            message: "Approver is required.",
          })
          .refine((value) => isValidWallet(value), {
            message: "Approver must be a valid wallet.",
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
        receiver: z
          .string()
          .min(1, {
            message: "Receiver address is required.",
          })
          .refine((value) => isValidWallet(value), {
            message: "Receiver address must be a valid wallet.",
          }),
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
      platformFee: z
        .string()
        .min(1, {
          message: "Platform fee is required.",
        })
        .regex(/^\d+(\.\d{1})?$/, {
          message:
            "Platform fee must be a number with at most one decimal place.",
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
  };

  const getSingleReleaseFormSchema = () => {
    const baseSchema = getBaseSchema();

    return baseSchema.extend({
      amount: z
        .string()
        .min(1, {
          message: "Amount is required.",
        })
        .regex(/^[1-9][0-9]*$/, {
          message:
            "Amount must be a whole number greater than 0 (no decimals).",
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

  const getMultiReleaseFormSchema = () => {
    const baseSchema = getBaseSchema();

    return baseSchema.extend({
      milestones: z
        .array(
          z.object({
            description: z.string().min(1, {
              message: "Milestone description is required.",
            }),
            amount: z
              .string()
              .min(1, {
                message: "Milestone amount is required.",
              })
              .regex(/^[1-9][0-9]*$/, {
                message:
                  "Milestone amount must be a whole number greater than 0 (no decimals).",
              }),
          }),
        )
        .min(1, { message: "At least one milestone is required." }),
    });
  };

  return {
    getSingleReleaseFormSchema,
    getMultiReleaseFormSchema,
  };
};
