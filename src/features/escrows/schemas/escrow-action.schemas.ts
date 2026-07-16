import { z } from "zod/v3";
import { MAX_MILESTONES_PER_ESCROW } from "@/features/escrows/constants/create-escrow.constants";
import {
  multiReleaseRolesSchema,
  singleReleaseRolesSchema,
  trustlineSchema,
} from "@/features/escrows/schemas/escrow-shared.schema";
import { getApprovalsTargetExceedsApproversMessage } from "@/features/escrows/utils/create-escrow.helper";
import { isStellarPublicKey } from "@/helpers/stellar.helper";

const amountFromInputSchema = z
  .string()
  .trim()
  .min(1, "Amount is required")
  .refine(
    (value) => Number.isFinite(Number(value)) && Number(value) > 0,
    "Amount must be greater than 0",
  )
  .transform((value) => Number(value));

const stellarAddressSchema = z
  .string()
  .trim()
  .min(1, "Address is required")
  .refine(isStellarPublicKey, "Enter a valid Stellar public key");

export const fundEscrowSchema = z.object({
  amount: amountFromInputSchema,
});

export type FundEscrowFormInput = z.input<typeof fundEscrowSchema>;
export type FundEscrowFormData = z.output<typeof fundEscrowSchema>;

export const withdrawFundsSchema = z.object({
  address: stellarAddressSchema,
  amount: amountFromInputSchema,
});

export type WithdrawFundsFormInput = z.input<typeof withdrawFundsSchema>;
export type WithdrawFundsFormData = z.output<typeof withdrawFundsSchema>;

const updateEngagementIdSchema = z
  .string()
  .trim()
  .min(1, "Engagement ID is required")
  .max(100, "Maximum 100 characters");

const updateTitleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(100, "Maximum 100 characters");

const updateDescriptionSchema = z
  .string()
  .trim()
  .min(1, "Description is required")
  .max(500, "Maximum 500 characters");

const updatePlatformFeeSchema = z.coerce
  .number()
  .min(0)
  .max(100, "Fee must be between 0 and 100");

const updateSingleReleaseSchema = z.object({
  type: z.literal("single-release"),
  engagementId: updateEngagementIdSchema,
  title: updateTitleSchema,
  description: updateDescriptionSchema,
  amount: z.coerce.number().min(0, "Amount cannot be negative"),
  platformFee: updatePlatformFeeSchema,
  roles: singleReleaseRolesSchema,
  trustline: trustlineSchema,
});

const updateMultiReleaseSchema = z.object({
  type: z.literal("multi-release"),
  engagementId: updateEngagementIdSchema,
  title: updateTitleSchema,
  description: updateDescriptionSchema,
  platformFee: updatePlatformFeeSchema,
  roles: multiReleaseRolesSchema,
  trustline: trustlineSchema,
});

export const updateEscrowSchema = z.discriminatedUnion("type", [
  updateSingleReleaseSchema,
  updateMultiReleaseSchema,
]);

export type UpdateSingleReleaseFormData = z.infer<
  typeof updateSingleReleaseSchema
>;

export type UpdateMultiReleaseFormData = z.infer<
  typeof updateMultiReleaseSchema
>;

export type UpdateEscrowFormData =
  | UpdateSingleReleaseFormData
  | UpdateMultiReleaseFormData;

export const startDisputeSchema = z.object({
  reason: z.string().trim().min(1, "Reason is required").max(1000),
});

export type StartDisputeFormData = z.infer<typeof startDisputeSchema>;

export const changeMilestoneStatusSchema = z.object({
  newStatus: z.string().trim().min(1, "Status is required").max(100),
  newEvidence: z.string().trim().max(5000).optional(),
});

export type ChangeMilestoneStatusFormData = z.infer<
  typeof changeMilestoneStatusSchema
>;

export const resolveDisputeDistributionSchema = z.object({
  address: stellarAddressSchema,
  amount: amountFromInputSchema,
});

export const resolveDisputeSchema = z.object({
  rows: z
    .array(resolveDisputeDistributionSchema)
    .min(1, "Add at least one distribution"),
});

export type ResolveDisputeFormInput = z.input<typeof resolveDisputeSchema>;
export type ResolveDisputeFormData = z.output<typeof resolveDisputeSchema>;

const manageExistingMilestoneSchema = z.object({
  index: z.number().int().min(0),
  description: z.string().trim().min(1, "Description is required"),
  amount: z.coerce.number(),
});

const manageNewMilestoneSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  approvalsTarget: z.coerce.number().int().min(1, "At least 1 approval"),
  amount: z.coerce.number(),
  receiver: z.string(),
});

export type ManageMilestonesSchemaParams = {
  readonly isMulti: boolean;
  readonly approversCount: number;
  readonly existingCount: number;
};

export function createManageMilestonesSchema({
  isMulti,
  approversCount,
  existingCount,
}: ManageMilestonesSchemaParams) {
  return z
    .object({
      existingMilestones: z.array(manageExistingMilestoneSchema),
      newMilestones: z.array(manageNewMilestoneSchema),
    })
    .superRefine((data, ctx) => {
      if (existingCount + data.newMilestones.length > MAX_MILESTONES_PER_ESCROW) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `An escrow can have at most ${MAX_MILESTONES_PER_ESCROW} milestones.`,
          path: ["newMilestones"],
        });
      }

      data.newMilestones.forEach((milestone, index) => {
        if (milestone.approvalsTarget > approversCount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getApprovalsTargetExceedsApproversMessage(
              milestone.approvalsTarget,
              approversCount,
            ),
            path: ["newMilestones", index, "approvalsTarget"],
          });
        }

        if (!isMulti) {
          return;
        }

        if (!(milestone.amount > 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Amount must be greater than 0",
            path: ["newMilestones", index, "amount"],
          });
        }

        const receiverResult = stellarAddressSchema.safeParse(
          milestone.receiver,
        );
        if (!receiverResult.success) {
          receiverResult.error.issues.forEach((issue) => {
            ctx.addIssue({
              ...issue,
              path: ["newMilestones", index, "receiver", ...issue.path],
            });
          });
        }
      });

      if (!isMulti) {
        return;
      }

      data.existingMilestones.forEach((milestone, index) => {
        if (!(milestone.amount > 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Amount must be greater than 0",
            path: ["existingMilestones", index, "amount"],
          });
        }
      });
    });
}

export type ManageMilestonesFormData = z.infer<
  ReturnType<typeof createManageMilestonesSchema>
>;
