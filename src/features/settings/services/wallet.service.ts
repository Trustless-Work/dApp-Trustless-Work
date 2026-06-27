import http from "@/lib/http";
import type { Sep10Challenge } from "@/features/auth/types/auth.types";
import type {
  UserWalletResponse,
  WalletLinkVerifyResponse,
} from "@/features/settings/types/wallet.types";

export class WalletService {
  async listWallets(): Promise<UserWalletResponse[]> {
    const { data } = await http.get<UserWalletResponse[]>(
      "/core/users/me/wallets",
    );
    return data;
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
