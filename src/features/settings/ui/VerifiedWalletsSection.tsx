"use client";

import { Loader2, PlusIcon, WalletIcon } from "lucide-react";
import { useState } from "react";
import { NoData } from "@/components/shared/NoData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLinkWallet } from "@/features/settings/hooks/useLinkWallet";
import { useUnlinkWallet } from "@/features/settings/hooks/useUnlinkWallet";
import { useUserWallets } from "@/features/settings/hooks/useUserWallets";
import { UnlinkWalletDialog } from "@/features/settings/ui/UnlinkWalletDialog";
import { WalletsListSkeleton } from "@/features/settings/ui/VerifiedWalletsSkeleton";
import { WalletsList } from "@/features/settings/ui/WalletsList";
import { parseApiError } from "@/lib/api-error";
import { useWalletContext } from "@/providers/WalletProvider";

export { VerifiedWalletsSkeleton } from "@/features/settings/ui/VerifiedWalletsSkeleton";

export const VerifiedWalletsSection = () => {
  const { walletAddress } = useWalletContext();
  const {
    wallets,
    verifiedWallets,
    pendingWallets,
    verifiedCount,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useUserWallets();
  const { linkWallet, isLinking } = useLinkWallet();
  const { mutate: unlinkWallet, isPending: isUnlinking } = useUnlinkWallet();
  const [unlinkTarget, setUnlinkTarget] = useState<string | null>(null);

  const errorDetail = isError ? parseApiError(error).detail : null;
  const allAddresses = wallets.map((wallet) => wallet.address);
  const displayWallets = [...verifiedWallets, ...pendingWallets];

  const handleConfirmUnlink = () => {
    if (!unlinkTarget) {
      return;
    }

    unlinkWallet(unlinkTarget, {
      onSettled: () => setUnlinkTarget(null),
    });
  };

  return (
    <>
      <Card className="w-full md:w-1/2">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Verified Wallets</CardTitle>
            <CardDescription>
              Wallets linked to your account. At least one verified wallet must
              remain.
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            disabled={isLoading || isLinking}
            onClick={() => linkWallet(allAddresses)}
          >
            {isLinking ? (
              <>
                <Loader2 className="animate-spin" />
                Linking...
              </>
            ) : (
              <>
                <PlusIcon />
                Link wallet
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? <WalletsListSkeleton /> : null}

          {!isLoading && errorDetail ? (
            <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{errorDetail}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => {
                  void refetch();
                }}
              >
                Try again
              </Button>
            </div>
          ) : null}

          {!isLoading && !errorDetail && displayWallets.length === 0 ? (
            <NoData
              icon={WalletIcon}
              title="No wallets linked"
              description="Link a Stellar wallet to verify ownership of your account."
              actionLabel="Link wallet"
              onAction={() => linkWallet(allAddresses)}
            />
          ) : null}

          {!isLoading && !errorDetail && displayWallets.length > 0 ? (
            <div className="flex flex-col gap-4">
              <WalletsList
                wallets={displayWallets}
                verifiedCount={verifiedCount}
                walletAddress={walletAddress}
                onUnlinkRequest={setUnlinkTarget}
                isUnlinking={isUnlinking}
              />
              {hasNextPage ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  disabled={isFetchingNextPage}
                  onClick={() => {
                    void fetchNextPage();
                  }}
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <UnlinkWalletDialog
        unlinkTarget={unlinkTarget}
        isUnlinking={isUnlinking}
        onOpenChange={(open) => {
          if (!open) {
            setUnlinkTarget(null);
          }
        }}
        onConfirm={handleConfirmUnlink}
      />
    </>
  );
};
