"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import EntityCard from "../cards/EntityCard";
import { Escrow } from "@/@types/escrow.entity";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { useEscrowDialogs } from "../hooks/use-escrow-dialogs.hook";

interface EntitiesProps {
  selectedEscrow: Escrow;
  userRolesInEscrow: string[];
  dialogStates: ReturnType<typeof useEscrowDialogs>;
}

export const Entities = ({
  selectedEscrow,
  userRolesInEscrow,
  dialogStates,
}: EntitiesProps) => {
  const { t } = useTranslation();
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  return (
    <Card className="p-4 h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Entities</h3>
          <TooltipInfo content={t("escrowDetailDialog.entitiesTooltip")} />
        </div>

        {userRolesInEscrow.includes("platformAddress") &&
          !selectedEscrow?.flags?.disputed &&
          !selectedEscrow?.flags?.resolved &&
          !selectedEscrow?.flags?.released &&
          activeTab === "platformAddress" && (
            <TooltipInfo content={t("escrowDetailDialog.editRolesTooltip")}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  dialogStates.editEntities.setIsOpen(true);
                }}
                className="text-xs"
                variant="ghost"
                disabled={selectedEscrow.balance !== 0}
              >
                <Pencil className="h-4 w-4 mr-2" />
                {t("escrowDetailDialog.editButton")}
              </Button>
            </TooltipInfo>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <EntityCard
          type={t("reusable.approver")}
          entity={selectedEscrow.roles?.approver}
          inDispute={selectedEscrow.flags?.disputed}
        />
        <EntityCard
          type={t("reusable.serviceProvider")}
          entity={selectedEscrow.roles?.serviceProvider}
          inDispute={selectedEscrow.flags?.disputed}
        />
        <EntityCard
          type={t("reusable.disputeResolver")}
          entity={selectedEscrow.roles?.disputeResolver}
        />
        <EntityCard
          type={t("reusable.platformAddress")}
          entity={selectedEscrow.roles?.platformAddress}
          hasPercentage
          percentage={selectedEscrow.platformFee}
        />
        <EntityCard
          type={t("reusable.releaseSigner")}
          entity={selectedEscrow.roles?.releaseSigner}
        />
        <EntityCard
          type={t("reusable.receiver")}
          entity={selectedEscrow.roles?.receiver}
        />
      </div>
    </Card>
  );
};
