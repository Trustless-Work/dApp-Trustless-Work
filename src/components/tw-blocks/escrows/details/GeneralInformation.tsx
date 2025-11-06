"use client";

import React, { useMemo } from "react";
import { Card } from "@/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/ui/tooltip";
import { cn } from "@/lib/utils";
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
  BriefcaseBusiness,
  BookOpen,
} from "lucide-react";
import { Actions, roleActions } from "./Actions";
import type { DialogStates } from "@/providers/EscrowDialogsProvider";
import { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow/types";
import { useEscrowAmountContext } from "@/providers/EscrowAmountProvider";
import { StatisticsCard } from "./StatisticsCard";
import {
  formatAddress,
  formatCurrency,
  formatRole,
} from "@/components/tw-blocks/helpers/format.helper";
import { useCopy } from "@/components/tw-blocks/helpers/useCopy";

interface GeneralInformationProps {
  selectedEscrow: GetEscrowsFromIndexerResponse;
  userRolesInEscrow: string[];
  dialogStates: DialogStates;
  areAllMilestonesApproved: boolean;
}

export const GeneralInformation = ({
  selectedEscrow,
  userRolesInEscrow,
  dialogStates,
  areAllMilestonesApproved,
}: GeneralInformationProps) => {
  const { trustlessWorkAmount, receiverAmount, platformFeeAmount } =
    useEscrowAmountContext();
  const { copiedKeyId, copyToClipboard } = useCopy();

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
        <div className="flex flex-col md:flex-row w-full mdw-4/5 gap-4">
          {selectedEscrow.flags?.disputed && (
            <StatisticsCard
              title="Status"
              icon={Ban}
              iconColor="text-destructive"
              value="In Dispute"
            />
          )}

          {selectedEscrow.flags?.released && (
            <StatisticsCard
              title="Status"
              icon={CircleCheckBig}
              iconColor="text-green-800"
              value="Released"
              actionLabel="See Details"
              onAction={() => dialogStates.successRelease.setIsOpen(true)}
            />
          )}

          {selectedEscrow.flags?.resolved && (
            <StatisticsCard
              title="Status"
              icon={Handshake}
              iconColor="text-green-800"
              value="Resolved"
            />
          )}

          <StatisticsCard
            title="Amount"
            icon={CircleDollarSign}
            value={formatCurrency(totalAmount, selectedEscrow.trustline?.name)}
          />

          <StatisticsCard
            title="Balance"
            icon={Wallet}
            value={formatCurrency(
              selectedEscrow.balance ?? 0,
              selectedEscrow.trustline?.name,
            )}
          />
        </div>
        <div className="flex w-full md:w-1/5">
          <Actions
            selectedEscrow={selectedEscrow}
            userRolesInEscrow={userRolesInEscrow}
            areAllMilestonesApproved={areAllMilestonesApproved}
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
        <div className="lg:col-span-3">
          <Card className="px-6 py-4 h-full">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid gap-4">
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
                          copyToClipboard(selectedEscrow?.contractId || "")
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
                      {formatAddress(selectedEscrow.contractId || "")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
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
                        <Tooltip key={role}>
                          <TooltipTrigger>
                            <div className="p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors cursor-pointer">
                              {roleData?.icon || (
                                <Users className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{formatRole(role)}</TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3 mb-2">
                    <BriefcaseBusiness className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Engagement ID
                    </span>
                  </div>
                  <span className="font-medium text-foreground">
                    {selectedEscrow?.engagementId || "No Engagement"}
                  </span>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Type
                    </span>
                  </div>
                  <span className="font-medium text-foreground">
                    {selectedEscrow?.type === "multi-release"
                      ? "Multi Release"
                      : "Single Release"}
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
                <h3 className="text-lg font-semibold">
                  Release Amount Distribution
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                          Total Amount
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            selectedEscrow.amount,
                            selectedEscrow.trustline?.name,
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">100%</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Receiver
                          </span>
                          <span className="font-medium">
                            {formatCurrency(
                              Number(receiverAmount.toFixed(2)),
                              selectedEscrow.trustline?.name,
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {100 - selectedEscrow.platformFee - 0.3}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-primary" />
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Platform Fee
                          </span>
                          <span className="font-medium">
                            {formatCurrency(
                              Number(platformFeeAmount.toFixed(2)),
                              selectedEscrow.trustline?.name,
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedEscrow.platformFee}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                          Trustless Work
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            Number(trustlessWorkAmount.toFixed(2)),
                            selectedEscrow.trustline?.name,
                          )}
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
