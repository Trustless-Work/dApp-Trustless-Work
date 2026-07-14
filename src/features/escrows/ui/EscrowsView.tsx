"use client";

import { PlusIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { Container } from "@/components/shared/Container";
import { DashboardPageHeaderActions } from "@/components/shared/DashboardPageHeaderContext";
import { Button } from "@/components/ui/button";
import { RoundedTabs } from "@/components/ui/custom-tab";
import { ESCROW_TABS } from "@/features/escrows/constants/escrow-tabs";
import { useEscrowListSearchParams } from "@/features/escrows/hooks/useEscrowListSearchParams";
import { isEscrowType } from "@/features/escrows/types/escrow.types";
import { CreateEscrowDialog } from "@/features/escrows/ui/CreateEscrowDialog";
import { EscrowFiltersBarSkeleton } from "@/features/escrows/ui/EscrowFilters";
import { EscrowsSection } from "@/features/escrows/ui/EscrowsSection";
import { EscrowsGridSkeleton } from "@/features/escrows/ui/EscrowsGridSkeleton";

const EscrowsViewHeader = ({
  onCreateRequest,
}: {
  onCreateRequest: () => void;
}) => {
  const { filters, setFilter } = useEscrowListSearchParams();

  return (
    <DashboardPageHeaderActions>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:gap-4">
        <Button type="button" size="sm" onClick={onCreateRequest}>
          <PlusIcon />
          Create Escrow
        </Button>

        <RoundedTabs
          fullWidth
          items={ESCROW_TABS.map((tab) => ({
            value: tab.value,
            label: tab.label,
            icon: <tab.icon />,
          }))}
          value={filters.type}
          onValueChange={(value) => {
            if (isEscrowType(value)) {
              setFilter("type", value);
            }
          }}
        />
      </div>
    </DashboardPageHeaderActions>
  );
};

export const EscrowsView = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Suspense
        fallback={
          <DashboardPageHeaderActions>
            <div className="flex w-full gap-3">
              <Button type="button" size="sm" disabled>
                <PlusIcon />
                Create Escrow
              </Button>
            </div>
          </DashboardPageHeaderActions>
        }
      >
        <EscrowsViewHeader
          onCreateRequest={() => setCreateDialogOpen(true)}
        />
      </Suspense>

      <Container className="flex min-h-0 flex-1 flex-col">
        <Suspense
          fallback={
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <EscrowFiltersBarSkeleton />
              <EscrowsGridSkeleton />
            </div>
          }
        >
          <EscrowsSection
            onCreateRequest={() => setCreateDialogOpen(true)}
          />
        </Suspense>
      </Container>

      <Suspense fallback={null}>
        <CreateEscrowDialogBridge
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </Suspense>
    </div>
  );
};

const CreateEscrowDialogBridge = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { filters } = useEscrowListSearchParams();

  return (
    <CreateEscrowDialog
      open={open}
      onOpenChange={onOpenChange}
      initialType={filters.type}
    />
  );
};
