import { createElement } from "react";
import { toast } from "sonner";
import { TransactionSuccessToastDescription } from "@/features/escrows/ui/TransactionSuccessToastDescription";
import { getStoredNetwork } from "@/lib/client-storage";
import type { NetworkType } from "@/types/network.entity";

export const ESCROW_TX_TOAST_DURATION_MS = 10_000;

type ShowEscrowTransactionSuccessToastOptions = {
  title: string;
  txHash: string;
  toastId?: string | number;
  network?: NetworkType;
};

export function showEscrowTransactionSuccessToast({
  title,
  txHash,
  toastId,
  network = getStoredNetwork(),
}: ShowEscrowTransactionSuccessToastOptions): void {
  const trimmedTxHash = txHash.trim();

  if (!trimmedTxHash) {
    toast.success(title, { id: toastId });
    return;
  }

  const activeToastId = toastId ?? `escrow-tx-${Date.now()}`;

  toast.success(title, {
    id: activeToastId,
    duration: Number.POSITIVE_INFINITY,
    closeButton: true,
    dismissible: true,
    description: createElement(TransactionSuccessToastDescription, {
      txHash: trimmedTxHash,
      network,
      durationMs: ESCROW_TX_TOAST_DURATION_MS,
      toastId: activeToastId,
    }),
  });
}
