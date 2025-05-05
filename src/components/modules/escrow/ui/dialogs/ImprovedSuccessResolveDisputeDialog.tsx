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
import useSuccessResolveDisputeDialog from "./hooks/success-resolve-dispute-dialog.hook";
import Link from "next/link";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { Escrow } from "@/@types/escrow.entity";
import EntityCard from "./cards/EntityCard";
import { useGlobalBoundedStore } from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import TransferAnimation from "./TransferAnimation";
import { motion } from "framer-motion";

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

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const receiverResolveFromStore = useEscrowUIBoundedStore(
    (state) => state.receiverResolve,
  );
  const approverResolveFromStore = useEscrowUIBoundedStore(
    (state) => state.approverResolve,
  );

  const receiverResolve =
    receiverResolveFromStore && receiverResolveFromStore !== ""
      ? receiverResolveFromStore
      : selectedEscrow?.receiverFunds;

  const approverResolve =
    approverResolveFromStore && approverResolveFromStore !== ""
      ? approverResolveFromStore
      : selectedEscrow?.approverFunds;

  const escrow = selectedEscrow || recentEscrow;
  const { formatDollar } = useFormatUtils();

  const trustlessPercentage = 0.3;
  const trustlessWorkFee = 0.003;
  const platformPercentage = Number(escrow?.platformFee);

  const trustlessWorkAmount = Number(escrow?.amount) * trustlessWorkFee;
  const platformFee = parseFloat(escrow?.platformFee || "0");

  const parsedApproverFunds = parseFloat(approverResolve || "0") || 0;
  const parsedReceiverFunds = parseFloat(receiverResolve || "0") || 0;

  const approverDeductions =
    parsedApproverFunds * (platformFee / 100) +
    parsedApproverFunds * trustlessWorkFee;

  const receiverDeductions =
    parsedReceiverFunds * (platformFee / 100) +
    parsedReceiverFunds * trustlessWorkFee;

  const approverNet = parsedApproverFunds - approverDeductions;
  const receiverNet = parsedReceiverFunds - receiverDeductions;

  const totalPlatformAmount =
    selectedEscrow?.amount && !isNaN(Number(selectedEscrow.amount))
      ? Number(selectedEscrow.amount) * (platformFee / 100)
      : 0;

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
                  {formatDollar(escrow?.amount)}
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
                title="Dispute Resolved"
                fromLabel="Contract"
                fromAmount={formatDollar(escrow?.amount).replace("$", "")}
                fromCurrency="USD"
                toLabel="Resolution"
                toAmount={formatDollar(
                  Number(parsedApproverFunds) + Number(parsedReceiverFunds),
                ).replace("$", "")}
                toCurrency="USD"
                additionalInfo={
                  escrow?.contractId
                    ? `Contract ID: ${escrow.contractId.slice(0, 8)}...${escrow.contractId.slice(-6)}`
                    : "Unknown"
                }
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
                    entity={escrow?.receiver}
                    hasPercentage={false}
                    hasAmount={true}
                    isNet={true}
                    amount={receiverNet.toString()}
                  />
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <EntityCard
                    type="Approver"
                    entity={escrow?.approver}
                    hasPercentage={false}
                    hasAmount={true}
                    isNet={true}
                    amount={approverNet.toString()}
                  />
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <EntityCard
                    type="Trustless Work"
                    entity={"0x"}
                    hasPercentage={true}
                    percentage={trustlessPercentage.toString()}
                    hasAmount={true}
                    amount={trustlessWorkAmount.toString()}
                  />
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <EntityCard
                    type="Platform"
                    entity={escrow?.platformAddress}
                    hasPercentage={true}
                    percentage={platformPercentage.toString()}
                    hasAmount={true}
                    amount={totalPlatformAmount.toString()}
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

export default ImprovedSuccessResolveDisputeDialog;
