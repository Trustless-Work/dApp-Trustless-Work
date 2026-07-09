import { EscrowRoleContext } from "@/features/escrows/domain/escrow-role-context";
import type { EscrowActionPolicy } from "@/features/escrows/domain/escrow-action-policy";
import { MultiReleaseActionPolicy } from "@/features/escrows/domain/multi-release-action-policy";
import { SingleReleaseActionPolicy } from "@/features/escrows/domain/single-release-action-policy";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { isStoredSingleReleaseEscrow } from "@/features/escrows/types/escrow.types";

export function createEscrowActionPolicy(
  escrow: StoredEscrow,
  walletAddress: string | null,
): EscrowActionPolicy {
  const roles = new EscrowRoleContext(escrow, walletAddress);

  if (isStoredSingleReleaseEscrow(escrow)) {
    return new SingleReleaseActionPolicy(escrow, roles);
  }

  return new MultiReleaseActionPolicy(escrow, roles);
}
