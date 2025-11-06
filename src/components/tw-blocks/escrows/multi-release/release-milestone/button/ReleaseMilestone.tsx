import * as React from "react";
import { Button } from "@/ui/button";
import { useEscrowsMutations } from "@/components/tw-blocks/tanstack/useEscrowsMutations";
import {
  MultiReleaseReleaseFundsPayload,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import { toast } from "sonner";
import {
  ErrorResponse,
  handleError,
} from "@/components/tw-blocks/handle-errors/handle";
import { useEscrowContext } from "@/providers/EscrowProvider";
import { useEscrowDialogs } from "@/providers/EscrowDialogsProvider";
import { useEscrowAmountContext } from "@/providers/EscrowAmountProvider";
import { Loader2 } from "lucide-react";
import { useGlobalAuthenticationStore } from "@/store/data";

type ReleaseMilestoneButtonProps = {
  milestoneIndex: number | string;
};

export const ReleaseMilestoneButton = ({
  milestoneIndex,
}: ReleaseMilestoneButtonProps) => {
  const { releaseFunds } = useEscrowsMutations();
  const { selectedEscrow, updateEscrow } = useEscrowContext();
  const dialogStates = useEscrowDialogs();
  const { setAmounts, setLastReleasedMilestoneIndex } =
    useEscrowAmountContext();
  const walletAddress = useGlobalAuthenticationStore((state) => state.address);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleClick() {
    try {
      setIsSubmitting(true);

      /**
       * Create the payload for the release escrow mutation
       *
       * @returns The payload for the release escrow mutation
       */
      const payload: MultiReleaseReleaseFundsPayload = {
        contractId: selectedEscrow?.contractId || "",
        releaseSigner: walletAddress || "",
        milestoneIndex: String(milestoneIndex),
      };

      /**
       * Call the release escrow mutation
       *
       * @param payload - The payload for the release escrow mutation
       * @param type - The type of the escrow
       * @param address - The address of the escrow
       */
      await releaseFunds.mutateAsync({
        payload,
        type: "multi-release",
        address: walletAddress || "",
      });

      toast.success("Milestone released successfully");

      // Ensure amounts are up to date for the success dialog
      if (selectedEscrow) {
        const milestone = selectedEscrow.milestones?.[Number(milestoneIndex)];
        const releasedAmount = Number(
          (milestone as MultiReleaseMilestone | undefined)?.amount || 0,
        );
        const platformFee = Number(selectedEscrow.platformFee || 0);
        setAmounts(releasedAmount, platformFee);
      }

      updateEscrow({
        ...selectedEscrow,
        milestones: selectedEscrow?.milestones.map((milestone, index) => {
          if (index === Number(milestoneIndex)) {
            return {
              ...milestone,
              flags: {
                ...(milestone as MultiReleaseMilestone).flags,
                released: true,
              },
            };
          }
          return milestone;
        }),
        balance: (selectedEscrow?.balance || 0) - (selectedEscrow?.amount || 0),
      });

      // Remember which milestone was released for the success dialog
      setLastReleasedMilestoneIndex(Number(milestoneIndex));

      // Open success dialog
      dialogStates.successRelease.setIsOpen(true);
    } catch (error) {
      toast.error(handleError(error as ErrorResponse).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button
      type="button"
      disabled={isSubmitting}
      onClick={handleClick}
      className="cursor-pointer w-full"
    >
      {isSubmitting ? (
        <div className="flex items-center">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="ml-2">Releasing...</span>
        </div>
      ) : (
        "Release Milestone"
      )}
    </Button>
  );
};
