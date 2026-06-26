import http from "@/lib/http";
import type {
  GeneratedApiKeyResponse,
  RegisterProfileInput,
  Sep10Challenge,
  SessionChallengeResponse,
  SessionStatusResponse,
  SessionVerifyResponse,
  UserResponse,
} from "@/features/auth/types/auth.types";

export class AuthService {
  async requestSessionChallenge(
    address: string,
  ): Promise<SessionChallengeResponse> {
    const { data } = await http.post<SessionChallengeResponse>(
      "/auth/session/challenge",
      { address },
    );
    return data;
  }

  async verifySession(
    address: string,
    signedXdr: string,
  ): Promise<SessionVerifyResponse> {
    const { data } = await http.post<{ success: true; expiresAt: string }>(
      "/auth/session/verify",
      { address, signedXdr },
    );
    return { token: "", expiresAt: data.expiresAt };
  }

  async requestRegisterChallenge(address: string): Promise<Sep10Challenge> {
    const { data } = await http.post<Sep10Challenge>(
      "/auth/register/challenge",
      { address },
    );
    return data;
  }

  async verifyRegister(
    address: string,
    signedXdr: string,
  ): Promise<GeneratedApiKeyResponse> {
    const { data: registerResult } = await http.post<GeneratedApiKeyResponse>(
      "/auth/register/verify",
      {
        address,
        signedXdr,
      },
    );

    return registerResult;
  }

  async saveRegisterProfile(
    userId: string,
    profile: RegisterProfileInput,
  ): Promise<void> {
    await http.post("/auth/register/profile", {
      userId,
      ...profile,
    });
  }

  async logout(): Promise<void> {
    await http.post("/auth/session/logout");
  }

  async checkSession(): Promise<SessionStatusResponse> {
    const { data } = await http.get<SessionStatusResponse>("/auth/me");
    return data;
  }

  async getMe(): Promise<UserResponse> {
    const { data } = await http.get<UserResponse>("/core/users/me");
    return data;
  }
}

export const authService = new AuthService();
