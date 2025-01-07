import { StateCreator } from "zustand";
import { AuthenticationGlobalStore } from "../@types/authentication.entity";
import {
  addUser,
  getUser,
} from "@/components/modules/auth/server/authentication-firebase";

const AUTHENTICATION_ACTIONS = {
  CONNECT_WALLET: "authentication/connect",
  DISCONNECT_WALLET: "authentication/disconnect",
} as const;

export const useGlobalAuthenticationSlice: StateCreator<
  AuthenticationGlobalStore,
  [["zustand/devtools", never]],
  [],
  AuthenticationGlobalStore
> = (set) => {
  return {
    // Stores
    address: "",
    name: "",
    loggedUser: null,

    // Modifiers
    connectWalletStore: async (address: string, name: string) => {
      const { success, data } = await getUser({ address });

      if (!success) {
        const { success: registrationSuccess, data: userData } = await addUser({
          address,
        });

        if (registrationSuccess) {
          set(
            { address, name, loggedUser: userData },
            false,
            AUTHENTICATION_ACTIONS.CONNECT_WALLET,
          );
        }
      } else {
        set(
          { address, name, loggedUser: data },
          false,
          AUTHENTICATION_ACTIONS.CONNECT_WALLET,
        );
      }
    },

    disconnectWalletStore: () =>
      set(
        { address: "", name: "", loggedUser: null },
        false,
        AUTHENTICATION_ACTIONS.DISCONNECT_WALLET,
      ),
  };
};
