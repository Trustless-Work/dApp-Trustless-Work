import type {
  ManageMultiReleaseMilestonesPayload,
  ManageSingleReleaseMilestonesPayload,
} from "@trustless-work/escrow";
import type { ManageMilestonesFormData } from "@/features/escrows/schemas/escrow-action.schemas";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";

export type ManageMilestonesDefaultValues = ManageMilestonesFormData;

export function getEscrowApproversCount(escrow: StoredEscrow): number {
  return escrow.roles.approvers.length;
}

export function buildManageMilestonesDefaultValues(
  escrow: StoredEscrow,
): ManageMilestonesDefaultValues {
  return {
    existingMilestones: escrow.milestones.map((milestone, index) => ({
      index,
      description: milestone.description,
      amount:
        "amount" in milestone && typeof milestone.amount === "number"
          ? milestone.amount
          : 0,
    })),
    newMilestones: [],
  };
}

export function getDefaultNewMilestoneReceiver(escrow: StoredEscrow): string {
  return escrow.roles.approvers[0] ?? escrow.roles.serviceProviders[0] ?? "";
}

export function createEmptyNewMilestone(
  escrow: StoredEscrow,
  isMulti: boolean,
): ManageMilestonesFormData["newMilestones"][number] {
  return {
    description: "",
    approvalsTarget: 1,
    amount: 0,
    receiver: isMulti ? getDefaultNewMilestoneReceiver(escrow) : "",
  };
}

export function hasManageMilestonesChanges(
  escrow: StoredEscrow,
  values: ManageMilestonesFormData,
  canEditExisting: boolean,
): boolean {
  const isMulti = isStoredMultiReleaseEscrow(escrow);

  if (values.newMilestones.length > 0) {
    return true;
  }

  if (!canEditExisting) {
    return false;
  }

  return values.existingMilestones.some((row) => {
    const original = escrow.milestones[row.index];
    if (!original) {
      return false;
    }

    if (row.description.trim() !== original.description) {
      return true;
    }

    if (
      isMulti &&
      "amount" in original &&
      row.amount !== original.amount
    ) {
      return true;
    }

    return false;
  });
}

export function buildManageMilestonesPayload(
  escrow: StoredEscrow,
  walletAddress: string,
  values: ManageMilestonesFormData,
  canEditExisting: boolean,
):
  | ManageSingleReleaseMilestonesPayload
  | ManageMultiReleaseMilestonesPayload {
  const isMulti = isStoredMultiReleaseEscrow(escrow);

  if (isMulti) {
    return {
      contractId: escrow.contractId,
      admin: walletAddress,
      newMilestones: values.newMilestones.map((row) => ({
        description: row.description.trim(),
        approvalsTarget: row.approvalsTarget,
        amount: row.amount,
        receiver: row.receiver.trim(),
      })),
      milestoneUpdates: canEditExisting
        ? values.existingMilestones
            .map((row) => {
              const original = escrow.milestones[row.index];
              if (!original || !("amount" in original)) {
                return null;
              }

              const descriptionChanged =
                row.description.trim() !== original.description;
              const amountChanged = row.amount !== original.amount;

              if (!descriptionChanged && !amountChanged) {
                return null;
              }

              return {
                index: row.index,
                ...(descriptionChanged
                  ? { newDescription: row.description.trim() }
                  : {}),
                ...(amountChanged ? { newAmount: row.amount } : {}),
              };
            })
            .filter((row): row is NonNullable<typeof row> => row !== null)
        : [],
    };
  }

  return {
    contractId: escrow.contractId,
    admin: walletAddress,
    newMilestones: values.newMilestones.map((row) => ({
      description: row.description.trim(),
      approvalsTarget: row.approvalsTarget,
    })),
    milestoneUpdates: canEditExisting
      ? values.existingMilestones
          .map((row) => {
            const original = escrow.milestones[row.index];
            if (!original) {
              return null;
            }

            if (row.description.trim() === original.description) {
              return null;
            }

            return {
              index: row.index,
              newDescription: row.description.trim(),
            };
          })
          .filter((row): row is NonNullable<typeof row> => row !== null)
      : [],
  };
}
