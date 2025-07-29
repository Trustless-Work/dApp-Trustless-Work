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
      try {
        const data = await new AuthService().getUser(address);

        if (!data) {
          const { message } = await new AuthService().createUser(address);

          // ! todo: remove this, this is a temporary solution to avoid the error. Then we should use the data from the API -> Waiting for CALEB
          const userData = {
            createdAt: {
              _seconds: 0,
              _nanoseconds: 0,
            },
            updatedAt: {
              _seconds: 0,
              _nanoseconds: 0,
            },
            address,
          };

          if (message) {
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
      } catch (error) {
        console.error("Error in connectWalletStore:", error);
        throw error;
      }
    },

    disconnectWalletStore: () =>
      set(
        { address: "", name: "", loggedUser: null },
        false,
        AUTHENTICATION_ACTIONS.DISCONNECT_WALLET,
      ),

    updateUser: async (address: string, payload: UserPayload | User) => {
      if ("createdAt" in payload && "updatedAt" in payload) {
        set(
          { loggedUser: payload as User },
          false,
          AUTHENTICATION_ACTIONS.UPDATE_USER,
        );
        return;
      }

      console.log(payload);

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
      try {
        const data = await new AuthService().getUser(address);

        if (data) {
          set({ loggedUser: data }, false, AUTHENTICATION_ACTIONS.REFRESH_USER);
        }
      } catch (error) {
        console.error("Error in refreshUser:", error);
        throw error;
      }
    },
  };
};
