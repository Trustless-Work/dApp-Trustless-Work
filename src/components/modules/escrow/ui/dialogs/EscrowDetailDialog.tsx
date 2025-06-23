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
  Info,
  Users,
  ListChecks,
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
import { Escrow } from "@/@types/escrow.entity";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { DeleteEscrowDialog } from "./DeleteEscrowDialog";
import { RestoreEscrowDialog } from "./RestoreEscrowDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { MultiReleaseMilestone } from "@trustless-work/escrow";

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
  const { t } = useTranslation();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const dialogStates = useEscrowDialogs();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);

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
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col md:flex-row w-full gap-5 items-center justify-center">
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

            {/* Escrow ID and Actions */}
            <EscrowIDActions
              selectedEscrow={selectedEscrow}
              userRolesInEscrow={userRolesInEscrow}
            />
          </div>

          {/* Main Content with Tabs */}
          <Card className={cn("overflow-hidden h-full")}>
            <CardContent className="p-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50">
                  <TabsTrigger
                    value="general"
                    className="flex items-center gap-2 data-[state=active]:bg-background"
                  >
                    <Info className="h-4 w-4" />
                    <span>General Information</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="entities"
                    className="flex items-center gap-2 data-[state=active]:bg-background"
                  >
                    <Users className="h-4 w-4" />
                    <span>Entities</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="milestones"
                    className="flex items-center gap-2 data-[state=active]:bg-background"
                  >
                    <ListChecks className="h-4 w-4" />
                    <span>Milestones</span>
                  </TabsTrigger>
                </TabsList>

                <div className="min-h-[400px]">
                  {/* General Information Tab */}
                  <TabsContent
                    value="general"
                    className="mt-4 space-y-6 h-full"
                  >
                    <div
                      className={cn(
                        "grid gap-6 h-full",
                        !selectedEscrow.flags?.released &&
                          !selectedEscrow.flags?.resolved
                          ? selectedEscrow?.type === "multi-release"
                            ? "grid-cols-1 md:grid-cols-1 max-w-2xl mx-auto"
                            : "grid-cols-1 md:grid-cols-2"
                          : "grid-cols-1 md:grid-cols-1 max-w-2xl mx-auto",
                      )}
                    >
                      <Card className="p-4 h-full">
                        <h3 className="text-lg font-semibold mb-4">
                          Basic Information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-primary" />
                                  <span className="text-sm text-muted-foreground">
                                    Roles
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {userRolesInEscrow.map((role) => (
                                    <span
                                      key={role}
                                      className="px-2 py-1 bg-primary/10 rounded-md text-sm uppercase"
                                    >
                                      {formatText(role)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Info className="h-4 w-4 text-primary" />
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">
                                  Memo
                                </span>
                                <span className="font-medium">
                                  {selectedEscrow?.receiverMemo ||
                                    t("escrowDetailDialog.noMemo")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-evenly p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CircleDollarSign className="h-4 w-4 text-primary" />
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">
                                  Engagement ID
                                </span>
                                <span className="font-medium">
                                  {selectedEscrow?.engagementId ||
                                    t("escrowDetailDialog.noEngagement")}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <CircleDollarSign className="h-4 w-4 text-primary" />
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">
                                  {t("reusable.type")}
                                </span>
                                <span className="font-medium">
                                  {selectedEscrow?.type === "multi-release"
                                    ? t("reusable.multiRelease")
                                    : t("reusable.singleRelease")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {selectedEscrow?.type !== "multi-release" &&
                        !selectedEscrow.flags?.released &&
                        !selectedEscrow.flags?.resolved && (
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
                                <div className="text-sm text-muted-foreground">
                                  100%
                                </div>
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
                                        {formatDollar(
                                          receiverAmount.toFixed(2),
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {100 - Number(selectedEscrow.platformFee)}%
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
                                        {formatDollar(
                                          platformFeeAmount.toFixed(2),
                                        )}
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
                                      {formatDollar(
                                        trustlessWorkAmount.toFixed(2),
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  0.3%
                                </div>
                              </div>
                            </div>
                          </Card>
                        )}
                    </div>
                  </TabsContent>

                  {/* Entities Tab */}
                  <TabsContent
                    value="entities"
                    className="mt-4 space-y-6 h-full"
                  >
                    <Card className="p-4 h-full">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">Entities</h3>
                          <TooltipInfo
                            content={t("escrowDetailDialog.entitiesTooltip")}
                          />
                        </div>

                        {userRolesInEscrow.includes("platformAddress") &&
                          !selectedEscrow?.flags?.disputed &&
                          !selectedEscrow?.flags?.resolved &&
                          !selectedEscrow?.flags?.released &&
                          activeTab === "platformAddress" && (
                            <TooltipInfo
                              content={t("escrowDetailDialog.editRolesTooltip")}
                            >
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dialogStates.editEntities.setIsOpen(true);
                                }}
                                className="text-xs"
                                variant="ghost"
                                disabled={Number(selectedEscrow.balance) === 0}
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
                  </TabsContent>

                  {/* Milestones Tab */}
                  <TabsContent value="milestones" className="mt-4 h-full">
                    <Card className="p-4 h-full">
                      <Milestones
                        selectedEscrow={selectedEscrow}
                        userRolesInEscrow={userRolesInEscrow}
                        setEvidenceVisibleMap={setEvidenceVisibleMap}
                        evidenceVisibleMap={evidenceVisibleMap}
                      />
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
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
                        onClick={() => setIsDeleteConfirmOpen(true)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("escrowDetailDialog.softDeleteTooltip")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        onClick={() => setIsRestoreConfirmOpen(true)}
                        className="gap-2"
                      >
                        <ArchiveRestore className="h-4 w-4" />
                        <span>Restore</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("escrowDetailDialog.restoreTooltip")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialogs */}
      <DeleteEscrowDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={async () => {
          await softDeleteEscrow(selectedEscrow.id);
          handleClose();
        }}
        escrowTitle={selectedEscrow.title}
      />

      <RestoreEscrowDialog
        isOpen={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={async () => {
          await restoreEscrow(selectedEscrow.id);
          handleClose();
        }}
        escrowTitle={selectedEscrow.title}
      />

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
        description={t("escrowDetailDialog.releasedDescription")}
      />

      <SuccessResolveDisputeDialog
        isSuccessResolveDisputeDialogOpen={
          dialogStates.successResolveDispute.isOpen
        }
        setIsSuccessResolveDisputeDialogOpen={
          dialogStates.successResolveDispute.setIsOpen
        }
        title=""
        description={t("escrowDetailDialog.resolvedDescription")}
      />
    </>
  );
};

export default EscrowDetailDialog;
