import type {
  InitializeMultiReleaseEscrowPayload,
  InitializeSingleReleaseEscrowPayload,
} from "@trustless-work/escrow";
import type {
  CreateEscrowFormData,
  MultiReleaseCreateFormData,
  SingleReleaseCreateFormData,
} from "@/features/escrows/schemas/create-escrow.schema";

export function toInitializePayload(
  values: CreateEscrowFormData,
  signer: string,
):
  | InitializeSingleReleaseEscrowPayload
  | InitializeMultiReleaseEscrowPayload {
  const rolesBase = {
    approvers: values.roles.approvers,
    serviceProviders: values.roles.serviceProviders,
    platform: values.roles.platform,
    releaseSigners: values.roles.releaseSigners,
    disputeResolvers: values.roles.disputeResolvers,
    admin: values.roles.admin,
  };

  if (values.type === "multi-release") {
    const multiValues = values as MultiReleaseCreateFormData;

    return {
      signer,
      engagementId: multiValues.engagementId,
      title: multiValues.title,
      description: multiValues.description,
      platformFee: multiValues.platformFee,
      roles: rolesBase,
      milestones: multiValues.milestones.map((milestone) => ({
        description: milestone.description,
        approvalsTarget: milestone.approvalsTarget,
        amount: milestone.amount,
        receiver: milestone.receiver,
      })),
      trustline: {
        address: multiValues.trustline.address,
        symbol: multiValues.trustline.symbol,
      },
    };
  }

  const singleValues = values as SingleReleaseCreateFormData;

  return {
    signer,
    engagementId: singleValues.engagementId,
    title: singleValues.title,
    description: singleValues.description,
    amount: singleValues.amount,
    platformFee: singleValues.platformFee,
    roles: {
      ...rolesBase,
      receiver: singleValues.roles.receiver,
    },
    milestones: singleValues.milestones.map((milestone) => ({
      description: milestone.description,
      approvalsTarget: milestone.approvalsTarget,
    })),
    trustline: {
      address: singleValues.trustline.address,
      symbol: singleValues.trustline.symbol,
    },
  };
}
