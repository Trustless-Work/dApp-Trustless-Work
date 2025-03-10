import type {
  Escrow,
  EscrowPayload,
  BalanceItem,
} from "@/@types/escrow.entity";
import {
  getAllEscrowsByUser,
  updateEscrow,
  addEscrow,
} from "../server/escrow.firebase";
import { getBalance } from "./get-balance.service";

export const fetchAllEscrows = async ({
  address,
  type = "approver",
}: {
  address: string;
  type: string;
}): Promise<Escrow[]> => {
  const escrowsByUser = await getAllEscrowsByUser({ address, type });
  const contractIds = escrowsByUser.data.map(
    (escrow: Escrow) => escrow.contractId,
  );

  if (!Array.isArray(contractIds)) {
    throw new Error("contractIds is not a valid array.");
  }

  const response = await getBalance(address, contractIds);
  const balances = response.data as BalanceItem[];

  return Promise.all(
    escrowsByUser.data.map(async (escrow: Escrow) => {
      const matchedBalance = balances.find(
        (item) => item.address === escrow.contractId,
      );

      const plainBalance = matchedBalance ? matchedBalance.balance : 0;
      const currentBalance = escrow.balance ? Number(escrow.balance) : 0;

      if (currentBalance !== plainBalance) {
        await updateEscrow({
          escrowId: escrow.id,
          payload: { balance: String(plainBalance) },
        });
        escrow.balance = String(plainBalance);
      }

      return escrow;
    }),
  );
};

export const addNewEscrow = async (
  payload: EscrowPayload,
  address: string,
  contractId: string,
): Promise<Escrow | undefined> => {
  const response = await addEscrow({ payload, address, contractId });
  return response?.data;
};

export const updateExistingEscrow = async ({
  escrowId,
  payload,
}: {
  escrowId: string;
  payload: Partial<EscrowPayload>;
}): Promise<Escrow | undefined> => {
  const response = await updateEscrow({
    escrowId,
    payload: { ...payload, balance: String(payload.balance || 0) },
  });
  return response?.data;
};
