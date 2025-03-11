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
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFormatUtils } from "@/utils/hook/format.hook";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { useCopyUtils } from "@/utils/hook/copy.hook";
import EntityCard from "./cards/EntityCard";
import FundEscrowDialog from "./FundEscrowDialog";
import { useEscrowBoundedStore } from "../../store/ui";
import { useGlobalBoundedStore } from "@/core/store/data";
import QREscrowDialog from "./QREscrowDialog";
import { Badge } from "@/components/ui/badge";
import useDistributeEarningsEscrowDialogHook from "./hooks/distribute-earnings-escrow-dialog.hook";
import useChangeStatusEscrowDialogHook from "./hooks/change-status-escrow-dialog.hook";
import useChangeFlagEscrowDialogHook from "./hooks/change-flag-escrow-dialog.hook";
import ProgressEscrow from "./utils/ProgressEscrow";
import useStartDisputeEscrowDialogHook from "./hooks/start-dispute-escrow-dialog.hook";
import ResolveDisputeEscrowDialog from "./ResolveDisputeEscrowDialog";
import useResolveDisputeEscrowDialogHook from "./hooks/resolve-dispute-escrow-dialog.hook";
import {
  Ban,
  Check,
  CircleCheckBig,
  CircleDollarSign,
  Copy,
  Handshake,
  Wallet,
} from "lucide-react";
import EditMilestonesDialog from "./EditMilestonesDialog";
import {
  SuccessReleaseDialog,
  SuccessResolveDisputeDialog,
} from "./SuccessDialog";
import { toast } from "@/hooks/toast.hook";
import { useEscrowDialogs } from "./hooks/use-escrow-dialogs.hook";

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
  const activeTab = useEscrowBoundedStore((state) => state.activeTab);

  const {
    handleClose,
    areAllMilestonesCompleted,
    areAllMilestonesCompletedAndFlag,
    userRolesInEscrow,
  } = useEscrowDetailDialog({
    setIsDialogOpen,
    setSelectedEscrow,
    selectedEscrow,
  });

  const { distributeEscrowEarningsSubmit } =
    useDistributeEarningsEscrowDialogHook();
  const { handleOpen } = useResolveDisputeEscrowDialogHook({
    setIsResolveDisputeDialogOpen: dialogStates.resolveDispute.setIsOpen,
  });
  const { changeMilestoneStatusSubmit } = useChangeStatusEscrowDialogHook();
  const { startDisputeSubmit } = useStartDisputeEscrowDialogHook();
  const { changeMilestoneFlagSubmit } = useChangeFlagEscrowDialogHook();

  const { formatAddress, formatText, formatDollar, formatDateFromFirebase } =
    useFormatUtils();
  const { copyText, copiedKeyId } = useCopyUtils();

  if (!isDialogOpen || !selectedEscrow) return null;

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="w-11/12 md:w-2/3 h-auto max-h-screen overflow-y-auto">
          <DialogHeader>
            <div className="md:w-2/4 w-full">
              <div className="flex flex-col gap-2">
                <DialogTitle className="text-xl">
                  {selectedEscrow.title} - {selectedEscrow.engagementId}
                </DialogTitle>
                <DialogDescription>
                  {selectedEscrow.description}
                </DialogDescription>
                <DialogDescription>
                  <strong>Roles:</strong>{" "}
                  {userRolesInEscrow.map((role) => formatText(role)).join(", ")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col md:flex-row w-full gap-5 items-center justify-center">
            {selectedEscrow.disputeFlag && (
              <Card
                className={cn(
                  "overflow-hidden cursor-pointer hover:shadow-lg w-full md:w-2/5",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <Ban className="text-destructive" size={30} />
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <h3 className="text-2xl font-semibold">In Dispute</h3>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedEscrow.releaseFlag && (
              <Card
                className={cn(
                  "overflow-hidden cursor-pointer hover:shadow-lg w-full md:w-2/5",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <CircleCheckBig className="text-green-800" size={30} />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <h3 className="text-2xl font-semibold">Released</h3>
                    <Button
                      variant="link"
                      type="button"
                      onClick={() =>
                        dialogStates.successRelease.setIsOpen(true)
                      }
                      className="text-xs text-muted-foreground my-0 p-0 h-auto"
                    >
                      See Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedEscrow.resolvedFlag && (
              <Card
                className={cn(
                  "overflow-hidden cursor-pointer hover:shadow-lg w-full md:w-2/5",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <Handshake className="text-green-800" size={30} />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <h3 className="text-2xl font-semibold">Resolved</h3>
                    <Button
                      variant="link"
                      type="button"
                      onClick={() =>
                        dialogStates.successResolveDispute.setIsOpen(true)
                      }
                      className="text-xs text-muted-foreground my-0 p-0 h-auto"
                    >
                      See Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amount and Balance Cards */}
            <Card
              className={cn(
                "overflow-hidden cursor-pointer hover:shadow-lg w-full md:w-2/5",
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Amount
                  </p>
                  <CircleDollarSign size={30} />
                </div>
                <div className="mt-2 flex items-baseline">
                  <h3 className="text-2xl font-semibold">
                    {formatDollar(selectedEscrow.amount)}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card
              className={cn(
                "overflow-hidden cursor-pointer hover:shadow-lg w-full md:w-2/5",
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Balance
                  </p>
                  <Wallet size={30} />
                </div>
                <div className="mt-2 flex items-baseline">
                  <h3 className="text-2xl font-semibold">
                    {formatDollar(selectedEscrow.balance ?? "null")}
                  </h3>
                </div>
              </CardContent>
            </Card>

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
                Show QR Address
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  dialogStates.second.setIsOpen(true);
                }}
                className="w-full"
              >
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
                      Start Dispute
                    </Button>
                  </button>
                )}

              {userRolesInEscrow.includes("disputeResolver") &&
                activeTab === "disputeResolver" &&
                !areAllMilestonesCompletedAndFlag &&
                selectedEscrow.disputeFlag && (
                  <Button
                    onClick={handleOpen}
                    className="bg-green-800 hover:bg-green-700 mt-3"
                  >
                    Resolve Dispute
                  </Button>
                )}
            </div>
          </div>

          {/* Main Content */}
          <Card className={cn("overflow-hidden h-full")}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
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
              </div>

              {/* Milestones */}
              <div className="flex justify-center w-full mt-5">
                <div className="flex flex-col gap-4 py-4 w-full md:w-2/3">
                  <label htmlFor="milestones" className="flex items-center">
                    Milestones
                    <TooltipInfo content="Key stages or deliverables for the escrow." />
                  </label>
                  {selectedEscrow.milestones.map(
                    (milestone, milestoneIndex) => (
                      <div
                        key={`${milestone.description}-${milestone.status}`}
                        className="flex items-center space-x-4"
                      >
                        {milestone.flag ? (
                          <Badge className="uppercase max-w-24">Approved</Badge>
                        ) : (
                          <Badge
                            className="uppercase max-w-24"
                            variant="outline"
                          >
                            {milestone.status}
                          </Badge>
                        )}

                        <Input
                          disabled
                          value={milestone.description}
                          placeholder="Milestone Description"
                        />

                        {userRolesInEscrow.includes("serviceProvider") &&
                          activeTab === "serviceProvider" &&
                          milestone.status !== "completed" &&
                          !milestone.flag && (
                            <Button
                              className="max-w-32"
                              onClick={() =>
                                changeMilestoneStatusSubmit(
                                  selectedEscrow,
                                  milestone,
                                  milestoneIndex,
                                )
                              }
                            >
                              Complete
                            </Button>
                          )}

                        {userRolesInEscrow.includes("approver") &&
                          activeTab === "approver" &&
                          milestone.status === "completed" &&
                          !milestone.flag && (
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
                              Approve
                            </Button>
                          )}
                      </div>
                    ),
                  )}

                  <ProgressEscrow escrow={selectedEscrow} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex w-full justify-between">
            <p className="italic text-sm">
              <span className="font-bold mr-1">Created:</span>
              {formatDateFromFirebase(
                selectedEscrow.createdAt.seconds,
                selectedEscrow.createdAt.nanoseconds,
              )}
            </p>
            {areAllMilestonesCompleted &&
              areAllMilestonesCompletedAndFlag &&
              userRolesInEscrow.includes("releaseSigner") &&
              activeTab === "releaseSigner" && (
                <Button
                  onClick={distributeEscrowEarningsSubmit}
                  type="button"
                  className="bg-green-800 hover:bg-green-700"
                >
                  Release Payment
                </Button>
              )}

            {userRolesInEscrow.includes("platformAddress") &&
              activeTab === "platformAddress" && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    dialogStates.editMilestone.setIsOpen(true);
                  }}
                  variant="outline"
                >
                  Edit
                </Button>
              )}
          </div>
        </DialogContent>
      </Dialog>

      <FundEscrowDialog
        isSecondDialogOpen={dialogStates.second.isOpen}
        setIsSecondDialogOpen={dialogStates.second.setIsOpen}
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
