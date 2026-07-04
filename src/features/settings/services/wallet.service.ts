import http from "@/lib/http";
import type { Sep10Challenge } from "@/features/auth/types/auth.types";
import type {
  UserWalletResponse,
  WalletLinkVerifyResponse,
} from "@/features/settings/types/wallet.types";
import {
  buildKeysetQuery,
  fetchAllKeysetPages,
  parseKeysetPage,
} from "@/lib/pagination";
import type { KeysetListParams, KeysetPage } from "@/types/pagination.entity";

export class WalletService {
  async listWalletsPage(
    params: KeysetListParams = {},
  ): Promise<KeysetPage<UserWalletResponse>> {
    const { data } = await http.get<unknown>(
      `/core/users/me/wallets${buildKeysetQuery(params)}`,
    );
    return parseKeysetPage<UserWalletResponse>(data);
  }

  async listWallets(): Promise<UserWalletResponse[]> {
    return fetchAllKeysetPages((params) => this.listWalletsPage(params));
  }

  async requestLinkChallenge(address: string): Promise<Sep10Challenge> {
    const { data } = await http.post<Sep10Challenge>(
      "/core/wallets/link/challenge",
      { address },
    );
    return data;
  }

  async verifyLink(
    address: string,
    signedXdr: string,
  ): Promise<WalletLinkVerifyResponse> {
    const { data } = await http.post<WalletLinkVerifyResponse>(
      "/core/wallets/link/verify",
      { address, signedXdr },
    );
    return data;
  }

  async unlinkWallet(address: string): Promise<void> {
    await http.delete(`/core/users/me/wallets/${encodeURIComponent(address)}`);
  }
}

export const walletService = new WalletService();
