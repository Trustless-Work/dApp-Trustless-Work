import { useQuery } from "@tanstack/react-query";
import {
  GetEscrowBalancesResponse,
  GetBalanceParams,
} from "@trustless-work/escrow/types";
import { useGetMultipleEscrowBalances } from "@trustless-work/escrow/hooks";

/**
 * Use the query to get the escrows balances
 *
 * @param params - The parameters for the query
 * @returns The query result
 */
export const useGetMultipleEscrowBalancesQuery = ({
  addresses,
  enabled = true,
}: GetBalanceParams & { enabled?: boolean }) => {
  const { getMultipleBalances } = useGetMultipleEscrowBalances();

  // Get the escrows by signer
  return useQuery({
    queryKey: ["escrows", addresses],
    queryFn: async (): Promise<GetEscrowBalancesResponse[]> => {
      /**
       * Call the query to get the escrows from the Trustless Work Indexer
       *
       * @param params - The parameters for the query
       * @returns The query result
       */
      const balances = await getMultipleBalances({ addresses });

      if (!balances) {
        throw new Error("Escrows not found");
      }

      return balances;
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
