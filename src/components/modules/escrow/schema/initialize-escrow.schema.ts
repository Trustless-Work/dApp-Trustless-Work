import { useValidData } from "@/utils/hook/valid-data.hook";
import { z } from "zod";

export const GetFormSchema = () => {
  const { isValidWallet } = useValidData();

  return z.object({
    token: z.string().min(1, {
      message: "Token is required.",
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
    description: z.string().min(1, {
      message: "Description is required.",
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
    platformFee: z
      .string()
      .min(1, {
        message: "Platform fee is required.",
      })
      .regex(/^[1-9][0-9]*$/, {
        message:
          "Platform fee must be a whole number greater than 0 (no decimals).",
      }),
    amount: z
      .string()
      .min(1, {
        message: "Amount is required.",
      })
      .regex(/^[1-9][0-9]*$/, {
        message: "Amount must be a whole number greater than 0 (no decimals).",
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
