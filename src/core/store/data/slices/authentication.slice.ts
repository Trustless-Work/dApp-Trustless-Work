import { StateCreator } from "zustand";
import { AuthenticationGlobalStore } from "../@types/authentication.entity";
import { UserPayload, User } from "@/@types/user.entity";
import { AuthService } from "@/components/modules/auth/services/auth.service";

const AUTHENTICATION_ACTIONS = {
  CONNECT_WALLET: "authentication/connect",
  DISCONNECT_WALLET: "authentication/disconnect",
  UPDATE_USER: "authentication/updateUser",
  REFRESH_USER: "authentication/refreshUser",
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
      const data = await new AuthService().getUser(address);

      if (!data) {
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

    updateUser: async (address: string, payload: UserPayload | User) => {
      // If payload is a complete User object, just update the state
      if ("id" in payload && "createdAt" in payload && "updatedAt" in payload) {
        set(
          { loggedUser: payload as User },
          false,
          AUTHENTICATION_ACTIONS.UPDATE_USER,
        );
        return;
      }

      // If payload is UserPayload, update via API and then refresh
      const data = await new AuthService().updateUser(
        address,
        payload as UserPayload,
      );

      if (data) {
        set({ loggedUser: data }, false, AUTHENTICATION_ACTIONS.UPDATE_USER);
      }
    },

    refreshUser: async (address: string) => {
      const data = await new AuthService().getUser(address);

      if (data) {
        set({ loggedUser: data }, false, AUTHENTICATION_ACTIONS.REFRESH_USER);
      }
    },
  };
};
