"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useEscrowDetailDialog from "./hooks/escrow-detail-dialog.hook";
import { useGlobalBoundedStore } from "@/core/store";
import { Escrow } from "@/@types/escrow.entity";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useFormatUtils } from "@/utils/hook/format.hook";
import TooltipInfo from "@/components/utils/Tooltip";
import { useInitializeEscrowHook } from "../../hooks/initialize-escrow.hook";
import { FaRegTrashCan } from "react-icons/fa6";
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
  const { handleClose } = useEscrowDetailDialog({
    setIsDialogOpen,
    setSelectedEscrow,
  });
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);

  const { formatAddress } = useFormatUtils();

  const { handleAddMilestone, handleRemoveMilestone } =
    useInitializeEscrowHook();

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="w-3/5 h-4/6">
        <DialogHeader>
          <div className="justify-between items-center w-1/5">
            <div className="flex flex-col gap-2">
              <DialogTitle className="text-xl">
                {selectedEscrow?.title}
              </DialogTitle>
              <DialogDescription>
                {selectedEscrow?.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Card className={cn("overflow-hidden h-full")}>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex flex-col w-1/3">
                <h3 className="font-bold text-xs ml-2 mb-2">Client</h3>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={""} alt={"name"} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs font-semibold">
                      {"name"}
                    </span>
                    <span className="truncate text-xs">
                      {formatAddress(selectedEscrow?.client!)}
                    </span>
                  </div>
                </SidebarMenuButton>
              </div>

              <div className="flex flex-col w-1/3">
                <h3 className="font-bold text-xs ml-2 mb-2">
                  Dispute Resolver
                </h3>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={""} alt={"name"} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs font-semibold">
                      {"name"}
                    </span>

                    <span className="truncate text-xs">
                      {formatAddress(selectedEscrow?.disputeResolver!)}{" "}
                    </span>
                  </div>
                </SidebarMenuButton>
              </div>

              <div className="flex flex-col w-1/3">
                <h3 className="font-bold text-xs ml-2 mb-2">
                  Service Provider
                </h3>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={""} alt={"name"} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs font-semibold">
                      {"name"}
                    </span>

                    <span className="truncate text-xs">
                      {formatAddress(selectedEscrow?.serviceProvider!)}{" "}
                    </span>
                  </div>
                </SidebarMenuButton>
              </div>
            </div>

            {/* <Button variant="secondary">Fund Escrow</Button> */}
            <div className="flex justify-center flex-col gap-4 py-4 w-2/3">
              <div className="space-y-4">
                <label className="flex items-center">
                  Milestones
                  <TooltipInfo content="Key stages or deliverables for the escrow." />
                </label>
                {selectedEscrow?.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Input
                      placeholder="Milestone Description"
                      value={milestone.description}
                      onChange={(e) => {
                        const updatedMilestones = [
                          ...selectedEscrow?.milestones,
                        ];
                        updatedMilestones[index].description = e.target.value;
                        // form.setValue("milestones", updatedMilestones);
                        // handleFieldChange("milestones", updatedMilestones);
                      }}
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
                                (option) => option.value === milestone.status,
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
                              {statusOptions.map((option) => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={() => {
                                    const updatedMilestones = [
                                      ...selectedEscrow?.milestones,
                                    ];
                                    updatedMilestones[index].status =
                                      option.value;
                                    // form.setValue("milestones", updatedMilestones);
                                  }}
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

                    <Button
                      className="w-full md:w-1/4"
                      variant="outline"
                      onClick={handleAddMilestone}
                      type="button"
                    >
                      Add Item
                    </Button>

                    <Button
                      onClick={() => handleRemoveMilestone(index)}
                      className="p-2 bg-transparent text-red-500 rounded-md border-none shadow-none hover:bg-transparent hover:shadow-none hover:text-red-500 focus:ring-0 active:ring-0"
                      disabled={index === 0}
                    >
                      <FaRegTrashCan className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <DialogFooter>
          <Button type="submit" onClick={handleClose}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EscrowDetailDialog;
