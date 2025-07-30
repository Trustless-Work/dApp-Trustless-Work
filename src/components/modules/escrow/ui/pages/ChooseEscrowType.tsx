"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { EscrowType } from "@trustless-work/escrow";
import { FileCheck, FileWarning, Layers } from "lucide-react";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useEscrowsBySignerQuery } from "../../hooks/tanstack/useEscrowsBySignerQuery";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MAX_ESCROWS = 20;

export const ChooseEscrowType = () => {
  const escrowType = useEscrowUIBoundedStore((state) => state.escrowType);
  const setEscrowType = useEscrowUIBoundedStore((state) => state.setEscrowType);
  const toggleStep = useEscrowUIBoundedStore((state) => state.toggleStep);
  const address = useGlobalAuthenticationStore((state) => state.address);

  const { data: escrows = [] } = useEscrowsBySignerQuery({
    signer: address,
    isActive: true,
  });

  const handleEscrowTypeSelect = (type: EscrowType) => {
    setEscrowType(type);
    toggleStep(3);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold">Choose Escrow Type</h1>
        </div>
        <h2>Select the type of escrow that best suits your needs.</h2>

        {escrows.length >= MAX_ESCROWS && (
          <Alert variant="destructive" className="mt-5">
            <FileWarning />
            <div className="flex flex-col ml-4">
              <AlertTitle className="font-bold">Attention!</AlertTitle>
              <AlertDescription>
                You cannot create up to 20 escrows. If you want to create a new
                escrow, you'll need to contact us by Telegram or Discord.
              </AlertDescription>
            </div>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card
          className={`p-6 hover:border-primary cursor-pointer transition-all hover:shadow-lg ${
            escrowType === "single-release" ? "border-primary" : ""
          }`}
          onClick={() => handleEscrowTypeSelect("single-release")}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Single Release</h3>
            </div>
            <p className="text-muted-foreground">
              Release all funds at once when all milestones are completed. Best
              for straightforward projects with clear deliverables.
            </p>
            <Button
              disabled={escrows.length >= MAX_ESCROWS}
              variant="outline"
              className="mt-auto"
            >
              Select Single Release
            </Button>
          </div>
        </Card>

        <Card
          className={`p-6 hover:border-primary cursor-pointer transition-all hover:shadow-lg ${
            escrowType === "multi-release" ? "border-primary" : ""
          }`}
          onClick={() => handleEscrowTypeSelect("multi-release")}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Multi Release</h3>
            </div>
            <p className="text-muted-foreground">
              Release funds progressively as each milestone is completed. Ideal
              for complex projects with multiple phases.
            </p>
            <Button
              disabled={escrows.length >= MAX_ESCROWS}
              variant="outline"
              className="mt-auto"
            >
              Select Multi Release
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
