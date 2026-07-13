"use client";

import Link from "next/link";
import { getStellarExpertTransactionUrl } from "@/helpers/escrow-explorer.helper";
import type { NetworkType } from "@/types/network.entity";

type TransactionSuccessToastDescriptionProps = {
  txHash: string;
  network: NetworkType;
  durationMs: number;
};

export const TransactionSuccessToastDescription = ({
  txHash,
  network,
  durationMs,
}: TransactionSuccessToastDescriptionProps) => {
  const stellarExpertUrl = getStellarExpertTransactionUrl(network, txHash);

  return (
    <div className="flex w-full flex-col gap-2">
      <Link
        href={stellarExpertUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium underline-offset-2 hover:underline"
      >
        View on Stellar Expert
      </Link>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15"
        aria-hidden="true"
      >
        <div
          className="h-full w-full origin-left rounded-full bg-current opacity-70"
          style={{
            animation: `escrow-tx-toast-countdown ${durationMs}ms linear forwards`,
          }}
        />
      </div>
      <style>{`
        @keyframes escrow-tx-toast-countdown {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};
