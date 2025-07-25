import { User, UserPayload } from "@/@types/user.entity";

export interface AuthenticationGlobalStore {
  address: string;
  name: string;
  loggedUser: User | null;
  keyId?: string;

  connectWalletStore: (address: string, name: string, keyId?: string) => void;
  disconnectWalletStore: () => void;
  updateUser: (address: string, payload: UserPayload) => void;
  setKeyId: (keyId: string) => void;
}
