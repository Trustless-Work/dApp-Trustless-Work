import { Escrow } from "@/@types/escrow.entity";
import {
  statusMap,
  statusOptions,
} from "@/components/modules/escrow/constants/status-options.constant";
import { getUserRoleInEscrow } from "../../../server/escrow.firebase";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEffect } from "react";

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
  const userRoleInEscrow = useGlobalBoundedStore(
    (state) => state.userRoleInEscrow,
  );
  const setUserRoleInEscrow = useGlobalBoundedStore(
    (state) => state.setUserRoleInEscrow,
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

  const fetchUserRoleInEscrow = async () => {
    const { contractId } = selectedEscrow || {};
    const data = await getUserRoleInEscrow({ contractId, address });

    return data;
  };

  useEffect(() => {
    const fetchRole = async () => {
      if (selectedEscrow) {
        const roleData = await fetchUserRoleInEscrow();

        setUserRoleInEscrow(roleData?.role);
      }
    };

    fetchRole();
  }, [selectedEscrow, userRoleInEscrow]);

  return {
    handleClose,
    areAllMilestonesCompleted,
    areAllMilestonesCompletedAndFlag,
    getFilteredStatusOptions,
    fetchUserRoleInEscrow,
    userRoleInEscrow,
  };
};

export default useEscrowDetailDialog;
