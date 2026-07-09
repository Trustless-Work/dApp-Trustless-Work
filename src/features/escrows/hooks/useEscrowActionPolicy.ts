"use client";

import { createEscrowActionPolicy } from "@/features/escrows/domain";
import type { EscrowActionPolicy } from "@/features/escrows/domain";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { useWalletContext } from "@/providers/WalletProvider";

export function useEscrowActionPolicy(escrow: StoredEscrow): EscrowActionPolicy {
  const { walletAddress } = useWalletContext();
  return createEscrowActionPolicy(escrow, walletAddress);
}
