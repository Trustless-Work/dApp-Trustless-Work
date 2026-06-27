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

const ConnectedBadge = ({ isConnected }: { isConnected: boolean }) =>
  isConnected ? (
    <Badge variant="default" className="font-normal">
      Connected
    </Badge>
  ) : null;

const WalletCard = ({
  wallet,
  isConnected,
  canUnlink,
  onUnlink,
  isUnlinking,
}: WalletRowProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
      <CardTitle className="font-mono text-sm font-medium">
        {formatAddress(wallet.address, 8)}
      </CardTitle>
      <ConnectedBadge isConnected={isConnected} />
    </CardHeader>
    <CardContent className="flex justify-end">
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
    <TableCell>
      <div className="flex items-center gap-2 font-mono text-sm">
        <span>{formatAddress(wallet.address, 10)}</span>
        <ConnectedBadge isConnected={isConnected} />
      </div>
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
