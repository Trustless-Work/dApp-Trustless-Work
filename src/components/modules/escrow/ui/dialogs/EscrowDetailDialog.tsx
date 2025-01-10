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
import TooltipInfo from "@/components/utils/Tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { statusOptions } from "@/constants/escrow/StatusOptions";
import { TbPigMoney } from "react-icons/tb";
import { MdAttachMoney } from "react-icons/md";
import { Progress } from "@/components/ui/progress";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import { useCopyUtils } from "@/utils/hook/copy.hook";
import EntityCard from "./components/EntityCard";
import FundEscrowDialog from "./FundEscrowDialog";
import { useEscrowBoundedStore } from "../../store/ui";
import { useGlobalBoundedStore } from "@/core/store/data";

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

  const { handleClose } = useEscrowDetailDialog({
    setIsDialogOpen,
    setSelectedEscrow,
    selectedEscrow,
  });

  const isSecondDialogOpen = useEscrowBoundedStore(
    (state) => state.isSecondDialogOpen,
  );
  const setIsSecondDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSecondDialogOpen,
  );

  const { formatAddress, formatDollar, formatDateFromFirebase } =
    useFormatUtils();
  const { copyText, copySuccess } = useCopyUtils();

  const areAllMilestonesCompleted =
    selectedEscrow?.milestones
      ?.map((milestone) => milestone.status)
      .every((status) => status === "completed") ?? false;

  const getFilteredStatusOptions = (currentStatus: string | undefined) => {
    switch (currentStatus) {
      case "ToDo":
        return statusOptions.filter((option) => option.value === "inProgress");
      case "inProgress":
        return statusOptions.filter((option) => option.value === "inReview");
      case "inReview":
        return statusOptions.filter(
          (option) =>
            option.value === "approved" || option.value === "inDispute",
        );
      case "approved":
        return statusOptions.filter((option) => option.value === "release");
      case "inDispute":
        return statusOptions.filter((option) => option.value === "resolve");
      default:
        return [];
    }
  };

  if (!isDialogOpen || !selectedEscrow) return null;

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="w-11/12 md:w-2/3 h-auto max-h-screen overflow-y-auto">
          <DialogHeader>
            <div className="justify-between items-center md:w-2/4 w-full">
              <div className="flex flex-col gap-2">
                <DialogTitle className="text-xl">
                  {selectedEscrow.title} - {selectedEscrow.engagementId}
                </DialogTitle>
                <DialogDescription>
                  {selectedEscrow.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col md:flex-row w-full gap-5 items-center justify-center">
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
                  <MdAttachMoney size={30} />
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
                  <TbPigMoney size={30} />
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
                    onClick={() => copyText(selectedEscrow.contractId)}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    title="Copy Escrow ID"
                  >
                    {copySuccess ? (
                      <FaCheck className={cn("h-4 w-4 text-green-700")} />
                    ) : (
                      <FaRegCopy className={cn("h-4 w-4")} />
                    )}
                  </button>
                </div>
              </p>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSecondDialogOpen(true);
                }}
                className="w-full"
              >
                Fund Escrow
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Card className={cn("overflow-hidden h-full")}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <EntityCard type="Client" entity={selectedEscrow.client} />
                <EntityCard
                  type="Service Provider"
                  entity={selectedEscrow.serviceProvider}
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
              </div>

              {/* Milestones */}
              <div className="flex justify-center w-full mt-5">
                <div className="flex flex-col gap-4 py-4 w-full md:w-2/3">
                  <div className="space-y-4">
                    <label className="flex items-center">
                      Milestones
                      <TooltipInfo content="Key stages or deliverables for the escrow." />
                    </label>
                    {selectedEscrow.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Input
                          disabled
                          value={milestone.description}
                          placeholder="Milestone Description"
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-52 justify-between"
                            >
                              {milestone.status
                                ? statusOptions.find(
                                    (option) =>
                                      option.value === milestone.status,
                                  )?.label
                                : "Select Status"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-52 p-0">
                            <Command>
                              <CommandInput placeholder="Search status..." />
                              <CommandList>
                                <CommandEmpty>No status found.</CommandEmpty>
                                <CommandGroup>
                                  {getFilteredStatusOptions(
                                    milestone.status,
                                  ).map((option) => (
                                    <CommandItem
                                      key={option.value}
                                      onSelect={() => {
                                        milestone.status = option.value;
                                      }}
                                      defaultValue={option.value}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          milestone.status === option.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {option.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}

                    <div className="flex flex-col gap-2 mt-4">
                      <h3 className="mb-1 font-bold text-xs">Completed</h3>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const completedMilestones =
                            selectedEscrow.milestones.filter(
                              (milestone) => milestone.status === "completed",
                            ).length;
                          const totalMilestones =
                            selectedEscrow.milestones.length;
                          const progressPercentage =
                            totalMilestones > 0
                              ? (completedMilestones / totalMilestones) * 100
                              : 0;

                          return (
                            <>
                              <Progress value={progressPercentage} />
                              <strong className="text-xs">
                                {progressPercentage.toFixed(0)}%
                              </strong>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
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
            {areAllMilestonesCompleted && (
              <Button type="button" className="bg-green-800 hover:bg-green-700">
                Release
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Second Dialog */}
      <FundEscrowDialog
        isSecondDialogOpen={isSecondDialogOpen}
        setIsSecondDialogOpen={setIsSecondDialogOpen}
      />
    </>
  );
};

export default EscrowDetailDialog;
