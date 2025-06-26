import { useQuery } from "@tanstack/react-query";
import {
  GetEscrowsFromIndexerByRoleParams,
  useGetEscrowsFromIndexerByRole,
} from "@trustless-work/escrow";
import { useMemo } from "react";

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
}: GetEscrowsFromIndexerByRoleParams) => {
  const { getEscrowsByRole } = useGetEscrowsFromIndexerByRole();

  const queryKey = useMemo(
    () => ["escrows", roleAddress, role],
    [roleAddress, role],
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      const escrows = await getEscrowsByRole({
        params: {
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
        },
      });

      if (!escrows) {
        throw new Error("Failed to fetch escrows");
      }

      return escrows;
    },
    enabled: !!roleAddress && !!role,
    staleTime: 1000 * 60 * 5,
  });
};
