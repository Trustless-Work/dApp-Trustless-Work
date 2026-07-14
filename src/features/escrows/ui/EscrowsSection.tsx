"use client";

import { DiscIcon } from "lucide-react";
import { NoData } from "@/components/shared/NoData";
import { Button } from "@/components/ui/button";
import { useEscrowsInfinite } from "@/features/escrows/hooks/useEscrows";
import { EscrowCard } from "@/features/escrows/ui/EscrowCard";
import { EscrowFiltersBar } from "@/features/escrows/ui/EscrowFilters";
import { EscrowsGridSkeleton } from "@/features/escrows/ui/EscrowsGridSkeleton";
import { useWalletContext } from "@/providers/WalletProvider";

type EscrowsSectionProps = {
  onCreateRequest: () => void;
};

const EMPTY_STATE_COPY = {
  "single-release": {
    title: "No single-release escrows yet",
    description:
      "Create a single-release escrow to release all funds once milestones are approved.",
  },
  "multi-release": {
    title: "No multi-release escrows yet",
    description:
      "Create a multi-release escrow to release funds milestone by milestone.",
  },
} as const;

export const EscrowsSection = ({ onCreateRequest }: EscrowsSectionProps) => {
  const { walletAddress } = useWalletContext();
  const {
    escrows,
    filters,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    refetch,
  } = useEscrowsInfinite();

  const copy = EMPTY_STATE_COPY[filters.type];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <EscrowFiltersBar />

      {isLoading ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <EscrowsGridSkeleton />
        </div>
      ) : !walletAddress ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <NoData
            icon={DiscIcon}
            title="Connect your wallet"
            description="Connect a Stellar wallet to manage escrows from the indexer."
          />
        </div>
      ) : isError ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <NoData
            title="Could not load escrows"
            description="Something went wrong while fetching escrows. Try again."
            actionLabel="Retry"
            onAction={() => {
              void refetch();
            }}
          />
        </div>
      ) : escrows.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <NoData
            icon={DiscIcon}
            title={copy.title}
            description={copy.description}
            actionLabel="Create Escrow"
            onAction={onCreateRequest}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {escrows.map((item) => (
                <EscrowCard key={item.contractId} item={item} />
              ))}
            </div>
          </div>

          {hasNextPage ? (
            <div className="flex justify-center pb-2">
              <Button
                type="button"
                variant="outline"
                disabled={isFetchingNextPage}
                onClick={() => {
                  void fetchNextPage();
                }}
              >
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </Button>
            </div>
          ) : (
            <p className="pb-2 text-center text-sm text-muted-foreground">
              Showing {escrows.length} escrow{escrows.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
