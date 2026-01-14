import { StateCreator } from "zustand";
import { UserPayload, User } from "@/types/user.entity";
import { AuthService } from "@/modules/auth/services/auth.service";

const AUTHENTICATION_ACTIONS = {
  CONNECT_WALLET: "authentication/connect",
  DISCONNECT_WALLET: "authentication/disconnect",
  UPDATE_USER: "authentication/updateUser",
  REFRESH_USER: "authentication/refreshUser",
  REMOVE_API_KEY: "authentication/removeApiKey",
} as const;

export type AuthenticationGlobalStore = {
  address: string;
  name: string;
  loggedUser: Omit<User, "id"> | null;
  shouldShowWalkthrough: boolean;

  connectWalletStore: (address: string, name: string) => void;
  disconnectWalletStore: () => void;
  showWalkthrough: () => void;
  hideWalkthrough: () => void;
  updateUser: (
    address: string,
    payload: UserPayload | User,
  ) => Promise<User | undefined>;
  refreshUser: (address: string) => void;
};

export const authenticationSlice: StateCreator<
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
    shouldShowWalkthrough: false,

    // Modifiers
    connectWalletStore: async (address: string, name: string) => {
      try {
        const data = await new AuthService().getUser(address);

        if (!data) {
          const { status, user } = await new AuthService().createUser(address);

          if (status === "SUCCESS") {
            set(
              { address, name, loggedUser: user, shouldShowWalkthrough: true },
              false,
              AUTHENTICATION_ACTIONS.CONNECT_WALLET,
            );
          }
        } else {
          set(
            { address, name, loggedUser: data, shouldShowWalkthrough: false },
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
        {
          address: "",
          name: "",
          loggedUser: null,
          shouldShowWalkthrough: false,
        },
        false,
        AUTHENTICATION_ACTIONS.DISCONNECT_WALLET,
      ),

    showWalkthrough: () =>
      set({ shouldShowWalkthrough: true }, false, "walkthrough/show"),

    hideWalkthrough: () =>
      set({ shouldShowWalkthrough: false }, false, "walkthrough/hide"),

    updateUser: async (address: string, payload: UserPayload | User) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, ...rest } = payload as User;

        const data = await new AuthService().updateUser(
          address,
          rest as UserPayload,
        );

        if (data) {
          set({ loggedUser: data }, false, AUTHENTICATION_ACTIONS.UPDATE_USER);
        }

        return data;
      } catch (error) {
        console.error("Error in updateUser:", error);
        throw error;
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
