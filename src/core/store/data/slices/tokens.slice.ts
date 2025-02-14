import { StateCreator } from "zustand";
import { TokenGlobalStore } from "../@types/tokens.entity";
import { getAllTokens } from "@/components/modules/token/server/token.firebase";

const TOKEN_ACTIONS = {
  SET_TOKENS: "tokens/setTokens",
} as const;

export const useGlobalTokensSlice: StateCreator<
  TokenGlobalStore,
  [["zustand/devtools", never]],
  [],
  TokenGlobalStore
> = (set) => {
  return {
    // Stores
    tokens: [],

    // Modifiers
    getAllTokens: async () => {
      const { success, message, data } = await getAllTokens();

      if (success) {
        set({ tokens: data }, false, TOKEN_ACTIONS.SET_TOKENS);
      } else {
        console.error(message);
      }
    },
  };
};
