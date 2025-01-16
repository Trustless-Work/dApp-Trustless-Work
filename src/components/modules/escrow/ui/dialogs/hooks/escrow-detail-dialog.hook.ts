import { Escrow, Milestone } from "@/@types/escrow.entity";
import { statusMap, statusOptions } from "@/constants/escrow/StatusOptions";
import { getUserRoleInEscrow } from "../../../server/escrow-firebase";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useEffect, useState } from "react";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { changeMilestoneStatus } from "../../../services/changeMilestoneStatus";
import { distributeEscrowEarnings } from "../../../services/distributeEscrowEarnings";

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
  // const updateEscrow = useGlobalBoundedStore((state) => state.updateEscrow);

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

  const handleButtonClick = (selectedEscrow: Escrow, milestone: Milestone) => {
    switch (milestone.status) {
      // ! PASAR A ZUSTAND, PARA ACTUALIZAR FIREBASE Y STATE GLOBAL

      case "pending":
        changeMilestoneStatus({
          contractId: selectedEscrow?.contractId,
          milestoneIndex: "0",
          newStatus: "completed",
          // serviceProvider: selectedEscrow?.serviceProvider,
          serviceProvider: address,
        });

        // updateEscrow({escrowId: selectedEscrow.id, payload: selectedEscrow.milestones[0]});
        break;
      case "forReview":
        changeMilestoneStatus({
          contractId: selectedEscrow?.contractId,
          milestoneIndex: "0",
          newStatus: "approved",
          serviceProvider: selectedEscrow?.serviceProvider,
        });

        // updateEscrow({escrowId: selectedEscrow.id, payload: selectedEscrow.milestones[0]});
        break;
      case "approved":
        changeMilestoneStatus({
          contractId: selectedEscrow?.contractId,
          milestoneIndex: "0",
          newStatus: "forReview",
          serviceProvider: selectedEscrow?.serviceProvider,
        });

        // updateEscrow({escrowId: selectedEscrow.id, payload: selectedEscrow.milestones[0]});
        break;
      case "inDispute":
        changeMilestoneStatus({
          contractId: selectedEscrow?.contractId,
          milestoneIndex: "0",
          newStatus: "forReview",
          serviceProvider: selectedEscrow?.serviceProvider,
        });

        // updateEscrow({escrowId: selectedEscrow.id, payload: selectedEscrow.milestones[0]});
        break;
      default:
        console.log("No action available.");
    }
  };

  const distributeEscrowEarningsRelease = async () => {
    distributeEscrowEarnings({
      contractId: selectedEscrow?.contractId,
      signer: address,
      serviceProvider: selectedEscrow?.serviceProvider,
      releaseSigner: selectedEscrow?.releaseSigner,
    });
  };

  return {
    handleClose,
    areAllMilestonesCompleted,
    getFilteredStatusOptions,
    getButtonLabel,
    handleButtonClick,
    userRoleInEscrow,
    role,
    distributeEscrowEarningsRelease,
  };
};

export default useEscrowDetailDialog;
