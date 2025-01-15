import { Escrow, Milestone } from "@/@types/escrow.entity";
import { statusMap, statusOptions } from "@/constants/escrow/StatusOptions";
import { getUserRoleInEscrow } from "../../../server/escrow-firebase";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useEffect, useState } from "react";
import { useFormatUtils } from "@/utils/hook/format.hook";

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
  const [role, setRole] = useState<string | undefined>(undefined);
  const { formatText } = useFormatUtils();

  const address = useGlobalAuthenticationStore((state) => state.address);

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

  const userRoleInEscrow = async () => {
    const { contractId } = selectedEscrow || {};
    const data = await getUserRoleInEscrow({ contractId, address });

    return data;
  };

  useEffect(() => {
    const fetchRole = async () => {
      if (selectedEscrow) {
        const roleData = await userRoleInEscrow();

        setRole(formatText(roleData?.role));
      }
    };

    fetchRole();
  }, [selectedEscrow, userRoleInEscrow]);

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
    userRoleInEscrow,
    role,
  };
};

export default useEscrowDetailDialog;
