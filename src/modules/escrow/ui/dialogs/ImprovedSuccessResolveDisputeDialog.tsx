"use client";

import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import useSuccessResolveDisputeDialog from "../../hooks/dialogs/useSuccessResolveDisputeDialog";
import Link from "next/link";
import EntityCard from "../cards/EntityCard";
import { useGlobalBoundedStore } from "@/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import TransferAnimation from "../utils/TransferAnimation";
import { motion } from "framer-motion";
import { Escrow } from "@/types/escrow.entity";
import { MultiReleaseMilestone } from "@trustless-work/escrow";
import { useEscrowBoundedStore } from "../../store/data";
import useNetwork from "@/hooks/useNetwork";
import { formatCurrency } from "@/lib/format";

interface SuccessResolveDisputeProps {
  title: string;
  description: string;
  recentEscrow?: Escrow;
  isSuccessResolveDisputeDialogOpen: boolean;
  setIsSuccessResolveDisputeDialogOpen: (value: boolean) => void;
}

export const ImprovedSuccessResolveDisputeDialog = ({
  title,
  description,
  recentEscrow,
  isSuccessResolveDisputeDialogOpen,
  setIsSuccessResolveDisputeDialogOpen,
}: SuccessResolveDisputeProps) => {
  const { handleClose } = useSuccessResolveDisputeDialog({
    setIsSuccessResolveDisputeDialogOpen,
  });

  const { currentNetwork } = useNetwork();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);

  const resolvedDistributions = useEscrowUIBoundedStore(
    (state) => state.resolvedDistributions,
  );
  const milestoneIndex = useEscrowBoundedStore((state) => state.milestoneIndex);


  const escrow = selectedEscrow || recentEscrow;

  const trustlessPercentage = 0.3;
  const trustlessWorkFee = 0.003;
  const platformPercentage = Number(escrow?.platformFee);

  // Get the amount based on escrow type
  const amount =
    escrow?.type === "single-release"
      ? escrow?.amount
      : (escrow?.milestones[milestoneIndex || 0] as MultiReleaseMilestone)
          ?.amount;

  const trustlessWorkAmount = Number(amount) * trustlessWorkFee;
  const platformFee = escrow?.platformFee || 0;

  // Calcular totales y netos para destinatarios dinámicos
  const distributionsTotal = (resolvedDistributions || []).reduce(
    (acc, d) => acc + (Number(d.amount) || 0),
    0,
  );
  const calcNet = (amt: number) =>
    amt - (amt * (platformFee / 100) + amt * trustlessWorkFee);

  const totalPlatformAmount =
    amount && !isNaN(Number(amount)) ? Number(amount) * (platformFee / 100) : 0;


  // Get the appropriate URLs based on network
  const stellarExplorerUrl =
    currentNetwork === "testnet"
      ? `https://stellar.expert/explorer/testnet/contract/${escrow?.contractId}`
      : `https://stellar.expert/explorer/public/contract/${escrow?.contractId}`;

  const escrowViewerUrl =
    currentNetwork === "testnet"
      ? `https://viewer.trustlesswork.com/${escrow?.contractId}`
      : `https://viewer.trustlesswork.com/${escrow?.contractId}`;

  const containerAnimation = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <Dialog open={isSuccessResolveDisputeDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] lg:max-w-[800px] p-0 gap-0 overflow-auto md:overflow-hidden h-auto max-h-[90vh] md:max-h-none">
        <div className="flex flex-col">
          <div className="w-full p-4 sm:p-6">
            <DialogHeader className="mb-6 sm:mb-8">
              <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
              <DialogDescription className="mb-2 text-sm sm:text-base">
                {description}{" "}
                <Link
                  href={stellarExplorerUrl}
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  Stellar Explorer
                </Link>
                <span className="mx-2">or</span>
                <Link
                  href={escrowViewerUrl}
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  Escrow Viewer
                </Link>
              </DialogDescription>

              <div className="flex flex-col sm:flex-row sm:justify-start gap-2 sm:gap-10">
                <p className="text-sm">
                  <span className="font-bold">Total Amount: </span>
                  {formatCurrency(amount, escrow?.trustline?.name)}
                </p>
                {recentEscrow && (
                  <p className="text-sm">
                    <span className="font-bold">Total Balance:</span>{" "}
                    {formatCurrency(escrow?.balance, escrow?.trustline?.name)}
                  </p>
                )}
              </div>
            </DialogHeader>

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-3">
              <TransferAnimation
                 title="Dispute Resolved"
                 fromLabel="Contract"
                 fromAmount={formatCurrency(
                   amount,
                   escrow?.trustline?.name,
                 ).replace("$", "")}
                 fromCurrency={escrow?.trustline?.name}
                 toLabel="Resolution"
                 toAmount={formatCurrency(
                   Number(distributionsTotal),
                   escrow?.trustline?.name,
                 ).replace("$", "")}
                 toCurrency={escrow?.trustline?.name}
                 additionalInfo={
                   escrow?.contractId
                     ? `Contract ID: ${escrow.contractId.slice(0, 8)}...${escrow.contractId.slice(-6)}`
                     : "Unknown"
                 }
               />

              <motion.div
                className="flex flex-col gap-3 mt-3 lg:mt-0"
                variants={containerAnimation}
                initial="hidden"
                animate="visible"
              >
                {(resolvedDistributions || []).map((d, idx) => (
                  <motion.div key={`${d.address}-${idx}`} variants={itemAnimation}>
                    <EntityCard
                      type="Recipient"
                      entity={d.address}
                      hasPercentage={false}
                      hasAmount={true}
                      isNet={false}
                      amount={calcNet(Number(d.amount) || 0)}
                      currency={escrow?.trustline?.name}
                    />
                  </motion.div>
                ))}
                <motion.div variants={itemAnimation}>
                  <EntityCard
                    type="Trustless Work"
                    entity={"0x"}
                    hasPercentage={true}
                    percentage={trustlessPercentage}
                    hasAmount={true}
                    amount={trustlessWorkAmount}
                    currency={escrow?.trustline?.name}
                  />
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <EntityCard
                    type="Platform"
                    entity={escrow?.roles?.platformAddress}
                    hasPercentage={true}
                    percentage={platformPercentage}
                    hasAmount={true}
                    amount={totalPlatformAmount}
                    currency={escrow?.trustline?.name}
                  />
                </motion.div>
              </motion.div>
            </div>

            <DialogFooter className="mt-4 sm:mt-6">
              <Button onClick={handleClose} className="w-full sm:w-auto">
                Close
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImprovedSuccessResolveDisputeDialog;
