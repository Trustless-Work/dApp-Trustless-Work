"use client";

import { DiscIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { NoData } from "@/components/shared/NoData";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DEFAULT_ESCROW_FILTERS,
  type EscrowType,
} from "@/features/escrows/types/escrow.types";
import { useEscrows } from "@/features/escrows/hooks/useEscrows";
import { EscrowCard } from "@/features/escrows/ui/EscrowCard";
import { EscrowFiltersBar } from "@/features/escrows/ui/EscrowFilters";
import { EscrowsGridSkeleton } from "@/features/escrows/ui/EscrowsGridSkeleton";
import { useWalletContext } from "@/providers/WalletProvider";

type EscrowsSectionProps = {
  escrowType: EscrowType;
  onCreateRequest: () => void;
};

const EMPTY_STATE_COPY: Record<
  EscrowType,
  { title: string; description: string }
> = {
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
};

export const EscrowsSection = ({
  escrowType,
  onCreateRequest,
}: EscrowsSectionProps) => {
  const { walletAddress } = useWalletContext();
  const [filters, setFilters] = useState(DEFAULT_ESCROW_FILTERS);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [escrowType, filters.search, filters.status]);

  const { escrows, total, totalPages, currentPage, isLoading } = useEscrows({
    escrowType,
    filters,
    page,
  });

  const copy = EMPTY_STATE_COPY[escrowType];

  if (!walletAddress) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <NoData
          icon={DiscIcon}
          title="Connect your wallet"
          description="Connect a Stellar wallet to create and manage escrows locally."
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <EscrowFiltersBar filters={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <EscrowsGridSkeleton />
        </div>
      ) : escrows.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <NoData
            icon={DiscIcon}
            title={copy.title}
            description={copy.description}
            actionLabel="Create escrow"
            onAction={onCreateRequest}
          />
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {escrows.map((escrow) => (
                <EscrowCard key={escrow.contractId} escrow={escrow} />
              ))}
            </div>
          </div>

          {totalPages > 1 ? (
            <Pagination className="shrink-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((current) => Math.max(1, current - 1));
                    }}
                    aria-disabled={currentPage <= 1}
                    className={
                      currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === currentPage}
                        onClick={(event) => {
                          event.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((current) => Math.min(totalPages, current + 1));
                    }}
                    aria-disabled={currentPage >= totalPages}
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}

          <p className="shrink-0 text-center text-xs text-muted-foreground">
            Showing {escrows.length} of {total} escrows
          </p>
        </>
      )}
    </div>
  );
};
