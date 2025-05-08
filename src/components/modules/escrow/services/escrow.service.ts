import type { Escrow, BalanceItem } from "@/@types/escrows/escrow.entity";
import { getAllEscrowsByUser, updateEscrow } from "../server/escrow.firebase";
import { EscrowPayload } from "@/@types/escrows/escrow-payload.entity";
import { trustlessWorkService } from "./trustless-work.service";
import { EscrowRequestResponse } from "@/@types/escrows/escrow-response.entity";

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

  const contractIds = filtered.map((escrow: Escrow) => escrow.contractId);

  if (!Array.isArray(contractIds)) {
    throw new Error("contractIds is not a valid array.");
  }

  const response = (await trustlessWorkService({
    payload: { signer: address || "", addresses: contractIds },
    endpoint: "/helper/get-multiple-escrow-balance",
    method: "get",
    requiresSignature: false,
    returnEscrowDataIsRequired: false,
  })) as EscrowRequestResponse;

  const balances = response.data as BalanceItem[];

  return Promise.all(
    filtered.map(async (escrow: Escrow) => {
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
