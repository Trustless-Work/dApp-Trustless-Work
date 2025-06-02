import { CreatedAt, UpdatedAt } from "./dates.entity";

export enum WalletType {
  ALBEDO = "Albedo",
  LOBSTR = "LOBSTR",
  FREIGHTER = "Freighter",
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  address: string;
  walletType: WalletType;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}
