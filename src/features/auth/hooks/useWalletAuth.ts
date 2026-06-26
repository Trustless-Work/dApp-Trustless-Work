"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWallet } from "@/components/tw-blocks/wallet-kit/useWallet";
import {
  signTransaction,
  resetWalletKitLoader,
} from "@/components/tw-blocks/wallet-kit/wallet-kit";
import { useWalletContext } from "@/providers/WalletProvider";
import { authService } from "@/features/auth/services/auth.service";
import type { RegisterProfileInput } from "@/features/auth/types/auth.types";
import { isRegisteredSessionChallenge } from "@/features/auth/types/auth.types";
import { parseApiError } from "@/lib/api-error";

export type WalletAuthPhase =
  | "idle"
  | "connecting"
  | "signing"
  | "authenticating"
  | "registering";

function isWalletModalDismissed(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === -1
  );
}

export function useWalletAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { walletAddress } = useWalletContext();
  const { connectWallet, disconnectWallet } = useWallet();
  const [phase, setPhase] = useState<WalletAuthPhase>("idle");
  const [needsRegister, setNeedsRegister] = useState(false);
  const [pendingAddress, setPendingAddress] = useState<string | null>(null);

  const redirectPath = searchParams.get("redirect") ?? "/dashboard";

  const performSessionLogin = useCallback(
    async (address: string): Promise<"authenticated" | "needs_register"> => {
      const challengeResult =
        await authService.requestSessionChallenge(address);

      if (!isRegisteredSessionChallenge(challengeResult)) {
        return "needs_register";
      }

      setPhase("signing");
      const signedXdr = await signTransaction({
        unsignedTransaction: challengeResult.xdr,
        address,
        networkPassphrase: challengeResult.networkPassphrase,
      });

      setPhase("authenticating");
      await authService.verifySession(address, signedXdr);
      return "authenticated";
    },
    [],
  );

  const showRegistrationFlow = useCallback((address: string) => {
    setPendingAddress(address);
    setNeedsRegister(true);
    setPhase("idle");
  }, []);

  const handleLogin = useCallback(async () => {
    let address: string | null = walletAddress;

    try {
      setNeedsRegister(false);

      if (!address) {
        setPhase("connecting");
        address = await connectWallet();
      }

      setPendingAddress(address);

      const loginResult = await performSessionLogin(address);
      if (loginResult === "needs_register") {
        showRegistrationFlow(address);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["session", "me"] });
      const user = await authService.getMe();
      queryClient.setQueryData(["session", "me"], user);

      const firstName = user.firstName?.trim();
      toast.success(
        firstName ? `Welcome back, ${firstName}!` : "Welcome back!",
        {
          description: "Enjoy your time on Trustless Work.",
        },
      );
      setPhase("idle");
      router.push(redirectPath);
    } catch (error) {
      if (isWalletModalDismissed(error)) {
        setPhase("idle");
        return;
      }

      toast.error(parseApiError(error).detail);
      setPhase("idle");
    }
  }, [
    connectWallet,
    performSessionLogin,
    queryClient,
    redirectPath,
    router,
    showRegistrationFlow,
    walletAddress,
  ]);

  const registerWithWallet = useCallback(
    async (profile: RegisterProfileInput) => {
      const address = pendingAddress ?? walletAddress;
      if (!address) {
        toast.error("Connect a wallet before creating an account");
        return;
      }

      try {
        setPhase("signing");
        const challenge = await authService.requestRegisterChallenge(address);
        const signedXdr = await signTransaction({
          unsignedTransaction: challenge.xdr,
          address,
          networkPassphrase: challenge.networkPassphrase,
        });

        setPhase("registering");

        const registerResult = await authService.verifyRegister(
          address,
          signedXdr,
        );

        setNeedsRegister(false);

        resetWalletKitLoader();
        const loginResult = await performSessionLogin(address);
        if (loginResult === "needs_register") {
          throw new Error("Account was created but sign-in failed. Try again.");
        }

        try {
          await authService.saveRegisterProfile(registerResult.userId, profile);
        } catch (profileError) {
          toast.warning(
            "Account created, but profile details could not be saved.",
            {
              description: parseApiError(profileError).detail,
            },
          );
        }

        await queryClient.invalidateQueries({ queryKey: ["session", "me"] });
        const user = await authService.getMe();
        queryClient.setQueryData(["session", "me"], user);

        const welcomeName = user.firstName?.trim() || profile.firstName.trim();
        toast.success(
          welcomeName
            ? `Welcome, ${welcomeName}!`
            : "Welcome to Trustless Work!",
          {
            description: "Now you can start building the future.",
          },
        );

        setPhase("idle");
        router.push(redirectPath);
      } catch (error) {
        if (isWalletModalDismissed(error)) {
          setPhase("idle");
          return;
        }

        toast.error(parseApiError(error).detail);
        setPhase("idle");
        throw error;
      }
    },
    [
      pendingAddress,
      performSessionLogin,
      queryClient,
      redirectPath,
      router,
      walletAddress,
    ],
  );

  const resetAuthFlow = useCallback(async () => {
    setNeedsRegister(false);
    setPendingAddress(null);
    setPhase("idle");
    await disconnectWallet();
  }, [disconnectWallet]);

  const isLoading = phase !== "idle";

  return {
    phase,
    needsRegister,
    pendingAddress,
    handleLogin,
    registerWithWallet,
    resetAuthFlow,
    isLoading,
  };
}
