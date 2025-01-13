import { Escrow, Milestone } from "@/@types/escrow.entity";
import { useEffect } from "react";
import { getBalance } from "../../../services/getBalance";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { statusMap, statusOptions } from "@/constants/escrow/StatusOptions";

interface useEscrowDetailDialogProps {
  setIsDialogOpen: (value: boolean) => void;
  setSelectedEscrow: (selectedEscrow?: Escrow) => void;
  selectedEscrow: Escrow | null;
}

const useEscrowDetailDialog = ({
  setIsDialogOpen,
  setSelectedEscrow,
  selectedEscrow,
}: useEscrowDetailDialogProps) => {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const updateEscrow = useGlobalBoundedStore((state) => state.updateEscrow);

  useEffect(() => {
    const fetchBalance = async () => {
      if (selectedEscrow) {
        const response = await getBalance(selectedEscrow?.contractId, address);

        const balance = response.data.balance;
        const plainBalance = JSON.parse(JSON.stringify(balance));

        if (selectedEscrow.balance !== plainBalance) {
          await updateEscrow({
            escrowId: selectedEscrow.id,
            payload: plainBalance,
          });
        }
      }
    };

    fetchBalance();
  }, [selectedEscrow]);

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedEscrow(undefined);
  };

  const areAllMilestonesCompleted =
    selectedEscrow?.milestones
      ?.map((milestone) => milestone.status)
      .every((status) => status === "completed") ?? false;

  const getFilteredStatusOptions = (currentStatus: string | undefined) => {
    const nextStatuses = statusMap[currentStatus || ""] || [];
    return statusOptions.filter((option) =>
      nextStatuses.includes(option.value),
    );
  };

  const getButtonLabel = (status: string | undefined): string => {
    const buttonLabels: Record<string, string> = {
      pending: "Submit for Review",
      approved: "Release Payment",
      inDispute: "Resolve Dispute",
    };

    return buttonLabels[status || ""];
  };

  const handleButtonClick = (milestone: Milestone) => {
    switch (milestone.status) {
      case "pending":
        console.log("Submitting milestone for review...");
        break;
      case "forReview":
        console.log("Approving or disputing milestone...");
        break;
      case "approved":
        console.log("Releasing payment for milestone...");
        break;
      case "inDispute":
        console.log("Resolving dispute for milestone...");
        break;
      default:
        console.log("No action available.");
    }
  };

  return {
    handleClose,
    areAllMilestonesCompleted,
    getFilteredStatusOptions,
    getButtonLabel,
    handleButtonClick,
  };
};

export default useEscrowDetailDialog;
