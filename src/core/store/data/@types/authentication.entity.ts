import { User, UserPayload } from "@/@types/user.entity";

export interface AuthenticationGlobalStore {
  address: string;
  name: string;
  loggedUser: User | null;
  users: User[];

  connectWalletStore: (address: string, name: string) => void;
  disconnectWalletStore: () => void;
  updateUser: (address: string, payload: UserPayload) => void;
  getAllUsers: () => void;
}
