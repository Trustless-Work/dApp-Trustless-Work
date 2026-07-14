import { z } from "zod/v3";
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

export const updateEscrowSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(2000),
});

export type UpdateEscrowFormData = z.infer<typeof updateEscrowSchema>;

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
};

export function createManageMilestonesSchema({
  isMulti,
  approversCount,
}: ManageMilestonesSchemaParams) {
  return z
    .object({
      existingMilestones: z.array(manageExistingMilestoneSchema),
      newMilestones: z.array(manageNewMilestoneSchema),
    })
    .superRefine((data, ctx) => {
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
