import { useQuery } from "@tanstack/react-query";
import {
  GetEscrowsFromIndexerBySignerParams,
  useGetEscrowsFromIndexerBySigner,
} from "@trustless-work/escrow";

interface UseEscrowsBySignerQueryParams
  extends GetEscrowsFromIndexerBySignerParams {
  enabled?: boolean;
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
  enabled = true,
}: UseEscrowsBySignerQueryParams) => {
  const { getEscrowsBySigner } = useGetEscrowsFromIndexerBySigner();

  return useQuery({
    queryKey: [
      "escrows",
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
    ],
    queryFn: async () => {
      const escrows = await getEscrowsBySigner({
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
        validateOnChain: true,
      });

      if (!escrows) {
        throw new Error("Failed to fetch escrows");
      }

      return escrows;
    },
    enabled: enabled && !!signer,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
