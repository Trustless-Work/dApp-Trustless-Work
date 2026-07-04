"use client";

import { Loader2, RefreshCwIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ApiKeyResponse } from "@/features/api-keys/types/api-key.types";
import {
  isApiKeyActive,
  isApiKeyExpired,
  isApiKeyRevoked,
} from "@/features/api-keys/types/api-key.types";
import {
  formatIsoDateTime,
  formatIsoDateTimeCompact,
} from "@/helpers/format.helper";

type ApiKeyDetailRowProps = {
  label: string;
  children: ReactNode;
};

const ApiKeyDetailRow = ({ label, children }: ApiKeyDetailRowProps) => (
  <div className="flex items-start justify-between gap-4 py-2.5">
    <span className="shrink-0 pt-0.5 text-xs text-muted-foreground">
      {label}
    </span>
    <div className="min-w-0 text-right text-sm leading-snug">{children}</div>
  </div>
);

type ApiKeyRowProps = {
  apiKey: ApiKeyResponse;
  onRotate: (keyId: string) => void;
  onRevoke: (keyId: string) => void;
  isRotating: boolean;
  isRevoking: boolean;
};

function getApiKeyStatus(apiKey: ApiKeyResponse): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (isApiKeyRevoked(apiKey)) {
    return { label: "Revoked", variant: "destructive" };
  }

  if (isApiKeyExpired(apiKey)) {
    return { label: "Expired", variant: "secondary" };
  }

  return { label: "Active", variant: "default" };
}

const ApiKeyActions = ({
  apiKey,
  onRotate,
  onRevoke,
  isRotating,
  isRevoking,
}: ApiKeyRowProps) => {
  const isActive = isApiKeyActive(apiKey);
  const isBusy = isRotating || isRevoking;

  if (!isActive) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Rotate API key"
        disabled={isBusy}
        onClick={() => onRotate(apiKey.id)}
      >
        {isRotating ? <Loader2 className="animate-spin" /> : <RefreshCwIcon />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-destructive hover:text-destructive"
        aria-label="Revoke API key"
        disabled={isBusy}
        onClick={() => onRevoke(apiKey.id)}
      >
        {isRevoking ? <Loader2 className="animate-spin" /> : <Trash2Icon />}
      </Button>
    </div>
  );
};

const ApiKeyCard = ({
  apiKey,
  onRotate,
  onRevoke,
  isRotating,
  isRevoking,
}: ApiKeyRowProps) => {
  const status = getApiKeyStatus(apiKey);
  const description = apiKey.description?.trim() || "Untitled key";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-0">
        <CardTitle className="min-w-0 flex-1 text-sm font-medium leading-snug">
          {description}
        </CardTitle>
        <div className="flex shrink-0 items-center gap-1">
          <Badge variant={status.variant}>{status.label}</Badge>
          <ApiKeyActions
            apiKey={apiKey}
            onRotate={onRotate}
            onRevoke={onRevoke}
            isRotating={isRotating}
            isRevoking={isRevoking}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="divide-y divide-border/60 rounded-lg border border-border/60 px-3">
          <ApiKeyDetailRow label="Role">
            <div className="flex flex-wrap justify-end gap-1">
              {apiKey.roles.map((role) => (
                <Badge key={role} variant="outline" className="font-normal">
                  {role}
                </Badge>
              ))}
            </div>
          </ApiKeyDetailRow>
          <ApiKeyDetailRow label="Created">
            {formatIsoDateTimeCompact(apiKey.createdAt)}
          </ApiKeyDetailRow>
          <ApiKeyDetailRow label="Last used">
            {formatIsoDateTimeCompact(apiKey.lastUsedAt ?? undefined)}
          </ApiKeyDetailRow>
          <ApiKeyDetailRow label="Expires">
            {formatIsoDateTimeCompact(apiKey.expiresAt ?? undefined)}
          </ApiKeyDetailRow>
        </div>
      </CardContent>
    </Card>
  );
};

const ApiKeyTableRow = ({
  apiKey,
  onRotate,
  onRevoke,
  isRotating,
  isRevoking,
}: ApiKeyRowProps) => {
  const status = getApiKeyStatus(apiKey);
  const description = apiKey.description?.trim() || "Untitled key";

  return (
    <TableRow>
      <TableCell className="font-medium">{description}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {apiKey.roles.map((role) => (
            <Badge key={role} variant="outline">
              {role}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={status.variant}>{status.label}</Badge>
      </TableCell>
      <TableCell>{formatIsoDateTime(apiKey.createdAt)}</TableCell>
      <TableCell>{formatIsoDateTime(apiKey.lastUsedAt ?? undefined)}</TableCell>
      <TableCell>{formatIsoDateTime(apiKey.expiresAt ?? undefined)}</TableCell>
      <TableCell className="text-right">
        <ApiKeyActions
          apiKey={apiKey}
          onRotate={onRotate}
          onRevoke={onRevoke}
          isRotating={isRotating}
          isRevoking={isRevoking}
        />
      </TableCell>
    </TableRow>
  );
};

type ApiKeysListProps = {
  apiKeys: ApiKeyResponse[];
  onRotate: (keyId: string) => void;
  onRevoke: (keyId: string) => void;
  rotatingKeyId: string | null;
  revokingKeyId: string | null;
};

export const ApiKeysList = ({
  apiKeys,
  onRotate,
  onRevoke,
  rotatingKeyId,
  revokingKeyId,
}: ApiKeysListProps) => (
  <>
    <div className="flex flex-col gap-3 md:hidden">
      {apiKeys.map((apiKey) => (
        <ApiKeyCard
          key={apiKey.id}
          apiKey={apiKey}
          onRotate={onRotate}
          onRevoke={onRevoke}
          isRotating={rotatingKeyId === apiKey.id}
          isRevoking={revokingKeyId === apiKey.id}
        />
      ))}
    </div>
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last used</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <ApiKeyTableRow
              key={apiKey.id}
              apiKey={apiKey}
              onRotate={onRotate}
              onRevoke={onRevoke}
              isRotating={rotatingKeyId === apiKey.id}
              isRevoking={revokingKeyId === apiKey.id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  </>
);
