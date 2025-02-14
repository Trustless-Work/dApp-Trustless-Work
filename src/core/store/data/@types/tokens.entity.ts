import { Token } from "@/@types/token.entity";

export interface TokenGlobalStore {
  tokens: Token[];

  getAllTokens: () => void;
}
