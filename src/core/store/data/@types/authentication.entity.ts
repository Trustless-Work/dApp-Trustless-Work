import { User, UserPayload } from "@/@types/user.entity";

export interface AuthenticationGlobalStore {
  address: string;
  name: string;
  loggedUser: Omit<User, "id"> | null;

  connectWalletStore: (address: string, name: string) => void;
  disconnectWalletStore: () => void;
  updateUser: (address: string, payload: UserPayload | User) => void;
  refreshUser: (address: string) => void;
}
