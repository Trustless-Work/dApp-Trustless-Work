import { isValidWallet } from "@/validators/valid-data.validators";
import { z } from "zod";

type MilestoneInput = {
  receiver?: string;
  description?: string;
  amount?: string | number;
};

const isEmptyAmount = (val: string | number | undefined) => {
  if (val === "" || val === undefined || val === null) return true;
  if (val === 0 || val === "0") return true;
  return false;
};

const isValidMilestoneAmount = (val: string | number) => {
  if (typeof val === "string") {
    if (val === "" || val === "." || val.endsWith(".")) return false;
    const numVal = Number(val);
    if (isNaN(numVal) || numVal <= 0) return false;
    const decimalPlaces = (numVal.toString().split(".")[1] || "").length;
    return decimalPlaces <= 2;
  }
  if (val <= 0) return false;
  const decimalPlaces = (val.toString().split(".")[1] || "").length;
  return decimalPlaces <= 2;
};

const validateMilestoneFields = (
  milestone: MilestoneInput,
  index: number,
  ctx: z.RefinementCtx,
) => {
  const receiver = milestone.receiver?.trim() ?? "";
  if (!receiver) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Receiver address is required.",
      path: [index, "receiver"],
    });
  } else if (!isValidWallet(receiver)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Receiver address must be a valid wallet.",
      path: [index, "receiver"],
    });
  }

  if (!milestone.description?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Milestone description is required.",
      path: [index, "description"],
    });
  }

  if (isEmptyAmount(milestone.amount)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Milestone amount must be greater than 0.",
      path: [index, "amount"],
    });
  } else if (!isValidMilestoneAmount(milestone.amount as string | number)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Milestone amount must be greater than 0 with at most 2 decimal places.",
      path: [index, "amount"],
    });
  }
};

export const useUpdateEscrowSchema = () => {
  const getBaseSchema = () => {
    return z.object({
      trustline: z.object({
        address: z.string().min(1, {
          message: "Trustline address is required.",
        }),
        symbol: z.string().min(1, {
          message: "Trustline symbol is required.",
        }),
      }),
      roles: z.object({
        approver: z
          .string()
          .min(1, { message: "Approver is required." })
          .refine((value) => isValidWallet(value), {
            message: "Approver must be a valid wallet.",
          }),
        serviceProvider: z
          .string()
          .min(1, { message: "Service provider is required." })
          .refine((value) => isValidWallet(value), {
            message: "Service provider must be a valid wallet.",
          }),
        platformAddress: z
          .string()
          .min(1, { message: "Platform address is required." })
          .refine((value) => isValidWallet(value), {
            message: "Platform address must be a valid wallet.",
          }),
        releaseSigner: z
          .string()
          .min(1, { message: "Release signer is required." })
          .refine((value) => isValidWallet(value), {
            message: "Release signer must be a valid wallet.",
          }),
        disputeResolver: z
          .string()
          .min(1, { message: "Dispute resolver is required." })
          .refine((value) => isValidWallet(value), {
            message: "Dispute resolver must be a valid wallet.",
          }),
      }),
      engagementId: z.string().min(1, { message: "Engagement is required." }),
      title: z.string().min(1, { message: "Title is required." }),
      description: z.string().min(10, {
        message: "Description must be at least 10 characters long.",
      }),
      platformFee: z.union([z.string(), z.number()]).refine(
        (val) => {
          if (typeof val === "string") {
            if (val === "" || val === "." || val.endsWith(".")) return true;
            const n = Number(val);
            if (isNaN(n)) return false;
            const dp = (n.toString().split(".")[1] || "").length;
            return dp <= 2;
          }
          const dp = (val.toString().split(".")[1] || "").length;
          return dp <= 2;
        },
        { message: "Platform fee can have a maximum of 2 decimal places." },
      ),
    });
  };

  const milestoneItemSchema = z.object({
    receiver: z
      .string()
      .min(1, {
        message: "Receiver address is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Receiver address must be a valid wallet.",
      }),
    description: z.string().min(1, {
      message: "Milestone description is required.",
    }),
    amount: z
      .union([z.string(), z.number()])
      .refine(
        (val) => {
          if (typeof val === "string") {
            if (val === "" || val === "." || val.endsWith(".")) {
              return true;
            }
            const numVal = Number(val);
            return !isNaN(numVal) && numVal > 0;
          }
          return val > 0;
        },
        {
          message: "Milestone amount must be greater than 0.",
        },
      )
      .refine(
        (val) => {
          if (typeof val === "string") {
            if (val === "" || val === "." || val.endsWith(".")) {
              return true;
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
          message: "Milestone amount can have a maximum of 2 decimal places.",
        },
      ),
  });

  const getMultiReleaseFormSchema = (options?: {
    isLocked?: boolean;
    existingMilestoneCount?: number;
  }) => {
    const { isLocked = false, existingMilestoneCount = 0 } = options ?? {};

    if (isLocked) {
      return z
        .object({
          trustline: z.object({
            address: z.string(),
            symbol: z.string(),
          }),
          roles: z.object({
            approver: z.string(),
            serviceProvider: z.string(),
            platformAddress: z.string(),
            releaseSigner: z.string(),
            disputeResolver: z.string(),
          }),
          engagementId: z.string(),
          title: z.string(),
          description: z.string(),
          platformFee: z.union([z.string(), z.number()]),
          milestones: z.array(
            z.object({
              receiver: z.string().optional(),
              description: z.string().optional(),
              amount: z.union([z.string(), z.number()]).optional(),
            }),
          ),
        })
        .superRefine((data, ctx) => {
          if (data.milestones.length <= existingMilestoneCount) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Add at least one new milestone when the escrow has balance.",
              path: ["milestones"],
            });
            return;
          }

          data.milestones.forEach((milestone, index) => {
            if (index < existingMilestoneCount) return;
            validateMilestoneFields(milestone, index, ctx);
          });
        });
    }

    const baseSchema = getBaseSchema();

    return baseSchema.extend({
      milestones: z
        .array(milestoneItemSchema)
        .min(1, { message: "At least one milestone is required." }),
    });
  };

  return { getMultiReleaseFormSchema };
};
