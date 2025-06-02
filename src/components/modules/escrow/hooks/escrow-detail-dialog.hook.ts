import { getUserRoleInEscrow } from "../server/escrow.firebase";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEscrowUIBoundedStore } from "../store/ui";
import { Escrow } from "@/@types/escrows/escrow.entity";

interface EscrowDetailDialogProps {
  setIsDialogOpen: (value: boolean) => void;
  setSelectedEscrow: (selectedEscrow?: Escrow) => void;
  selectedEscrow: Escrow | null;
}

const useEscrowDetailDialog = ({
  setIsDialogOpen,
  setSelectedEscrow,
  selectedEscrow,
}: EscrowDetailDialogProps) => {
  const { address } = useGlobalAuthenticationStore();
  const userRolesInEscrow = useGlobalBoundedStore(
    (state) => state.userRolesInEscrow,
  );
  const setUserRolesInEscrow = useGlobalBoundedStore(
    (state) => state.setUserRolesInEscrow,
  );

  const setAmounts = useEscrowUIBoundedStore((state) => state.setAmounts);

  const fetchingRef = useRef(false);
  const lastFetchKey = useRef("");
  const [evidenceVisibleMap, setEvidenceVisibleMap] = useState<{
    [key: number]: boolean;
  }>({});

  const totalAmount = Number(selectedEscrow?.amount || 0);
  const platformFeePercentage = Number(selectedEscrow?.platformFee || 0);

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedEscrow(undefined);
  }, [setIsDialogOpen, setSelectedEscrow]);

  const areAllMilestonesCompleted =
    selectedEscrow?.milestones?.every(
      (milestone) => milestone.status === "completed",
    ) ?? false;

  const areAllMilestonesCompletedAndFlag =
    selectedEscrow?.milestones?.every(
      (milestone) => milestone.approvedFlag === true,
    ) ?? false;

  const fetchUserRoleInEscrow = useCallback(async () => {
    if (!selectedEscrow?.contractId || !address) return null;
    return getUserRoleInEscrow({
      contractId: selectedEscrow.contractId,
      address,
    });
  }, [selectedEscrow?.contractId, address]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;
    let isMounted = true;

    const fetchRoles = async () => {
      if (!selectedEscrow || !address || fetchingRef.current) return;

      const fetchKey = `${selectedEscrow.contractId}-${address}`;
      if (fetchKey === lastFetchKey.current) return;

      try {
        fetchingRef.current = true;
        lastFetchKey.current = fetchKey;
        const roleData = await fetchUserRoleInEscrow();
        if (isMounted && roleData) {
          setUserRolesInEscrow(roleData.roles || []);
        }
      } catch (error) {
        console.error("[EscrowDetailDialog] Error fetching roles:", error);
      } finally {
        fetchingRef.current = false;
      }
    };

    timeoutId = setTimeout(fetchRoles, 100);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      fetchingRef.current = false;
    };
  }, [selectedEscrow, fetchUserRoleInEscrow, setUserRolesInEscrow, address]);

  useEffect(() => {
    setAmounts(totalAmount, platformFeePercentage);
  }, [totalAmount, platformFeePercentage, setAmounts]);

  return {
    handleClose,
    setEvidenceVisibleMap,
    evidenceVisibleMap,
    areAllMilestonesCompleted,
    areAllMilestonesCompletedAndFlag,
    userRolesInEscrow,
  };
};

export default useEscrowDetailDialog;
