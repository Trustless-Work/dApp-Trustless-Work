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
import useSuccessReleaseDialogHook from "./hooks/success-release-dialog.hook";
import Link from "next/link";
import { useFormatUtils } from "@/utils/hook/format.hook";
import EntityCard from "./cards/EntityCard";
import { useGlobalBoundedStore } from "@/core/store/data";
import TransferAnimation from "./TransferAnimation";
import { motion } from "framer-motion";
import { Escrow } from "@/@types/escrow.entity";
import { MultiReleaseMilestone } from "@trustless-work/escrow";
import { useEscrowBoundedStore } from "../../store/data";

interface SuccessReleaseDialogProps {
  title: string;
  description: string;
  recentEscrow?: Escrow;
  isSuccessReleaseDialogOpen: boolean;
  setIsSuccessReleaseDialogOpen: (value: boolean) => void;
}

export const ImprovedSuccessReleaseDialog = ({
  title,
  description,
  recentEscrow,
  isSuccessReleaseDialogOpen,
  setIsSuccessReleaseDialogOpen,
}: SuccessReleaseDialogProps) => {
  const { handleClose } = useSuccessReleaseDialogHook({
    setIsSuccessReleaseDialogOpen,
  });

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const milestoneIndex = useEscrowBoundedStore((state) => state.milestoneIndex);
  const escrow = selectedEscrow || recentEscrow;

  const { formatDollar } = useFormatUtils();

  // Get the amount based on escrow type
  const amount =
    escrow?.type === "single-release"
      ? escrow?.amount
      : (escrow?.milestones[milestoneIndex || 0] as MultiReleaseMilestone)
          ?.amount;

  // Percentage
  const trustlessPercentage = 0.3;
  const platformFee = Number(escrow?.platformFee || 0);
  const receiverPercentage = 100 - (trustlessPercentage + platformFee);

  // Amount
  const totalAmount = Number(amount || 0);
  const trustlessAmount = (totalAmount * trustlessPercentage) / 100;
  const receiverAmount = (totalAmount * receiverPercentage) / 100;
  const platformAmount = (totalAmount * platformFee) / 100;

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
    <Dialog open={isSuccessReleaseDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] p-0 gap-0 overflow-auto md:overflow-hidden h-auto max-h-[90vh] md:max-h-none">
        <div className="flex flex-col md:flex-row">
          <div className="w-full p-6">
            <DialogHeader className="mb-8">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="mb-2">
                {description}{" "}
                <Link
                  href={`https://stellar.expert/explorer/testnet/contract/${escrow?.contractId}`}
                  className="text-primary"
                  target="_blank"
                >
                  Stellar Explorer
                </Link>
                <span className="mx-2">or</span>
                <Link
                  href={`https://viewer.trustlesswork.com/${escrow?.contractId}`}
                  className="text-primary"
                  target="_blank"
                >
                  Escrow Viewer
                </Link>
              </DialogDescription>

              <div className="flex justify-start gap-10">
                <p className="text-sm">
                  <span className="font-bold">Total Amount: </span>
                  {formatDollar(amount)}
                </p>
                {recentEscrow && (
                  <p className="text-sm">
                    <span className="font-bold">Total Balance:</span>{" "}
                    {formatDollar(escrow?.balance)}
                  </p>
                )}
              </div>
            </DialogHeader>

            <div className="w-full grid grid-cols-2 gap-4 mt-3">
              <TransferAnimation
                title="Funds Released Successfully"
                fromLabel="Contract"
                fromAmount={formatDollar(amount).replace("$", "")}
                fromCurrency={escrow?.trustline?.name}
                toLabel="Distributed"
                toAmount={formatDollar(amount).replace("$", "")}
                toCurrency={escrow?.trustline?.name}
                additionalInfo={`Contract ID: ${escrow?.contractId?.slice(0, 8)}...${escrow?.contractId?.slice(-6)}`}
              />

              <motion.div
                className="flex flex-col gap-3 mt-3"
                variants={containerAnimation}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemAnimation}>
                  <EntityCard
                    type="Receiver"
                    entity={escrow?.roles?.receiver}
                    hasPercentage={true}
                    percentage={receiverPercentage.toString()}
                    hasAmount={true}
                    amount={receiverAmount.toString()}
                  />
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <EntityCard
                    type="Trustless Work"
                    entity={"0x"}
                    hasPercentage={true}
                    percentage={trustlessPercentage.toString()}
                    hasAmount={true}
                    amount={trustlessAmount.toString()}
                  />
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <EntityCard
                    type="Platform"
                    entity={escrow?.roles?.platformAddress}
                    hasPercentage={true}
                    percentage={platformFee.toString()}
                    hasAmount={true}
                    amount={platformAmount.toString()}
                  />
                </motion.div>
              </motion.div>
            </div>

            <DialogFooter className="mt-4">
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImprovedSuccessReleaseDialog;
