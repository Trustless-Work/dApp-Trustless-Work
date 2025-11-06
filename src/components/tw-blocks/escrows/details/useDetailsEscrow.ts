import { useCallback, useEffect, useRef, useState } from "react";
import {
  GetEscrowsFromIndexerResponse as Escrow,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import { useEscrowContext } from "@/providers/EscrowProvider";
import { useEscrowAmountContext } from "@/providers/EscrowAmountProvider";
import { useGlobalAuthenticationStore } from "@/store/data";

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
  const walletAddress = useGlobalAuthenticationStore((state) => state.address);
  const { userRolesInEscrow, setUserRolesInEscrow } = useEscrowContext();

  const { setAmounts } = useEscrowAmountContext();

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

  const areAllMilestonesApproved =
    selectedEscrow?.milestones?.every((milestone) => {
      if ("flags" in milestone) {
        return milestone.flags?.approved === true;
      }
      return "approved" in milestone && milestone.approved === true;
    }) ?? false;

  const fetchUserRoleInEscrow = useCallback(async () => {
    if (!selectedEscrow?.contractId || !walletAddress) return null;

    const roleMappings = [
      { name: "approver", address: selectedEscrow.roles.approver },
      {
        name: "serviceProvider",
        address: selectedEscrow.roles.serviceProvider,
      },
      {
        name: "platformAddress",
        address: selectedEscrow.roles.platformAddress,
      },
      { name: "releaseSigner", address: selectedEscrow.roles.releaseSigner },
      {
        name: "disputeResolver",
        address: selectedEscrow.roles.disputeResolver,
      },
      {
        name: "receiver",
        address:
          selectedEscrow.type === "single-release"
            ? (selectedEscrow.roles as { receiver?: string })?.receiver
            : (
                selectedEscrow.milestones?.[0] as
                  | MultiReleaseMilestone
                  | undefined
              )?.receiver,
      },
    ];

    const userRoles = roleMappings
      .filter((role) => role.address === walletAddress)
      .map((role) => role.name);

    return userRoles;
  }, [selectedEscrow?.contractId, walletAddress]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;
    let isMounted = true;

    const fetchRoles = async () => {
      if (!selectedEscrow || !walletAddress || fetchingRef.current) return;

      const fetchKey = `${selectedEscrow.contractId}-${walletAddress}`;
      if (fetchKey === lastFetchKey.current) return;

      try {
        fetchingRef.current = true;
        lastFetchKey.current = fetchKey;
        const roleData = await fetchUserRoleInEscrow();
        if (isMounted && roleData) {
          setUserRolesInEscrow(roleData);
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
  }, [
    selectedEscrow,
    fetchUserRoleInEscrow,
    setUserRolesInEscrow,
    walletAddress,
  ]);

  useEffect(() => {
    setAmounts(totalAmount, platformFeePercentage);
  }, [totalAmount, platformFeePercentage, setAmounts]);

  return {
    handleClose,
    setEvidenceVisibleMap,
    evidenceVisibleMap,
    areAllMilestonesApproved,
    userRolesInEscrow,
  };
};

export default useEscrowDetailDialog;
