"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useEscrowDetailDialog from "./hooks/escrow-detail-dialog.hook";
import type { Escrow } from "@/@types/escrow.entity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFormatUtils } from "@/utils/hook/format.hook";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { useCopyUtils } from "@/utils/hook/copy.hook";
import EntityCard from "./cards/EntityCard";
import FundEscrowDialog from "./FundEscrowDialog";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { useGlobalBoundedStore } from "@/core/store/data";
import QREscrowDialog from "./QREscrowDialog";
import { Badge } from "@/components/ui/badge";
import useDistributeEarningsEscrowDialogHook from "./hooks/distribute-earnings-escrow-dialog.hook";
import useChangeFlagEscrowDialogHook from "./hooks/change-flag-escrow-dialog.hook";
import ProgressEscrow from "./utils/ProgressEscrow";
import useStartDisputeEscrowDialogHook from "./hooks/start-dispute-escrow-dialog.hook";
import ResolveDisputeEscrowDialog from "./ResolveDisputeEscrowDialog";
import useResolveDisputeEscrowDialogHook from "./hooks/resolve-dispute-escrow-dialog.hook";
import {
  Ban,
  Check,
  CheckCheck,
  CircleCheckBig,
  CircleDollarSign,
  CircleDollarSignIcon,
  Copy,
  FileCheck2,
  Flame,
  Handshake,
  LetterText,
  Link2,
  PackageCheck,
  Pencil,
  QrCode,
  Wallet,
} from "lucide-react";
import EditMilestonesDialog from "./EditMilestonesDialog";
import {
  SuccessReleaseDialog,
  SuccessResolveDisputeDialog,
} from "./SuccessDialog";
import { toast } from "@/hooks/toast.hook";
import { useEscrowDialogs } from "./hooks/use-escrow-dialogs.hook";
import { useEffect } from "react";
import Link from "next/link";
import CompleteMilestoneDialog from "./CompleteMilestoneDialog";
import { useEscrowBoundedStore } from "../../store/data";
import { useValidData } from "@/utils/hook/valid-data.hook";
import { StatisticsCard } from "./cards/StatisticsCard";

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
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

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

  const { isValidUrl } = useValidData();

  const { distributeEscrowEarningsSubmit } =
    useDistributeEarningsEscrowDialogHook();
  const { handleOpen } = useResolveDisputeEscrowDialogHook({
    setIsResolveDisputeDialogOpen: dialogStates.resolveDispute.setIsOpen,
  });

  const setCompletingMilestone = useEscrowBoundedStore(
    (state) => state.setCompletingMilestone,
  );
  const setMilestoneIndex = useEscrowBoundedStore(
    (state) => state.setMilestoneIndex,
  );
  const { startDisputeSubmit } = useStartDisputeEscrowDialogHook();
  const { changeMilestoneFlagSubmit } = useChangeFlagEscrowDialogHook();

  const { formatAddress, formatText, formatDollar, formatDateFromFirebase } =
    useFormatUtils();
  const { copyText, copiedKeyId } = useCopyUtils();
  const receiverAmount = useEscrowUIBoundedStore(
    (state) => state.receiverAmount,
  );
  const platformFeeAmount = useEscrowUIBoundedStore(
    (state) => state.platformFeeAmount,
  );
  const trustlessWorkAmount = useEscrowUIBoundedStore(
    (state) => state.trustlessWorkAmount,
  );
  const setAmounts = useEscrowUIBoundedStore((state) => state.setAmounts);

  const totalAmount = Number(selectedEscrow?.amount || 0);
  const platformFeePercentage = Number(selectedEscrow?.platformFee || 0);

  useEffect(() => {
    setAmounts(totalAmount, platformFeePercentage);
  }, [totalAmount, platformFeePercentage, setAmounts]);

  if (!isDialogOpen || !selectedEscrow) return null;

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="w-11/12 sm:w-3/4 h-auto max-h-screen overflow-y-auto">
          <DialogHeader>
            <div className="w-full">
              <div className="flex flex-col gap-2">
                <Link
                  href={`https://stellar.expert/explorer/testnet/contract/${selectedEscrow.contractId}`}
                  target="_blank"
                  className="hover:underline"
                >
                  <DialogTitle className="text-xl">
                    {selectedEscrow.title} - {selectedEscrow.engagementId}
                  </DialogTitle>
                </Link>
                <DialogDescription>
                  {selectedEscrow.description}
                </DialogDescription>
                <DialogDescription>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex gap-2">
                      <strong>Roles: </strong>
                      {userRolesInEscrow
                        .map((role) => formatText(role))
                        .join(", ")}
                    </div>

                    <div className="border-r-2" />

                    <div className="flex gap-2">
                      <strong className="truncate">Memo:</strong>
                      {selectedEscrow?.receiverMemo || "No memo configured"}
                    </div>
                  </div>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col md:flex-row w-full gap-5 items-center justify-center">
            {selectedEscrow.disputeFlag && (
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

            {selectedEscrow.releaseFlag && (
              <StatisticsCard
                title="Status"
                icon={CircleCheckBig}
                iconColor="text-green-800"
                value="Released"
                actionLabel="See Details"
                onAction={() => dialogStates.successRelease.setIsOpen(true)}
              />
            )}

            {selectedEscrow.resolvedFlag && (
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
            />

            <StatisticsCard
              title="Balance"
              icon={Wallet}
              value={formatDollar(selectedEscrow.balance ?? "null")}
            />

            {/* Escrow ID and Actions */}
            <div className="flex flex-col justify-center w-full md:w-1/5">
              <p className="text-center mb-3 text-sm">
                <span className="uppercase font-bold">
                  {selectedEscrow.trustline?.name || "No Trustline"} | Escrow
                  ID:
                </span>
                <div className="flex items-center justify-center">
                  {formatAddress(selectedEscrow.contractId)}
                  <button
                    onClick={() =>
                      copyText(
                        selectedEscrow?.contractId,
                        selectedEscrow.contractId,
                      )
                    }
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    title="Copy Escrow ID"
                  >
                    {copiedKeyId ? (
                      <Check className={cn("h-4 w-4 text-green-700")} />
                    ) : (
                      <Copy className={cn("h-4 w-4")} />
                    )}
                  </button>
                </div>
              </p>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  dialogStates.qr.setIsOpen(true);
                }}
                className="w-full mb-3"
                variant="outline"
              >
                <QrCode />
                Show QR Address
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  dialogStates.second.setIsOpen(true);
                }}
                className="w-full"
              >
                <CircleDollarSignIcon />
                Fund Escrow
              </Button>

              {(userRolesInEscrow.includes("approver") ||
                userRolesInEscrow.includes("serviceProvider")) &&
                (activeTab === "approver" || activeTab === "serviceProvider") &&
                !selectedEscrow.disputeFlag &&
                !selectedEscrow.resolvedFlag && (
                  <button
                    type="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        if (
                          Number(selectedEscrow.balance) === 0 ||
                          !selectedEscrow.balance
                        ) {
                          toast({
                            title: "Cannot start dispute",
                            description: "The escrow balance is 0",
                            variant: "destructive",
                          });
                        } else {
                          startDisputeSubmit();
                        }
                      }
                    }}
                    onClick={() => {
                      if (
                        Number(selectedEscrow.balance) === 0 ||
                        !selectedEscrow.balance
                      ) {
                        toast({
                          title: "Cannot start dispute",
                          description: "The escrow balance is 0",
                          variant: "destructive",
                        });
                      } else {
                        startDisputeSubmit();
                      }
                    }}
                    className="w-full cursor-pointer"
                  >
                    <Button
                      disabled={
                        Number(selectedEscrow.balance) === 0 ||
                        !selectedEscrow.balance
                      }
                      variant="destructive"
                      className="mt-3 pointer-events-none w-full"
                    >
                      <Flame />
                      Start Dispute
                    </Button>
                  </button>
                )}

              {userRolesInEscrow.includes("disputeResolver") &&
                activeTab === "disputeResolver" &&
                !selectedEscrow.resolvedFlag &&
                selectedEscrow.disputeFlag && (
                  <Button
                    onClick={handleOpen}
                    className="bg-green-800 hover:bg-green-700 mt-3"
                  >
                    <Handshake />
                    Resolve Dispute
                  </Button>
                )}
            </div>
          </div>

          {/* Main Content */}
          <Card className={cn("overflow-hidden h-full")}>
            <CardContent className="p-6">
              <label htmlFor="milestones" className="flex items-center">
                Entities
                <TooltipInfo content="Entities that are involved in the escrow." />
              </label>

              <div className="flex flex-col md:flex-row gap-4 mt-2">
                <EntityCard
                  type="Approver"
                  entity={selectedEscrow.approver}
                  inDispute={selectedEscrow.disputeFlag}
                />
                <EntityCard
                  type="Service Provider"
                  entity={selectedEscrow.serviceProvider}
                  inDispute={selectedEscrow.disputeFlag}
                />
                <EntityCard
                  type="Dispute Resolver"
                  entity={selectedEscrow.disputeResolver}
                />
                <EntityCard
                  type="Platform"
                  entity={selectedEscrow.platformAddress}
                  hasPercentage
                  percentage={selectedEscrow.platformFee}
                />

                <EntityCard
                  type="Release Signer"
                  entity={selectedEscrow.releaseSigner}
                />
                <EntityCard type="Receiver" entity={selectedEscrow.receiver} />
              </div>

              {/* Milestones */}
              <div className="flex justify-center w-full mt-5">
                <div className="flex flex-col gap-4 py-4 w-full md:w-4/5">
                  <div className="flex w-full justify-between">
                    <label htmlFor="milestones" className="flex items-center">
                      Milestones
                      <TooltipInfo content="Key stages or deliverables for the escrow." />
                    </label>

                    {userRolesInEscrow.includes("platformAddress") &&
                      !selectedEscrow?.disputeFlag &&
                      !selectedEscrow?.resolvedFlag &&
                      activeTab === "platformAddress" && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            dialogStates.editMilestone.setIsOpen(true);
                          }}
                          className="mt-6 md:mt-0 w-full md:w-1/12 text-xs"
                          variant="ghost"
                        >
                          <Pencil />
                          Edit
                        </Button>
                      )}
                  </div>

                  <div className="flex flex-col gap-4 max-h-[150px] overflow-y-auto px-10">
                    {selectedEscrow.milestones.map(
                      (milestone, milestoneIndex) => (
                        <div
                          key={`${milestone.description}-${milestone.status}`}
                          className="flex flex-col sm:flex-row items-center space-x-4"
                        >
                          {milestone.approved_flag ? (
                            <Badge className="uppercase max-w-24 mb-4 md:mb-0">
                              Approved
                            </Badge>
                          ) : (
                            <Badge
                              className="uppercase max-w-24 mb-4 md:mb-0"
                              variant="outline"
                            >
                              {milestone.status}
                            </Badge>
                          )}

                          <Input
                            disabled
                            value={
                              !evidenceVisibleMap[milestoneIndex]
                                ? milestone.description
                                : milestone.evidence
                            }
                          />

                          {userRolesInEscrow.includes("serviceProvider") &&
                            activeTab === "serviceProvider" &&
                            milestone.status !== "completed" &&
                            !milestone.approved_flag && (
                              <Button
                                className="max-w-32"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCompletingMilestone(milestone);
                                  setMilestoneIndex(milestoneIndex);
                                  dialogStates.completeMilestone.setIsOpen(
                                    true,
                                  );
                                }}
                              >
                                <PackageCheck />
                                Complete
                              </Button>
                            )}

                          {milestone.evidence &&
                            (() => {
                              const result = isValidUrl(milestone.evidence);

                              return (
                                <>
                                  <Button
                                    title={
                                      !evidenceVisibleMap[milestoneIndex]
                                        ? "Show Evidence"
                                        : "Show Description"
                                    }
                                    className="max-w-20 mt-4 md:mt-0"
                                    variant="ghost"
                                    onClick={() => {
                                      setEvidenceVisibleMap((prev) => ({
                                        ...prev,
                                        [milestoneIndex]: !prev[milestoneIndex],
                                      }));
                                    }}
                                  >
                                    {!evidenceVisibleMap[milestoneIndex] ? (
                                      <FileCheck2 />
                                    ) : (
                                      <LetterText />
                                    )}
                                  </Button>

                                  {evidenceVisibleMap[milestoneIndex] &&
                                    (result === true ||
                                      (result &&
                                        typeof result === "object" &&
                                        result.warning)) && (
                                      <Link
                                        href={milestone.evidence}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Button
                                          title={
                                            result === true
                                              ? "Open Evidence"
                                              : "Open Evidence (Not Secure)"
                                          }
                                          className="max-w-20"
                                          variant="ghost"
                                        >
                                          <Link2
                                            className={
                                              result === true
                                                ? ""
                                                : "text-destructive"
                                            }
                                          />
                                        </Button>
                                      </Link>
                                    )}
                                </>
                              );
                            })()}

                          {userRolesInEscrow.includes("approver") &&
                            activeTab === "approver" &&
                            milestone.status === "completed" &&
                            !milestone.approved_flag && (
                              <Button
                                className="max-w-32"
                                onClick={() =>
                                  changeMilestoneFlagSubmit(
                                    selectedEscrow,
                                    milestone,
                                    milestoneIndex,
                                  )
                                }
                              >
                                <CheckCheck />
                                Approve
                              </Button>
                            )}

                          {/* Mobile Milestone Divider */}
                          <div className="block sm:hidden border-b-2">
                            ____________________________________
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <ProgressEscrow escrow={selectedEscrow} />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex sm:flex-row flex-col w-full justify-between items-center mb-80 sm:mb-0">
            <p className="italic text-sm sm:mb-0 mb-3">
              <span className="font-bold mr-1">Created:</span>
              {formatDateFromFirebase(
                selectedEscrow.createdAt.seconds,
                selectedEscrow.createdAt.nanoseconds,
              )}
            </p>
            {!selectedEscrow.releaseFlag && !selectedEscrow.resolvedFlag && (
              <Card className="flex gap-10 items-center p-5">
                <CardTitle className="text-sm font-bold border-r-2 border-r-gray-300 pr-3">
                  Release Amount Distribution
                </CardTitle>

                <div className="flex gap-10 sm:flex-row flex-col">
                  <p className="text-sm">
                    <strong>Receiver:</strong> ${receiverAmount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Platform Fee:</strong> $
                    {platformFeeAmount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Trustless Work:</strong> $
                    {trustlessWorkAmount.toFixed(2)}
                  </p>
                </div>
              </Card>
            )}
            {areAllMilestonesCompleted &&
              areAllMilestonesCompletedAndFlag &&
              userRolesInEscrow.includes("releaseSigner") &&
              !selectedEscrow.releaseFlag &&
              activeTab === "releaseSigner" && (
                <Button
                  onClick={distributeEscrowEarningsSubmit}
                  type="button"
                  className="bg-green-800 hover:bg-green-700 mb-4 md:mb-0 w-full md:w-1/12"
                >
                  <CircleDollarSign />
                  Release Payment
                </Button>
              )}
          </div>
        </DialogContent>
      </Dialog>

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
