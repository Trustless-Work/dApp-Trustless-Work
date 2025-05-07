"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImprovedSuccessReleaseDialog } from "@/components/modules/escrow/ui/dialogs/ImprovedSuccessReleaseDialog";
import { ImprovedSuccessResolveDisputeDialog } from "@/components/modules/escrow/ui/dialogs/ImprovedSuccessResolveDisputeDialog";
import type { MilestoneStatus } from "@/@types/escrow.entity";
import { Moon, Sun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TestDialogsPage() {
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const milestoneStatus: MilestoneStatus = "completed";

  const testEscrow = {
    id: "test-id-123",
    title: "Test Escrow",
    description: "This is a test escrow for UI testing",
    contractId: "GCTVM987XVU123MISU47E...",
    amount: "500.00",
    balance: "0.00",
    platformFee: "2.5",
    platformAddress: "GCTVM987XVU123MISU47E...",
    receiver: "GCTVM987XVU123MISU47E...",
    serviceProvider: "GCTVM987XVU123MISU47E...",
    approver: "GCTVM987XVU123MISU47E...",
    disputeResolver: "GCTVM987XVU123MISU47E...",
    releaseSigner: "GCTVM987XVU123MISU47E...",
    user: "GCTVM987XVU123MISU47E...",
    issuer: "GCTVM987XVU123MISU47E...",
    engagementId: "engagement-123",
    milestones: [
      {
        description: "Test Milestone",
        status: milestoneStatus,
      },
    ],
    createdAt: {
      seconds: 1714000000,
      nanoseconds: 0,
    },
    updatedAt: {
      seconds: 1714000000,
      nanoseconds: 0,
    },
    approverFunds: "200.00",
    receiverFunds: "300.00",
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${darkMode ? "dark bg-zinc-900" : "bg-zinc-50"}`}
    >
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Test Dialogs</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full h-10 w-10"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        <Card className="mb-8 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              Mode: {darkMode ? "Dark" : "Light"}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setIsReleaseDialogOpen(true)}
                className="flex-1"
              >
                Test Success Release Dialog
              </Button>
              <Button
                onClick={() => setIsResolveDialogOpen(true)}
                className="flex-1"
              >
                Test Success Resolve Dispute Dialog
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <ImprovedSuccessReleaseDialog
        title="Funds Released Successfully"
        description="The transaction has been recorded on the blockchain."
        recentEscrow={testEscrow}
        isSuccessReleaseDialogOpen={isReleaseDialogOpen}
        setIsSuccessReleaseDialogOpen={setIsReleaseDialogOpen}
      />
      <ImprovedSuccessResolveDisputeDialog
        title="Dispute Resolved Successfully"
        description="The dispute has been resolved and funds have been distributed."
        recentEscrow={testEscrow}
        isSuccessResolveDisputeDialogOpen={isResolveDialogOpen}
        setIsSuccessResolveDisputeDialogOpen={setIsResolveDialogOpen}
      />
    </div>
  );
}
