import * as React from "react";
import { Button } from "@/ui/button";
import { useEscrowsMutations } from "@/components/tw-blocks/tanstack/useEscrowsMutations";
import { useWalletContext } from "@/components/tw-blocks/wallet-kit/WalletProvider";
import { SingleReleaseStartDisputePayload } from "@trustless-work/escrow/types";
import { toast } from "sonner";
import {
  ErrorResponse,
  handleError,
} from "@/components/tw-blocks/handle-errors/handle";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { Loader2 } from "lucide-react";

export const DisputeEscrowButton = () => {
  const { startDispute } = useEscrowsMutations();
  const { selectedEscrow, updateEscrow } = useEscrowContext();
  const { walletAddress } = useWalletContext();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleClick() {
    try {
      setIsSubmitting(true);

      /**
       * Create the payload for the dispute escrow mutation
       *
       * @returns The payload for the dispute escrow mutation
       */
      const payload: SingleReleaseStartDisputePayload = {
        contractId: selectedEscrow?.contractId || "",
        signer: walletAddress || "",
      };

      /**
       * Call the dispute escrow mutation
       *
       * @param payload - The payload for the dispute escrow mutation
       * @param type - The type of the escrow
       * @param address - The address of the escrow
       */
      await startDispute.mutateAsync({
        payload,
        type: "single-release",
        address: walletAddress || "",
      });

      toast.success("Escrow disputed successfully");

      updateEscrow({
        ...selectedEscrow,
        flags: {
          ...selectedEscrow?.flags,
          disputed: true,
        },
      });
    } catch (error) {
      toast.error(handleError(error as ErrorResponse).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button
      type="button"
      disabled={isSubmitting || !selectedEscrow?.balance}
      onClick={handleClick}
      className="cursor-pointer w-full"
    >
      {isSubmitting ? (
        <div className="flex items-center">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="ml-2">Disputing...</span>
        </div>
      ) : (
        "Dispute Escrow"
      )}
    </Button>
  );
};
