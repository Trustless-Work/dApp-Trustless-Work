import type {
  ManageMultiReleaseMilestonesPayload,
  ManageSingleReleaseMilestonesPayload,
} from "@trustless-work/escrow";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { isStoredMultiReleaseEscrow } from "@/features/escrows/types/escrow.types";

export type ExistingMilestoneRow = {
  index: number;
  description: string;
  amount: string;
};

export type NewMilestoneRow = {
  description: string;
  approvalsTarget: string;
  amount: string;
  receiver: string;
};

export function buildExistingMilestoneRows(
  escrow: StoredEscrow,
): ExistingMilestoneRow[] {
  return escrow.milestones.map((milestone, index) => ({
    index,
    description: milestone.description,
    amount:
      "amount" in milestone && typeof milestone.amount === "number"
        ? String(milestone.amount)
        : "",
  }));
}

export function filterValidNewMilestoneRows(
  rows: readonly NewMilestoneRow[],
  isMulti: boolean,
): NewMilestoneRow[] {
  return rows.filter(
    (row) =>
      row.description.trim().length > 0 &&
      Number.isFinite(Number(row.approvalsTarget)) &&
      Number(row.approvalsTarget) > 0 &&
      (!isMulti ||
        (Number.isFinite(Number(row.amount)) &&
          Number(row.amount) > 0 &&
          row.receiver.trim().length > 0)),
  );
}

export function hasExistingMilestoneChanges(
  escrow: StoredEscrow,
  existingRows: readonly ExistingMilestoneRow[],
  isMulti: boolean,
): boolean {
  return existingRows.some((row, index) => {
    const original = escrow.milestones[index];
    if (!original) {
      return false;
    }

    if (row.description.trim() !== original.description) {
      return true;
    }

    if (
      isMulti &&
      "amount" in original &&
      Number(row.amount) !== original.amount
    ) {
      return true;
    }

    return false;
  });
}

export function buildManageMilestonesPayload(
  escrow: StoredEscrow,
  walletAddress: string,
  existingRows: readonly ExistingMilestoneRow[],
  newRows: readonly NewMilestoneRow[],
  canEditExisting: boolean,
):
  | ManageSingleReleaseMilestonesPayload
  | ManageMultiReleaseMilestonesPayload {
  const isMulti = isStoredMultiReleaseEscrow(escrow);
  const validNewRows = filterValidNewMilestoneRows(newRows, isMulti);

  if (isMulti) {
    return {
      contractId: escrow.contractId,
      admin: walletAddress,
      newMilestones: validNewRows.map((row) => ({
        description: row.description.trim(),
        approvalsTarget: Number(row.approvalsTarget),
        amount: Number(row.amount),
        receiver: row.receiver.trim(),
      })),
      milestoneUpdates: canEditExisting
        ? existingRows
            .map((row) => {
              const original = escrow.milestones[row.index];
              if (!original || !("amount" in original)) {
                return null;
              }

              const descriptionChanged =
                row.description.trim() !== original.description;
              const amountChanged = Number(row.amount) !== original.amount;

              if (!descriptionChanged && !amountChanged) {
                return null;
              }

              return {
                index: row.index,
                ...(descriptionChanged
                  ? { newDescription: row.description.trim() }
                  : {}),
                ...(amountChanged ? { newAmount: Number(row.amount) } : {}),
              };
            })
            .filter((row): row is NonNullable<typeof row> => row !== null)
        : [],
    };
  }

  return {
    contractId: escrow.contractId,
    admin: walletAddress,
    newMilestones: validNewRows.map((row) => ({
      description: row.description.trim(),
      approvalsTarget: Number(row.approvalsTarget),
    })),
    milestoneUpdates: canEditExisting
      ? existingRows
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
