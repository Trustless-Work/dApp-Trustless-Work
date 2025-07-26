import { StateCreator } from "zustand";
import type { AuthenticationGlobalStore } from "../@types/authentication.entity";
import {
  addUser,
  getUser,
  updateUser,
} from "@/components/modules/auth/server/authentication.firebase";
import { UserPayload } from "@/@types/user.entity";

const AUTHENTICATION_ACTIONS = {
  CONNECT_WALLET: "authentication/connect",
  DISCONNECT_WALLET: "authentication/disconnect",
  UPDATE_USER: "authentication/updateUser",
  REMOVE_API_KEY: "authentication/removeApiKey",
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
    keyId: undefined,

    // Modifiers
    setKeyId: (keyId: string) => set({ keyId }),

    connectWalletStore: async (
      address: string,
      name: string,
      keyId?: string,
    ) => {
      const { success, data } = await getUser({ address });

      if (!success) {
        const { success: registrationSuccess, data: userData } = await addUser({
          address,
        });

        if (registrationSuccess) {
          set(
            { address, name, loggedUser: userData, keyId },
            false,
            AUTHENTICATION_ACTIONS.CONNECT_WALLET,
          );
        }
      } else {
        set(
          { address, name, loggedUser: data, keyId },
          false,
          AUTHENTICATION_ACTIONS.CONNECT_WALLET,
        );
      }
    },

    disconnectWalletStore: () =>
      set(
        { address: "", name: "", loggedUser: null, keyId: undefined },
        false,
        AUTHENTICATION_ACTIONS.DISCONNECT_WALLET,
      ),

    updateUser: async (address: string, payload: UserPayload) => {
      const { success, data } = await updateUser({
        address,
        payload,
      });

      if (success) {
        set({ loggedUser: data }, false, AUTHENTICATION_ACTIONS.UPDATE_USER);
      }
    },
  };
};
