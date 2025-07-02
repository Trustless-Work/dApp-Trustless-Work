import { Escrow } from "@/@types/escrow.entity";
import { useQuery } from "@tanstack/react-query";
import {
  GetEscrowsFromIndexerByRoleParams,
  useGetEscrowsFromIndexerByRole,
} from "@trustless-work/escrow";

interface UseEscrowsByRoleQueryParams
  extends GetEscrowsFromIndexerByRoleParams {
  enabled?: boolean;
}

export const useEscrowsByRoleQuery = ({
  role,
  roleAddress,
  isActive = true,
  page,
  orderDirection,
  orderBy,
  startDate,
  endDate,
  maxAmount,
  minAmount,
  title,
  engagementId,
  status,
  type,
  enabled = true,
}: UseEscrowsByRoleQueryParams) => {
  const { getEscrowsByRole } = useGetEscrowsFromIndexerByRole();

  return useQuery({
    queryKey: [
      "escrows",
      roleAddress,
      role,
      isActive,
      page,
      orderDirection,
      orderBy,
      startDate,
      endDate,
      maxAmount,
      minAmount,
      title,
      engagementId,
      status,
      type,
    ],
    queryFn: async (): Promise<Escrow[]> => {
      const escrows = await getEscrowsByRole({
        role,
        roleAddress,
        isActive,
        page,
        orderDirection,
        orderBy,
        startDate,
        endDate,
        maxAmount,
        minAmount,
        title,
        engagementId,
        status,
        type,
        validateOnChain: true,
      });

      if (!escrows) {
        throw new Error("Failed to fetch escrows");
      }

      return escrows;
    },
    enabled: enabled && !!roleAddress && !!role,
    staleTime: 1000 * 60 * 5,
  });
};
