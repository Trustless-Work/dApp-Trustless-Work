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
import { Escrow } from "@/@types/escrow.entity";
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
import LoaderData from "@/components/utils/ui/LoaderData";
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
  Wallet,
} from "lucide-react";
import SkeletonMilestones from "./utils/SkeletonMilestones";

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

  const setIsResolveDisputeDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsResolveDisputeDialogOpen,
  );

  const { handleOpen } = useResolveDisputeEscrowDialogHook({
    setIsResolveDisputeDialogOpen,
  });

  const { changeMilestoneStatusSubmit } = useChangeStatusEscrowDialogHook();
  const { startDisputeSubmit } = useStartDisputeEscrowDialogHook();
  const { changeMilestoneFlagSubmit } = useChangeFlagEscrowDialogHook();

  const isSecondDialogOpen = useEscrowBoundedStore(
    (state) => state.isSecondDialogOpen,
  );
  const setIsSecondDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSecondDialogOpen,
  );
  const setIsQRDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsQRDialogOpen,
  );
  const isQRDialogOpen = useEscrowBoundedStore((state) => state.isQRDialogOpen);

  const isChangingStatus = useEscrowBoundedStore(
    (state) => state.isChangingStatus,
  );

  const isStartingDispute = useEscrowBoundedStore(
    (state) => state.isStartingDispute,
  );

  const isResolveDisputeDialogOpen = useEscrowBoundedStore(
    (state) => state.isResolveDisputeDialogOpen,
  );

  const activeTab = useEscrowBoundedStore((state) => state.activeTab);

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
                  <div className="mt-2 flex items-baseline">
                    <h3 className="text-2xl font-semibold">Released</h3>
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
                <span className="uppercase font-bold">Escrow ID:</span>
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
                  setIsQRDialogOpen(true);
                }}
                className="w-full mb-3"
                variant="outline"
              >
                Show QR Address
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSecondDialogOpen(true);
                }}
                className="w-full"
              >
                Fund Escrow
              </Button>

              {(userRolesInEscrow.includes("client") ||
                userRolesInEscrow.includes("serviceProvider")) &&
                !areAllMilestonesCompletedAndFlag &&
                (activeTab === "client" || activeTab === "serviceProvider") &&
                !selectedEscrow.disputeFlag && (
                  <Button
                    onClick={startDisputeSubmit}
                    variant="destructive"
                    className="mt-3"
                  >
                    Start Dispute
                  </Button>
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
                  type="Client"
                  entity={selectedEscrow.client}
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
                  {isChangingStatus || isStartingDispute ? (
                    <SkeletonMilestones />
                  ) : (
                    <div className="space-y-4">
                      <label className="flex items-center">
                        Milestones
                        <TooltipInfo content="Key stages or deliverables for the escrow." />
                      </label>
                      {selectedEscrow.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          {milestone.flag ? (
                            <Badge className="uppercase max-w-24">
                              Approved
                            </Badge>
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
                                    index,
                                  )
                                }
                              >
                                Complete
                              </Button>
                            )}

                          {userRolesInEscrow.includes("client") &&
                            activeTab === "client" &&
                            milestone.status === "completed" &&
                            !milestone.flag && (
                              <Button
                                className="max-w-32"
                                onClick={() =>
                                  changeMilestoneFlagSubmit(
                                    selectedEscrow,
                                    milestone,
                                    index,
                                  )
                                }
                              >
                                Approve
                              </Button>
                            )}
                        </div>
                      ))}

                      <ProgressEscrow escrow={selectedEscrow} />
                    </div>
                  )}
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
                <Button variant="outline">Edit</Button>
              )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Second Dialog */}
      <FundEscrowDialog
        isSecondDialogOpen={isSecondDialogOpen}
        setIsSecondDialogOpen={setIsSecondDialogOpen}
      />

      {/* QR Dialog */}
      <QREscrowDialog
        isQRDialogOpen={isQRDialogOpen}
        setIsQRDialogOpen={setIsQRDialogOpen}
      />

      {/* Resolve Dispute Dialog */}
      <ResolveDisputeEscrowDialog
        isResolveDisputeDialogOpen={isResolveDisputeDialogOpen}
        setIsResolveDisputeDialogOpen={setIsResolveDisputeDialogOpen}
      />
    </>
  );
};

export default EscrowDetailDialog;
