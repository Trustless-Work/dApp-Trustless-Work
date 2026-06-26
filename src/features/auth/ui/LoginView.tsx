"use client";

import Link from "next/link";
import { AuthDivider } from "@/components/auth-divider";
import { AuthPageLayout } from "@/features/auth/ui/AuthPageLayout";
import { WalletLoginButton } from "@/features/auth/ui/WalletLoginButton";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { useWalletAuth } from "@/features/auth/hooks/useWalletAuth";

export const LoginView = () => {
  const {
    phase,
    needsRegister,
    pendingAddress,
    handleLogin,
    registerWithWallet,
    resetAuthFlow,
    isLoading,
  } = useWalletAuth();

  return (
    <AuthPageLayout>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-wide">
          {needsRegister ? "Create your Account" : "Sign in to Trustless Work"}
        </h1>
        <p className="text-base text-muted-foreground">
          {needsRegister
            ? "Your wallet is connected. Finish registration to access the dashboard."
            : "Connect your Stellar wallet to sign in or register."}
        </p>
      </div>

      {!needsRegister ? (
        <WalletLoginButton
          phase={phase}
          isLoading={isLoading}
          onLogin={() => {
            void handleLogin();
          }}
        />
      ) : null}

      {needsRegister && pendingAddress ? (
        <RegisterForm
          walletAddress={pendingAddress}
          onRegister={registerWithWallet}
          onTryDifferentWallet={() => {
            void resetAuthFlow();
          }}
          isSubmitting={isLoading}
        />
      ) : (
        <>
          <AuthDivider>How it works</AuthDivider>
          <p className="text-start text-xs text-muted-foreground">
            SEP-10 signing verifies your wallet. New wallets register after
            connecting.
          </p>
        </>
      )}

      <p className="mt-4 text-sm text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link
          className="underline underline-offset-4 hover:text-primary"
          href="/"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          className="underline underline-offset-4 hover:text-primary"
          href="/"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </AuthPageLayout>
  );
};
