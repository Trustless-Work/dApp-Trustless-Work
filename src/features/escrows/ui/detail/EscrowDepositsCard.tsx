"use client";

import Link from "next/link";
import { WalletIcon } from "lucide-react";
import { NoData } from "@/components/shared/NoData";
import { UsdcAmount } from "@/components/shared/UsdcAmount";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EscrowDeposit } from "@trustless-work/escrow";
import {
  getStellarExpertAccountUrl,
  getStellarExpertTransactionUrl,
} from "@/helpers/escrow-explorer.helper";
import useNetwork from "@/hooks/useNetwork";

type EscrowDepositsCardProps = {
  deposits: readonly EscrowDeposit[];
};

function formatDepositDate(value: string | undefined): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function parseDepositAmount(value: string | number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getDepositAssetSymbol(asset: string): string {
  const [symbol] = asset.split(":");
  return symbol || "USDC";
}

const DepositRow = ({ deposit }: { deposit: EscrowDeposit }) => {
  const { currentNetwork } = useNetwork();
  const accountUrl = getStellarExpertAccountUrl(
    currentNetwork,
    deposit.fromAddress,
  );
  const txUrl = deposit.txHash
    ? getStellarExpertTransactionUrl(currentNetwork, deposit.txHash)
    : null;

  return (
    <li className="rounded-2xl border border-border bg-muted/30 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <UsdcAmount
            amount={parseDepositAmount(deposit.amount)}
            symbol={getDepositAssetSymbol(deposit.asset)}
            size="lg"
            emphasis
          />
          {deposit.ledgerClosedAt ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDepositDate(deposit.ledgerClosedAt)}
            </p>
          ) : null}
          {deposit.ledgerSeq ? (
            <Badge variant="secondary" className="mt-2 font-mono text-[10px]">
              #{deposit.ledgerSeq}
            </Badge>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-40">
          {txUrl ? (
            <Button asChild variant="outline" size="sm">
              <Link
                href={txUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Transaction
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="outline" size="sm">
            <Link
              href={accountUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Payer
            </Link>
          </Button>
        </div>
      </div>
    </li>
  );
};

export const EscrowDepositsCard = ({ deposits }: EscrowDepositsCardProps) => {
  const sorted = [...deposits].sort((a, b) => {
    const aTime = a.ledgerClosedAt
      ? new Date(a.ledgerClosedAt).getTime()
      : 0;
    const bTime = b.ledgerClosedAt
      ? new Date(b.ledgerClosedAt).getTime()
      : 0;
    return bTime - aTime;
  });

  return (
    <section className="flex min-h-0 flex-col rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Deposits</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Funds deposited into this escrow.
          </p>
        </div>
        <span className="text-sm text-muted-foreground">{sorted.length}</span>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col">
        {sorted.length === 0 ? (
          <NoData
            icon={WalletIcon}
            title="No deposits yet"
            description="Deposits will show here once the escrow is funded."
          />
        ) : (
          <ul className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {sorted.map((deposit, index) => (
              <DepositRow
                key={`${deposit.txHash ?? deposit.ledgerSeq}-${deposit.fromAddress}-${index}`}
                deposit={deposit}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
