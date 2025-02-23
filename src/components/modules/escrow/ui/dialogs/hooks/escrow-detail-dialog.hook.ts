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
import { useCallback, useEffect } from "react";

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
  const { address } = useGlobalAuthenticationStore();
  const userRolesInEscrow = useGlobalBoundedStore(
    (state) => state.userRolesInEscrow,
  );
  const setUserRolesInEscrow = useGlobalBoundedStore(
    (state) => state.setUserRolesInEscrow,
  );

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedEscrow(undefined);
  }, [setIsDialogOpen, setSelectedEscrow]);

  const areAllMilestonesCompleted =
    selectedEscrow?.milestones
      ?.map((milestone) => milestone.status)
      .every((status) => status === "completed") ?? false;

  const areAllMilestonesCompletedAndFlag =
    selectedEscrow?.milestones
      ?.map((milestone) => milestone.flag)
      .every((flag) => flag === true) ?? false;

  const getFilteredStatusOptions = useCallback((currentStatus: string | undefined) => {
    const nextStatuses = statusMap[currentStatus || ""] || [];
    return statusOptions.filter((option) =>
      nextStatuses.includes(option.value),
    );
  }, []);

  const fetchUserRoleInEscrow = useCallback(async () => {
    const { contractId } = selectedEscrow || {};
    const data = await getUserRoleInEscrow({ contractId, address });
    return data;
  }, [selectedEscrow, address]);

  useEffect(() => {
    const fetchRoles = async () => {
      if (selectedEscrow) {
        const roleData = await fetchUserRoleInEscrow();
        setUserRolesInEscrow(roleData?.roles || []);
      }
    };

    fetchRoles();
  }, [selectedEscrow, fetchUserRoleInEscrow, setUserRolesInEscrow]);

  return {
    handleClose,
    areAllMilestonesCompleted,
    areAllMilestonesCompletedAndFlag,
    getFilteredStatusOptions,
    fetchUserRoleInEscrow,
    userRolesInEscrow,
  };
};

export default useEscrowDetailDialog;
