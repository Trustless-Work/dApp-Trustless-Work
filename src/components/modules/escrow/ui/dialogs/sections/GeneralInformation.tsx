"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { useCopyUtils } from "@/utils/hook/copy.hook";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { Escrow } from "@/@types/escrow.entity";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { MultiReleaseMilestone } from "@trustless-work/escrow";
import {
  Ban,
  CircleCheckBig,
  CircleDollarSign,
  Handshake,
  Wallet,
  Info,
  Users,
  Check,
  Copy,
} from "lucide-react";
import { StatisticsCard } from "../cards/StatisticsCard";
import { Actions } from "./Actions";
import { useEscrowDialogs } from "../hooks/use-escrow-dialogs.hook";
import { roleActions } from "@/constants/role-actions/role-actions.constant";
import TooltipInfo from "@/components/utils/ui/Tooltip";

interface GeneralInformationProps {
  selectedEscrow: Escrow;
  userRolesInEscrow: string[];
  dialogStates: ReturnType<typeof useEscrowDialogs>;
  areAllMilestonesCompleted: boolean;
  areAllMilestonesCompletedAndFlag: boolean;
}

export const GeneralInformation = ({
  selectedEscrow,
  userRolesInEscrow,
  dialogStates,
  areAllMilestonesCompleted,
  areAllMilestonesCompletedAndFlag,
}: GeneralInformationProps) => {
  const { t } = useTranslation();
  const { formatText, formatDollar, formatAddress } = useFormatUtils();
  const { copyText, copiedKeyId } = useCopyUtils();
  const trustlessWorkAmount = useEscrowUIBoundedStore(
    (state) => state.trustlessWorkAmount,
  );
  const receiverAmount = useEscrowUIBoundedStore(
    (state) => state.receiverAmount,
  );
  const platformFeeAmount = useEscrowUIBoundedStore(
    (state) => state.platformFeeAmount,
  );

  const totalAmount = useMemo(() => {
    if (!selectedEscrow) return 0;

    const milestones = selectedEscrow.milestones as MultiReleaseMilestone[];

    if (selectedEscrow?.type === "single-release") {
      return selectedEscrow.amount;
    } else {
      return milestones.reduce(
        (acc, milestone) => acc + Number(milestone.amount),
        0,
      );
    }
  }, [selectedEscrow]);

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col md:flex-row w-4/5 gap-4">
          {selectedEscrow.flags?.disputed && (
            <StatisticsCard
              title={t("escrowDetailDialog.status")}
              icon={Ban}
              iconColor="text-destructive"
              value={t("reusable.inDispute")}
              subValue={
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="font-bold">
                    {t("escrowDetailDialog.by")}{" "}
                  </span>
                  {selectedEscrow.disputeStartedBy === "serviceProvider"
                    ? t("reusable.serviceProvider")
                    : t("reusable.approver")}
                </p>
              }
            />
          )}

          {selectedEscrow.flags?.released && (
            <StatisticsCard
              title={t("escrowDetailDialog.status")}
              icon={CircleCheckBig}
              iconColor="text-green-800"
              value={t("reusable.released")}
              actionLabel={t("escrowDetailDialog.seeDetails")}
              onAction={() => dialogStates.successRelease.setIsOpen(true)}
            />
          )}

          {selectedEscrow.flags?.resolved && (
            <StatisticsCard
              title={t("escrowDetailDialog.status")}
              icon={Handshake}
              iconColor="text-green-800"
              value={t("reusable.resolved")}
              actionLabel={t("escrowDetailDialog.seeDetails")}
              onAction={() =>
                dialogStates.successResolveDispute.setIsOpen(true)
              }
            />
          )}

          <StatisticsCard
            title={t("escrowDetailDialog.amount")}
            icon={CircleDollarSign}
            value={formatDollar(totalAmount)}
            tooltipContent={t("escrowDetailDialog.amountTooltip")}
          />

          <StatisticsCard
            title={t("escrowDetailDialog.balance")}
            icon={Wallet}
            value={formatDollar(selectedEscrow.balance ?? "null")}
            tooltipContent={t("escrowDetailDialog.balanceTooltip")}
            fundedBy={selectedEscrow.fundedBy}
          />
        </div>
        <div className="flex w-full md:w-1/5">
          {/* Action Buttons */}
          <Actions
            selectedEscrow={selectedEscrow}
            userRolesInEscrow={userRolesInEscrow}
            areAllMilestonesCompleted={areAllMilestonesCompleted}
            areAllMilestonesCompletedAndFlag={areAllMilestonesCompletedAndFlag}
          />
        </div>
      </div>
      <div
        className={cn(
          "grid gap-6 h-full",
          !selectedEscrow.flags?.released && !selectedEscrow.flags?.resolved
            ? selectedEscrow?.type === "multi-release"
              ? "grid-cols-1 md:grid-cols-1 mx-auto"
              : "grid-cols-1 lg:grid-cols-4"
            : "grid-cols-1 md:grid-cols-1 w-full mx-auto",
        )}
      >
        {/* Escrow ID and Actions */}
        <div className="lg:col-span-3">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
            <div className="grid gap-4">
              {/* Escrow ID Section - Full Width */}
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {selectedEscrow.trustline?.name || "No Trustline"} |
                        Escrow ID
                      </span>
                      <button
                        onClick={() =>
                          copyText(
                            selectedEscrow?.contractId,
                            selectedEscrow.contractId,
                          )
                        }
                        className="p-1.5 hover:bg-muted rounded-md transition-colors flex-shrink-0"
                      >
                        {copiedKeyId ? (
                          <Check className="h-4 w-4 text-green-700" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <span className="font-mono text-sm break-all text-foreground">
                      {formatAddress(selectedEscrow.contractId)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout for Roles and Memo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Roles Section */}
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Roles
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userRolesInEscrow.map((role) => {
                      const roleData = roleActions.find((r) => r.role === role);
                      return (
                        <TooltipInfo key={role} content={formatText(role)}>
                          <div className="p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors">
                            {roleData?.icon || (
                              <Users className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </TooltipInfo>
                      );
                    })}
                  </div>
                </div>

                {/* Memo Section */}
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3 mb-2">
                    <Info className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Memo
                    </span>
                  </div>
                  <span className="font-medium text-foreground">
                    {selectedEscrow?.receiverMemo ||
                      t("escrowDetailDialog.noMemo")}
                  </span>
                </div>
              </div>

              {/* Two Column Layout for Engagement ID and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Engagement ID Section */}
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3 mb-2">
                    <CircleDollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Engagement ID
                    </span>
                  </div>
                  <span className="font-medium text-foreground">
                    {selectedEscrow?.engagementId ||
                      t("escrowDetailDialog.noEngagement")}
                  </span>
                </div>

                {/* Type Section */}
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3 mb-2">
                    <CircleDollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("reusable.type")}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">
                    {selectedEscrow?.type === "multi-release"
                      ? t("reusable.multiRelease")
                      : t("reusable.singleRelease")}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {selectedEscrow?.type !== "multi-release" &&
          !selectedEscrow.flags?.released &&
          !selectedEscrow.flags?.resolved && (
            <div className="lg:col-span-1">
              <Card className="p-4 h-full">
                <h3 className="text-lg font-semibold mb-4">
                  Release Amount Distribution
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                          Total Amount
                        </span>
                        <span className="font-medium">
                          {formatDollar(selectedEscrow.amount)}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">100%</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Receiver
                          </span>
                          <span className="font-medium">
                            {formatDollar(receiverAmount.toFixed(2))}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {100 - selectedEscrow.platformFee - 0.3}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-primary" />
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Platform Fee
                          </span>
                          <span className="font-medium">
                            {formatDollar(platformFeeAmount.toFixed(2))}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedEscrow.platformFee}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                          {t("escrowDetailDialog.trustlessWork")}
                        </span>
                        <span className="font-medium">
                          {formatDollar(trustlessWorkAmount.toFixed(2))}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">0.3%</div>
                  </div>
                </div>
              </Card>
            </div>
          )}
      </div>
    </div>
  );
};
