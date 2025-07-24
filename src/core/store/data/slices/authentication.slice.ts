import { StateCreator } from "zustand";
import { AuthenticationGlobalStore } from "../@types/authentication.entity";
import { UserPayload } from "@/@types/user.entity";
import { AuthService } from "@/components/modules/auth/services/auth.service";

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

    // Modifiers
    connectWalletStore: async (address: string, name: string) => {
      const { success, data } = await new AuthService().getUser(address);

      if (!success) {
        const { success: registrationSuccess, data: userData } =
          await new AuthService().createUser(address);

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

    updateUser: async (address: string, payload: UserPayload) => {
      const { success, data } = await new AuthService().updateUser(
        address,
        payload,
      );

      if (success) {
        set({ loggedUser: data }, false, AUTHENTICATION_ACTIONS.UPDATE_USER);
      }
    },
  };
};
