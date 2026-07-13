"use client";

import { Container } from "@/components/shared/Container";
import { NoData } from "@/components/shared/NoData";
import { EscrowActionsProvider } from "@/features/escrows/providers/EscrowActionsProvider";
import { useEscrowDetail } from "@/features/escrows/hooks/useEscrows";
import { EscrowDetailHeader } from "@/features/escrows/ui/detail/EscrowDetailHeader";
import { EscrowDetailSkeleton } from "@/features/escrows/ui/detail/EscrowDetailSkeleton";
import { EscrowMilestonesTable } from "@/features/escrows/ui/detail/EscrowMilestonesTable";
import { EscrowOverviewSection } from "@/features/escrows/ui/detail/EscrowOverviewSection";
import { EscrowRolesCard } from "@/features/escrows/ui/detail/EscrowRolesCard";

type EscrowDetailViewProps = {
  contractId: string;
};

export const EscrowDetailView = ({ contractId }: EscrowDetailViewProps) => {
  const { data: escrow, isResolving } = useEscrowDetail(contractId);

  if (isResolving) {
    return (
      <Container className="border-none bg-transparent p-0 shadow-none">
        <EscrowDetailSkeleton />
      </Container>
    );
  }

  if (!escrow) {
    return (
      <Container>
        <NoData
          title="Escrow not found"
          description="This escrow is not stored locally for the connected wallet."
          actionLabel="Back to escrows"
          onAction={() => {
            window.location.href = "/dashboard/escrows";
          }}
        />
      </Container>
    );
  }

  return (
    <EscrowActionsProvider
      contractId={escrow.contractId}
      escrowType={escrow.type}
    >
      <Container className="border-none bg-transparent p-0 shadow-none">
        <div className="flex flex-col gap-6">
          <EscrowDetailHeader escrow={escrow} />

          <EscrowOverviewSection escrow={escrow} />
          <EscrowRolesCard escrow={escrow} />
          <EscrowMilestonesTable escrow={escrow} />
        </div>
      </Container>
    </EscrowActionsProvider>
  );
};
