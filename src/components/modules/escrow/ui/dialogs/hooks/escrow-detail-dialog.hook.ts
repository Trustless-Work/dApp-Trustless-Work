import {
  Escrow,
  EscrowPayload,
  Milestone,
  MilestoneStatus,
} from "@/@types/escrow.entity";
import { statusMap, statusOptions } from "@/constants/escrow/StatusOptions";
import { getUserRoleInEscrow } from "../../../server/escrow-firebase";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEffect, useState } from "react";
import { changeMilestoneStatus } from "../../../services/changeMilestoneStatus";
import { useEscrowBoundedStore } from "../../../store/ui";
import { useToast } from "@/hooks/use-toast";
import { changeMilestoneFlag } from "../../../services/changeMilestoneFlag";

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
  const { toast } = useToast();

  const address = useGlobalAuthenticationStore((state) => state.address);
  const updateEscrow = useGlobalBoundedStore((state) => state.updateEscrow);
  const setIsChangingStatus = useEscrowBoundedStore(
    (state) => state.setIsChangingStatus,
  );

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedEscrow(undefined);
  };

  const areAllMilestonesCompleted =
    selectedEscrow?.milestones
      ?.map((milestone) => milestone.status)
      .every((status) => status === "completed") ?? false;

  const areAllMilestonesCompletedAndFlag =
    selectedEscrow?.milestones
      ?.map((milestone) => milestone.flag)
      .every((flag) => flag === true) ?? false;

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

        setRole(roleData?.role);
      }
    };

    fetchRole();
  }, [selectedEscrow, userRoleInEscrow]);

  const handleButtonClick = async (
    selectedEscrow: Escrow,
    milestone: Milestone,
    index: number,
  ) => {
    switch (milestone.status) {
      case "pending":
        setIsChangingStatus(true);

        await changeMilestoneStatus({
          contractId: selectedEscrow?.contractId,
          milestoneIndex: index.toString(),
          newStatus: "completed",
          serviceProvider: address,
        });

        const updatedMilestonesStatus = selectedEscrow.milestones.map(
          (m, i): Milestone =>
            i === index
              ? {
                  ...m,
                  status: "completed" as MilestoneStatus,
                }
              : m,
        );

        const updatedPayloadStatus: EscrowPayload = {
          ...selectedEscrow,
          milestones: updatedMilestonesStatus,
        };

        const responseStatus = await updateEscrow({
          escrowId: selectedEscrow.id,
          payload: updatedPayloadStatus,
        });

        setIsChangingStatus(false);

        if (responseStatus) {
          handleClose();
          toast({
            title: "Success",
            description: "The Milestone has been completed.",
          });
        }

        break;
      case "completed":
        setIsChangingStatus(true);

        await changeMilestoneFlag({
          contractId: selectedEscrow?.contractId,
          milestoneIndex: index.toString(),
          newFlag: true,
          client: address,
        });

        const updatedMilestonesFlag = selectedEscrow.milestones.map(
          (m, i): Milestone =>
            i === index
              ? {
                  ...m,
                  flag: true,
                }
              : m,
        );

        const updatedPayloadFlag: EscrowPayload = {
          ...selectedEscrow,
          milestones: updatedMilestonesFlag,
        };

        const responseFlag = await updateEscrow({
          escrowId: selectedEscrow.id,
          payload: updatedPayloadFlag,
        });

        setIsChangingStatus(false);

        if (responseFlag) {
          handleClose();
          toast({
            title: "Success",
            description: "The Milestone has been approved.",
          });
        }

        break;
      default:
        console.log("No action available.");
    }
  };

  return {
    handleClose,
    areAllMilestonesCompleted,
    areAllMilestonesCompletedAndFlag,
    getFilteredStatusOptions,
    handleButtonClick,
    userRoleInEscrow,
    role,
  };
};

export default useEscrowDetailDialog;
