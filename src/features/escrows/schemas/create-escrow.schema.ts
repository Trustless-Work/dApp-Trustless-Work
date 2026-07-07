import { z } from "zod/v3";
import { MAX_ROLE_ADDRESS_COUNT } from "@/features/escrows/constants/create-escrow.constants";
import {
  getAdminOverlapMessage,
  getApprovalsTargetExceedsApproversMessage,
} from "@/features/escrows/utils/create-escrow.helper";
import { STELLAR_PUBLIC_KEY_PATTERN } from "@/helpers/stellar.helper";

const stellarAddressSchema = z
  .string()
  .trim()
  .regex(STELLAR_PUBLIC_KEY_PATTERN, "Invalid Stellar public key");

const roleAddressArraySchema = z
  .array(stellarAddressSchema)
  .min(1, "Add at least one address")
  .max(
    MAX_ROLE_ADDRESS_COUNT,
    `Maximum ${MAX_ROLE_ADDRESS_COUNT} addresses allowed`,
  );

export const DISPUTE_RESOLVER_OVERLAP_MESSAGE =
  "A dispute resolver cannot also appear in approvers, service providers, release signers, or be the receiver / platform.";

type RolesWithOptionalReceiver = {
  approvers: string[];
  serviceProviders: string[];
  platform: string;
  releaseSigners: string[];
  disputeResolvers: string[];
  admin: string;
  receiver?: string;
};

function validateDisputeResolverOverlap(
  roles: RolesWithOptionalReceiver,
  ctx: z.RefinementCtx,
): void {
  const forbiddenAddresses = new Set<string>([
    ...roles.approvers,
    ...roles.serviceProviders,
    ...roles.releaseSigners,
    roles.platform,
  ]);

  if (roles.receiver) {
    forbiddenAddresses.add(roles.receiver);
  }

  roles.disputeResolvers.forEach((address, index) => {
    if (forbiddenAddresses.has(address)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: DISPUTE_RESOLVER_OVERLAP_MESSAGE,
        path: ["disputeResolvers", index],
      });
    }
  });
}

function validateAdminOverlap(
  roles: RolesWithOptionalReceiver,
  ctx: z.RefinementCtx,
): void {
  const { admin } = roles;

  if (!admin) {
    return;
  }

  const conflicts: ReadonlyArray<{ matches: boolean; roleLabel: string }> = [
    { matches: roles.approvers.includes(admin), roleLabel: "an approver" },
    {
      matches: roles.serviceProviders.includes(admin),
      roleLabel: "a service provider",
    },
    { matches: roles.platform === admin, roleLabel: "the platform" },
    {
      matches: roles.releaseSigners.includes(admin),
      roleLabel: "a release signer",
    },
    {
      matches: roles.disputeResolvers.includes(admin),
      roleLabel: "a dispute resolver",
    },
    { matches: roles.receiver === admin, roleLabel: "the receiver" },
  ];

  const conflict = conflicts.find((entry) => entry.matches);

  if (conflict) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: getAdminOverlapMessage(conflict.roleLabel),
      path: ["admin"],
    });
  }
}

function withRolesOverlapValidation<T extends z.ZodTypeAny>(schema: T) {
  return schema.superRefine((roles, ctx) => {
    const typedRoles = roles as RolesWithOptionalReceiver;
    validateDisputeResolverOverlap(typedRoles, ctx);
    validateAdminOverlap(typedRoles, ctx);
  });
}

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

const baseRolesSchema = z.object({
  approvers: roleAddressArraySchema,
  serviceProviders: roleAddressArraySchema,
  platform: stellarAddressSchema,
  releaseSigners: roleAddressArraySchema,
  disputeResolvers: roleAddressArraySchema,
  admin: stellarAddressSchema,
});

const singleReleaseRolesSchema = withRolesOverlapValidation(
  baseRolesSchema.extend({
    receiver: stellarAddressSchema,
  }),
);

const multiReleaseRolesSchema = withRolesOverlapValidation(baseRolesSchema);

const singleReleaseMilestoneSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  approvalsTarget: z.coerce.number().int().min(1, "At least 1 approval"),
});

const multiReleaseMilestoneSchema = singleReleaseMilestoneSchema.extend({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  receiver: stellarAddressSchema,
});

const trustlineSchema = z.object({
  address: stellarAddressSchema,
  symbol: z.string().trim().min(1, "Asset symbol is required"),
});

const singleReleaseCreateSchema = z.object({
  type: z.literal("single-release"),
  engagementId: z.string().trim().min(1, "Engagement ID is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  platformFee: z.coerce
    .number()
    .min(0)
    .max(100, "Fee must be between 0 and 100"),
  roles: singleReleaseRolesSchema,
  milestones: z
    .array(singleReleaseMilestoneSchema)
    .min(1, "Add at least one milestone"),
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
  milestones: z
    .array(multiReleaseMilestoneSchema)
    .min(1, "Add at least one milestone"),
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
