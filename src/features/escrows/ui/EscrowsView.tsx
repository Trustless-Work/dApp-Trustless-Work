"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { DashboardPageHeaderActions } from "@/components/shared/DashboardPageHeaderContext";
import { Button } from "@/components/ui/button";
import { RoundedTabs } from "@/components/ui/custom-tab";
import { ESCROW_TABS } from "@/features/escrows/constants/escrow-tabs";
import { isEscrowType, type EscrowType } from "@/features/escrows/types/escrow.types";
import { CreateEscrowDialog } from "@/features/escrows/ui/CreateEscrowDialog";
import { EscrowsSection } from "@/features/escrows/ui/EscrowsSection";

export const EscrowsView = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeEscrowType, setActiveEscrowType] =
    useState<EscrowType>("single-release");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DashboardPageHeaderActions>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:gap-4">
          <Button
            type="button"
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
          >
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
            value={activeEscrowType}
            onValueChange={(value) => {
              if (isEscrowType(value)) {
                setActiveEscrowType(value);
              }
            }}
          />
        </div>
      </DashboardPageHeaderActions>

      <Container className="flex min-h-0 flex-1 flex-col">
        <EscrowsSection
          escrowType={activeEscrowType}
          onCreateRequest={() => setCreateDialogOpen(true)}
        />
      </Container>

      <CreateEscrowDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        initialType={activeEscrowType}
      />
    </div>
  );
};
