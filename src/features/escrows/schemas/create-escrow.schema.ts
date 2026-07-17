import { z } from "zod/v3";
import { getApprovalsTargetExceedsApproversMessage } from "@/features/escrows/utils/create-escrow.helper";
import {
  multiReleaseRolesSchema,
  singleReleaseRolesSchema,
  stellarAddressSchema,
  trustlineSchema,
} from "@/features/escrows/schemas/escrow-shared.schema";

type MilestoneWithApprovalsTarget = {
  approvalsTarget: number;
};

type EscrowFormWithMilestones = {
  roles: { approvers: string[] };
  milestones: MilestoneWithApprovalsTarget[];
};

function validateMilestoneApprovalsTargets(
  data: EscrowFormWithMilestones,
  ctx: z.RefinementCtx,
): void {
  const approversCount = data.roles.approvers.length;

  data.milestones.forEach((milestone, index) => {
    if (milestone.approvalsTarget > approversCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: getApprovalsTargetExceedsApproversMessage(
          milestone.approvalsTarget,
          approversCount,
        ),
        path: ["milestones", index, "approvalsTarget"],
      });
    }
  });
}

function withMilestoneApprovalsTargetValidation<T extends z.ZodTypeAny>(
  schema: T,
) {
  return schema.superRefine((data, ctx) => {
    validateMilestoneApprovalsTargets(data as EscrowFormWithMilestones, ctx);
  });
}

const singleReleaseMilestoneSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  approvalsTarget: z.coerce.number().int().min(1, "At least 1 approval"),
});

const escrowAmountSchema = z.coerce
  .number()
  .min(0, "Amount cannot be negative");

const multiReleaseMilestoneSchema = singleReleaseMilestoneSchema.extend({
  amount: escrowAmountSchema,
  receiver: stellarAddressSchema,
});

const singleReleaseCreateSchema = z.object({
  type: z.literal("single-release"),
  engagementId: z.string().trim().min(1, "Engagement ID is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  amount: escrowAmountSchema,
  platformFee: z.coerce
    .number()
    .min(0)
    .max(100, "Fee must be between 0 and 100"),
  roles: singleReleaseRolesSchema,
  milestones: z.array(singleReleaseMilestoneSchema),
  trustline: trustlineSchema,
});

const multiReleaseCreateSchema = z.object({
  type: z.literal("multi-release"),
  engagementId: z.string().trim().min(1, "Engagement ID is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  platformFee: z.coerce
    .number()
    .min(0)
    .max(100, "Fee must be between 0 and 100"),
  roles: multiReleaseRolesSchema,
  milestones: z.array(multiReleaseMilestoneSchema),
  trustline: trustlineSchema,
});

export const createEscrowSchema = withMilestoneApprovalsTargetValidation(
  z.discriminatedUnion("type", [
    singleReleaseCreateSchema,
    multiReleaseCreateSchema,
  ]),
);

export type SingleReleaseCreateFormData = z.infer<
  typeof singleReleaseCreateSchema
>;

export type MultiReleaseCreateFormData = z.infer<
  typeof multiReleaseCreateSchema
>;

export type CreateEscrowFormData =
  | SingleReleaseCreateFormData
  | MultiReleaseCreateFormData;

export type CreateEscrowMilestoneFormData =
  | SingleReleaseCreateFormData["milestones"][number]
  | MultiReleaseCreateFormData["milestones"][number];

export type CreateEscrowRolesFormData =
  | SingleReleaseCreateFormData["roles"]
  | MultiReleaseCreateFormData["roles"];
