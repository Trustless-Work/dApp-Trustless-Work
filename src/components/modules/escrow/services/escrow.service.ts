import { Escrow } from "@/@types/escrow.entity";
import { getAllEscrowsByUser, updateEscrow } from "../server/escrow.firebase";
import { useGetMultipleEscrowBalances } from "@trustless-work/escrow/hooks";

// Custom hook to handle balance fetching
export const useEscrowBalances = () => {
  const { getMultipleBalances } = useGetMultipleEscrowBalances();

  const fetchBalances = async (signer: string, addresses: string[]) => {
    return getMultipleBalances({
      signer,
      addresses,
    });
  };

  return { fetchBalances };
};

export const fetchAllEscrows = async ({
  address,
  type = "approver",
  isActive = true,
}: {
  address: string;
  type: string;
  isActive?: boolean;
}): Promise<Escrow[]> => {
  const escrowsByUser = await getAllEscrowsByUser({ address, type });
  // todo: pass this logic to the getAllEscrowsByUser function
  const filtered =
    typeof isActive === "boolean"
      ? escrowsByUser.data.filter((e: Escrow) => e.isActive === isActive)
      : escrowsByUser.data;

  return filtered;
};

export const updateExistingEscrow = async ({
  escrowId,
  payload,
}: {
  escrowId: string;
  payload: Partial<Escrow>;
}): Promise<Escrow | undefined> => {
  const response = await updateEscrow({
    escrowId,
    payload: { ...payload, balance: String(payload.balance || 0) },
  });
  return response?.data;
};
