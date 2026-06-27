"use client";

import { CheckIcon, CopyIcon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserWalletResponse } from "@/features/settings/types/wallet.types";
import { formatAddress } from "@/helpers/format.helper";
import { useCopy } from "@/hooks/useCopy";

type WalletRowProps = {
  wallet: UserWalletResponse;
  isConnected: boolean;
  canUnlink: boolean;
  onUnlink: (address: string) => void;
  isUnlinking: boolean;
};

const WalletActions = ({
  address,
  canUnlink,
  onUnlink,
  isUnlinking,
}: {
  address: string;
  canUnlink: boolean;
  onUnlink: (address: string) => void;
  isUnlinking: boolean;
}) => {
  const { copiedKeyId, copyToClipboard } = useCopy();

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Copy wallet address"
        onClick={() => {
          void copyToClipboard(address);
        }}
      >
        {copiedKeyId ? <CheckIcon className="text-green-600" /> : <CopyIcon />}
      </Button>
      {canUnlink ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          aria-label="Unlink wallet"
          disabled={isUnlinking}
          onClick={() => onUnlink(address)}
        >
          <Trash2Icon />
        </Button>
      ) : null}
    </div>
  );
};

const WalletStatusBadges = ({
  isConnected,
  isPending,
}: {
  isConnected: boolean;
  isPending: boolean;
}) => (
  <div className="flex flex-wrap items-center gap-1.5">
    {isPending ? (
      <Badge variant="outline" className="font-normal">
        Pending verification
      </Badge>
    ) : (
      <Badge variant="secondary" className="font-normal">
        Verified
      </Badge>
    )}
    {isConnected ? (
      <Badge variant="default" className="font-normal">
        Connected
      </Badge>
    ) : null}
  </div>
);

const WalletCard = ({
  wallet,
  isConnected,
  canUnlink,
  onUnlink,
  isUnlinking,
}: WalletRowProps) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="font-mono text-sm font-medium">
        {formatAddress(wallet.address, 8)}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-between gap-3">
      <WalletStatusBadges
        isConnected={isConnected}
        isPending={!wallet.verified}
      />
      <WalletActions
        address={wallet.address}
        canUnlink={canUnlink && wallet.verified}
        onUnlink={onUnlink}
        isUnlinking={isUnlinking}
      />
    </CardContent>
  </Card>
);

const WalletTableRow = ({
  wallet,
  isConnected,
  canUnlink,
  onUnlink,
  isUnlinking,
}: WalletRowProps) => (
  <TableRow>
    <TableCell className="font-mono text-sm">
      {formatAddress(wallet.address, 10)}
    </TableCell>
    <TableCell>
      <WalletStatusBadges
        isConnected={isConnected}
        isPending={!wallet.verified}
      />
    </TableCell>
    <TableCell className="text-right">
      <WalletActions
        address={wallet.address}
        canUnlink={canUnlink && wallet.verified}
        onUnlink={onUnlink}
        isUnlinking={isUnlinking}
      />
    </TableCell>
  </TableRow>
);

type WalletsListProps = {
  wallets: UserWalletResponse[];
  verifiedCount: number;
  walletAddress: string | null;
  onUnlinkRequest: (address: string) => void;
  isUnlinking: boolean;
};

export const WalletsList = ({
  wallets,
  verifiedCount,
  walletAddress,
  onUnlinkRequest,
  isUnlinking,
}: WalletsListProps) => {
  const canUnlink = verifiedCount > 1;

  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.address}
            wallet={wallet}
            isConnected={wallet.address === walletAddress}
            canUnlink={canUnlink}
            onUnlink={onUnlinkRequest}
            isUnlinking={isUnlinking}
          />
        ))}
      </div>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wallets.map((wallet) => (
              <WalletTableRow
                key={wallet.address}
                wallet={wallet}
                isConnected={wallet.address === walletAddress}
                canUnlink={canUnlink}
                onUnlink={onUnlinkRequest}
                isUnlinking={isUnlinking}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
