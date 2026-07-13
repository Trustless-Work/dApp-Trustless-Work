import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { OverviewStat, UsdcAmountStat } from "@/components/shared/UsdcAmount";
import { EscrowCopyField } from "@/features/escrows/ui/detail/EscrowCopyField";
import { EscrowExplorerLinks } from "@/features/escrows/ui/detail/EscrowExplorerLinks";
import { EscrowGeneralActions } from "@/features/escrows/ui/detail/EscrowGeneralActions";
import {
  getEscrowAssetSymbol,
  getEscrowDisplayAmount,
} from "@/features/escrows/utils/escrow-display.helper";

type EscrowOverviewSectionProps = {
  escrow: StoredEscrow;
};

export const EscrowOverviewSection = ({
  escrow,
}: EscrowOverviewSectionProps) => {
  const amount = getEscrowDisplayAmount(escrow);
  const symbol = getEscrowAssetSymbol(escrow);

  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(260px,300px)]">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 max-w-2xl">
              <h1 className="text-pretty text-2xl font-semibold tracking-tight">
                {escrow.title}
              </h1>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {escrow.description}
              </p>
            </div>

            <EscrowExplorerLinks contractId={escrow.contractId} />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4">
            <UsdcAmountStat
              label="Amount"
              amount={amount}
              symbol={symbol}
              size="2xl"
              emphasis
            />
            <UsdcAmountStat
              label="Balance"
              amount={escrow.balance}
              symbol={symbol}
              size="2xl"
              emphasis
            />
            <OverviewStat
              label="Platform Fee"
              value={`${escrow.platformFee}%`}
            />
            <OverviewStat
              label="Engagement ID"
              value={escrow.engagementId}
              mono
            />
          </dl>

          <div className="mt-6 min-w-0 border-t border-border pt-6">
            <EscrowCopyField label="Contract ID" value={escrow.contractId} />
          </div>
        </div>

        <EscrowGeneralActions escrow={escrow} />
      </div>
    </section>
  );
};
