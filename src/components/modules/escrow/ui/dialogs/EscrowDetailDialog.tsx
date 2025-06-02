"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useEscrowDetailDialog from "./hooks/escrow-detail-dialog.hook";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFormatUtils } from "@/utils/hook/format.hook";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import EntityCard from "./cards/EntityCard";
import FundEscrowDialog from "./FundEscrowDialog";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { useGlobalBoundedStore } from "@/core/store/data";
import QREscrowDialog from "./QREscrowDialog";
import ResolveDisputeEscrowDialog from "./ResolveDisputeEscrowDialog";
import {
  ArchiveRestore,
  Ban,
  CircleCheckBig,
  CircleDollarSign,
  Handshake,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react";
import EditMilestonesDialog from "./EditMilestonesDialog";
import {
  SuccessReleaseDialog,
  SuccessResolveDisputeDialog,
} from "./SuccessDialog";
import { useEscrowDialogs } from "./hooks/use-escrow-dialogs.hook";
import Link from "next/link";
import CompleteMilestoneDialog from "./CompleteMilestoneDialog";
import { StatisticsCard } from "./cards/StatisticsCard";
import { EscrowIDActions } from "./sections/EscrowIDActions";
import { Milestones } from "./sections/Milestones";
import { Separator } from "@/components/ui/separator";
import { FooterDetails } from "./sections/Footer";
import { Button } from "@/components/ui/button";
import EditEntitiesDialog from "./EditEntitiesDialog";
import EditBasicPropertiesDialog from "./EditBasicPropertiesDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Escrow } from "@/@types/escrows/escrow.entity";
import { toast } from "sonner";

interface EscrowDetailDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  setSelectedEscrow: (selectedEscrow?: Escrow) => void;
}

const EscrowDetailDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  setSelectedEscrow,
}: EscrowDetailDialogProps) => {
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const dialogStates = useEscrowDialogs();

  const { softDeleteEscrow, restoreEscrow } = useGlobalBoundedStore();

  const {
    handleClose,
    setEvidenceVisibleMap,
    evidenceVisibleMap,
    areAllMilestonesCompleted,
    areAllMilestonesCompletedAndFlag,
    userRolesInEscrow,
  } = useEscrowDetailDialog({
    setIsDialogOpen,
    setSelectedEscrow,
    selectedEscrow,
  });

  const { formatText, formatDollar } = useFormatUtils();
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  if (!isDialogOpen || !selectedEscrow) return null;
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="w-11/12 sm:w-3/4 h-auto max-h-screen overflow-y-auto">
          <DialogHeader>
            <div className="w-full">
              <div className="flex flex-col gap-2">
                <div className="w-full">
                  <Link
                    href={`https://stellar.expert/explorer/testnet/contract/${selectedEscrow.contractId}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    <DialogTitle className="text-xl">
                      {selectedEscrow.title}
                    </DialogTitle>
                  </Link>
                </div>

                <DialogDescription>
                  {selectedEscrow.description}
                </DialogDescription>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex gap-2">
                    <strong>Roles: </strong>
                    <span className="uppercase">
                      {userRolesInEscrow
                        .map((role) => formatText(role))
                        .join(", ")}
                    </span>
                  </div>

                  <div className="border-r-2" />

                  <div className="flex gap-2">
                    <strong className="truncate">Memo:</strong>
                    {selectedEscrow?.receiverMemo || "No memo configured"}
                  </div>

                  <div className="border-r-2" />

                  <div className="flex gap-2">
                    <strong className="truncate">Engagement:</strong>
                    {selectedEscrow?.engagementId || "No engagement configured"}
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col md:flex-row w-full gap-5 items-center justify-center">
            {selectedEscrow.flags?.disputeFlag && (
              <StatisticsCard
                title="Status"
                icon={Ban}
                iconColor="text-destructive"
                value="In Dispute"
                subValue={
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-bold">By: </span>
                    {selectedEscrow.disputeStartedBy === "serviceProvider"
                      ? "Service Provider"
                      : "Approver"}
                  </p>
                }
              />
            )}

            {selectedEscrow.flags?.releaseFlag && (
              <StatisticsCard
                title="Status"
                icon={CircleCheckBig}
                iconColor="text-green-800"
                value="Released"
                actionLabel="See Details"
                onAction={() => dialogStates.successRelease.setIsOpen(true)}
              />
            )}

            {selectedEscrow.flags?.resolvedFlag && (
              <StatisticsCard
                title="Status"
                icon={Handshake}
                iconColor="text-green-800"
                value="Resolved"
                actionLabel="See Details"
                onAction={() =>
                  dialogStates.successResolveDispute.setIsOpen(true)
                }
              />
            )}

            <StatisticsCard
              title="Amount"
              icon={CircleDollarSign}
              value={formatDollar(selectedEscrow.amount)}
              tooltipContent="Total amount of the escrow."
            />

            <StatisticsCard
              title="Balance"
              icon={Wallet}
              value={formatDollar(selectedEscrow.balance ?? "null")}
              tooltipContent="Current balance of the escrow (smart contract)."
            />

            {/* Escrow ID and Actions */}
            <EscrowIDActions
              selectedEscrow={selectedEscrow}
              userRolesInEscrow={userRolesInEscrow}
            />
          </div>

          {/* Main Content */}
          <Card className={cn("overflow-hidden h-full")}>
            <CardContent className="p-6">
              <div className="flex w-full justify-between">
                <label htmlFor="milestones" className="flex items-center">
                  Entities
                  <TooltipInfo content="Entities that are involved in the escrow." />
                </label>

                {userRolesInEscrow.includes("platformAddress") &&
                  !selectedEscrow?.flags?.disputeFlag &&
                  !selectedEscrow?.flags?.resolvedFlag &&
                  !selectedEscrow?.flags?.releaseFlag &&
                  activeTab === "platformAddress" && (
                    <TooltipInfo content="Edit Roles">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          dialogStates.editEntities.setIsOpen(true);
                        }}
                        className="mt-6 md:mt-0 w-full md:w-1/12 text-xs"
                        variant="ghost"
                        disabled={Number(selectedEscrow.balance) === 0}
                      >
                        <Pencil />
                        Edit
                      </Button>
                    </TooltipInfo>
                  )}
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-2">
                <EntityCard
                  type="Approver"
                  entity={selectedEscrow.roles?.approver}
                  inDispute={selectedEscrow.flags?.disputeFlag}
                />
                <EntityCard
                  type="Service Provider"
                  entity={selectedEscrow.roles?.serviceProvider}
                  inDispute={selectedEscrow.flags?.disputeFlag}
                />
                <EntityCard
                  type="Dispute Resolver"
                  entity={selectedEscrow.roles?.disputeResolver}
                />
                <EntityCard
                  type="Platform"
                  entity={selectedEscrow.roles?.platformAddress}
                  hasPercentage
                  percentage={selectedEscrow.platformFee}
                />

                <EntityCard
                  type="Release Signer"
                  entity={selectedEscrow.roles?.releaseSigner}
                />
                <EntityCard
                  type="Receiver"
                  entity={selectedEscrow.roles?.receiver}
                />
              </div>

              {/* Milestones */}
              <Milestones
                selectedEscrow={selectedEscrow}
                userRolesInEscrow={userRolesInEscrow}
                setEvidenceVisibleMap={setEvidenceVisibleMap}
                evidenceVisibleMap={evidenceVisibleMap}
              />
            </CardContent>

            <Separator className="my-4" />

            <CardFooter className="flex sm:flex-row flex-col w-full justify-between items-center mb-80 sm:mb-0">
              <FooterDetails
                selectedEscrow={selectedEscrow}
                userRolesInEscrow={userRolesInEscrow}
                areAllMilestonesCompleted={areAllMilestonesCompleted}
                areAllMilestonesCompletedAndFlag={
                  areAllMilestonesCompletedAndFlag
                }
              />
              {selectedEscrow?.isActive !== false ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await softDeleteEscrow(selectedEscrow.id);
                          toast.success("Escrow moved to Trash.");
                          handleClose();
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      This is a soft delete. Escrow can be restored from the
                      Trash.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        onClick={async () => {
                          await restoreEscrow(selectedEscrow.id);
                          toast.success("Escrow restored.");
                          handleClose();
                        }}
                      >
                        <ArchiveRestore />
                        {/* Restore */}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      This escrow is in Trash. Click to restore it.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>

      {/* External Dialogs */}
      <FundEscrowDialog
        isSecondDialogOpen={dialogStates.second.isOpen}
        setIsSecondDialogOpen={dialogStates.second.setIsOpen}
      />

      <CompleteMilestoneDialog
        isCompleteMilestoneDialogOpen={dialogStates.completeMilestone.isOpen}
        setIsCompleteMilestoneDialogOpen={
          dialogStates.completeMilestone.setIsOpen
        }
      />

      <QREscrowDialog
        isQRDialogOpen={dialogStates.qr.isOpen}
        setIsQRDialogOpen={dialogStates.qr.setIsOpen}
      />

      <ResolveDisputeEscrowDialog
        isResolveDisputeDialogOpen={dialogStates.resolveDispute.isOpen}
        setIsResolveDisputeDialogOpen={dialogStates.resolveDispute.setIsOpen}
      />

      <EditMilestonesDialog
        isEditMilestoneDialogOpen={dialogStates.editMilestone.isOpen}
        setIsEditMilestoneDialogOpen={dialogStates.editMilestone.setIsOpen}
      />

      <EditEntitiesDialog
        isEditEntitiesDialogOpen={dialogStates.editEntities.isOpen}
        setIsEditEntitiesDialogOpen={dialogStates.editEntities.setIsOpen}
      />

      <EditBasicPropertiesDialog
        isEditBasicPropertiesDialogOpen={
          dialogStates.editBasicProperties.isOpen
        }
        setIsEditBasicPropertiesDialogOpen={
          dialogStates.editBasicProperties.setIsOpen
        }
      />

      <SuccessReleaseDialog
        isSuccessReleaseDialogOpen={dialogStates.successRelease.isOpen}
        setIsSuccessReleaseDialogOpen={dialogStates.successRelease.setIsOpen}
        title=""
        description="Now that your escrow is released, you will be able to view it directly in"
      />

      <SuccessResolveDisputeDialog
        isSuccessResolveDisputeDialogOpen={
          dialogStates.successResolveDispute.isOpen
        }
        setIsSuccessResolveDisputeDialogOpen={
          dialogStates.successResolveDispute.setIsOpen
        }
        title=""
        description="Now that your escrow is resolved, you will be able to view it directly in"
      />
    </>
  );
};

export default EscrowDetailDialog;
