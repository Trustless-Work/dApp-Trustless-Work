"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import useEscrowDetailDialog from "./useDetailsEscrow";
import Link from "next/link";
import { Card } from "@/ui/card";
import { Info, Users, ListChecks } from "lucide-react";
import { useEscrowDialogs } from "@/providers/EscrowDialogsProvider";
import type { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Milestones } from "./Milestones";
import { Entities } from "./Entities";
import { GeneralInformation } from "./GeneralInformation";
import { useEscrowContext } from "@/providers/EscrowProvider";
import { SuccessReleaseDialog } from "./SuccessReleaseDialog";

/**
 * Based on the provided roles -> https://docs.trustlesswork.com/trustless-work/technology-overview/roles-in-trustless-work
 *
 * The roles that the user assigns in the escrow initialization are in the userRolesInEscrow state. Based on these roles, you'll have different actions buttons.
 *
 */

interface EscrowDetailDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  setSelectedEscrow: (selectedEscrow?: Escrow) => void;
}

export const EscrowDetailDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  setSelectedEscrow,
}: EscrowDetailDialogProps) => {
  const { selectedEscrow } = useEscrowContext();
  const dialogStates = useEscrowDialogs();
  const [activeTab, setActiveTab] = useState("general");

  const {
    handleClose,
    setEvidenceVisibleMap,
    evidenceVisibleMap,
    areAllMilestonesApproved,
    userRolesInEscrow,
  } = useEscrowDetailDialog({
    setIsDialogOpen,
    setSelectedEscrow,
    selectedEscrow,
  });

  const viewerUrl = `https://viewer.trustlesswork.com/${selectedEscrow?.contractId}`;

  if (!isDialogOpen || !selectedEscrow) return null;
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="w-11/12 sm:w-3/4 h-[95vh] overflow-y-auto flex flex-col !max-w-none">
          <DialogHeader className="flex-shrink-0">
            <div className="w-full">
              <div className="flex flex-col gap-2">
                <Link
                  href={viewerUrl}
                  target="_blank"
                  className="hover:underline w-fit"
                >
                  <DialogTitle className="text-xl">
                    {selectedEscrow.title}
                  </DialogTitle>
                </Link>

                <DialogDescription>
                  {selectedEscrow.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs
            defaultValue="general"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50">
              <TabsTrigger
                value="general"
                className="flex items-center gap-2 data-[state=active]:bg-background"
              >
                <Info className="h-4 w-4 hidden md:block" />
                <span>Information</span>
              </TabsTrigger>
              <TabsTrigger
                value="entities"
                className="flex items-center gap-2 data-[state=active]:bg-background"
              >
                <Users className="h-4 w-4 hidden md:block" />
                <span>Entities</span>
              </TabsTrigger>
              <TabsTrigger
                value="milestones"
                className="flex items-center gap-2 data-[state=active]:bg-background"
              >
                <ListChecks className="h-4 w-4 hidden md:block" />
                <span>Milestones</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-h-0">
              <TabsContent value="general" className="mt-4 h-full">
                <GeneralInformation
                  selectedEscrow={selectedEscrow}
                  userRolesInEscrow={userRolesInEscrow}
                  dialogStates={dialogStates}
                  areAllMilestonesApproved={areAllMilestonesApproved}
                />
              </TabsContent>

              <TabsContent value="entities" className="mt-4 h-full">
                <Entities selectedEscrow={selectedEscrow} />
              </TabsContent>

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
        </DialogContent>
      </Dialog>

      {dialogStates.successRelease.isOpen && (
        <SuccessReleaseDialog
          isOpen={dialogStates.successRelease.isOpen}
          onOpenChange={dialogStates.successRelease.setIsOpen}
        />
      )}
    </>
  );
};
