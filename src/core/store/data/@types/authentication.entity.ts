import { User } from "@/@types/user.entity";

export interface AuthenticationGlobalStore {
  address: string;
  name: string;
  loggedUser: User | null;

  connectWalletStore: (address: string, name: string) => void;
  disconnectWalletStore: () => void;
}
