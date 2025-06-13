import { BalanceItem, Escrow } from "@/@types/escrow.entity";
import { getAllEscrowsByUser, updateEscrow } from "../server/escrow.firebase";
import http from "@/core/config/axios/http";
import { MultiReleaseEscrow, SingleReleaseEscrow } from "@trustless-work/escrow";

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
  console.log({ filtered })
  const multiReleaseEscrow = filtered.filter((escrow: Escrow) => escrow.type === "multi-release");
  const singleReleaseEscrow = filtered.filter((escrow: Escrow) => escrow.type === "single-release");

  const multiReleaseEscrowContractsId = multiReleaseEscrow.map((escrow: Escrow) => escrow.contractId);
  const singleReleaseEscrowContractsId = singleReleaseEscrow.map((escrow: Escrow) => escrow.contractId);

  if (!Array.isArray(multiReleaseEscrowContractsId)) {
    throw new Error("contractIds is not a valid array.");
  }

  if (!Array.isArray(singleReleaseEscrowContractsId)) {
    throw new Error("contractIds is not a valid array.");
  }

  const { data: singleData } = await http.get(
    "/escrow/single-release/get-multiple-escrow-balance",
    {
      params: { addresses: singleReleaseEscrowContractsId, signer: address || "" },
    },
  );
  
  const { data: multiData } = await http.get(
    "/escrow/multi-release/get-multiple-escrow-balance",
    {
      params: { addresses: multiReleaseEscrowContractsId, signer: address || "" },
    },
  );

  const singleBalances = singleData as unknown as BalanceItem[];
  const multiBalances = multiData as unknown as BalanceItem[];

  const balancesMerged = [...singleBalances, ...multiBalances];

  return Promise.all(
    filtered.map(async (escrow: Escrow) => {
      const matchedBalance = balancesMerged.find(
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
  payload: Partial<Escrow>;
}): Promise<Escrow | undefined> => {
  const response = await updateEscrow({
    escrowId,
    payload: { ...payload, balance: String(payload.balance || 0) },
  });
  return response?.data;
};
