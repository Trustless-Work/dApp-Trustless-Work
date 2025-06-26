import { useQuery } from "@tanstack/react-query";
import { useGetEscrowsFromIndexerBySigner } from "@trustless-work/escrow";
import { useMemo } from "react";
import { SingleReleaseEscrowStatus } from "@/@types/escrow.entity";
import { EscrowType } from "@trustless-work/escrow";

interface GetEscrowsFromIndexerBySignerParams {
  signer: string;
  isActive?: boolean;
  page?: number;
  orderDirection?: "asc" | "desc";
  orderBy?: "createdAt" | "updatedAt" | "amount";
  startDate?: string;
  endDate?: string;
  maxAmount?: number;
  minAmount?: number;
  title?: string;
  engagementId?: string;
  status?: SingleReleaseEscrowStatus;
  type?: EscrowType;
}

export const useEscrowsBySignerQuery = ({
  signer,
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
}: GetEscrowsFromIndexerBySignerParams) => {
  const { getEscrowsBySigner } = useGetEscrowsFromIndexerBySigner();

  const queryKey = useMemo(() => ["escrows", signer], [signer]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const escrows = await getEscrowsBySigner({
        params: {
          signer,
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
    enabled: !!signer,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
