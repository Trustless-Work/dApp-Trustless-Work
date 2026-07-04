"use client";

import { KeyRoundIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { NoData } from "@/components/shared/NoData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApiKeys } from "@/features/api-keys/hooks/useApiKeys";
import { useRevokeApiKey } from "@/features/api-keys/hooks/useRevokeApiKey";
import { useRotateApiKey } from "@/features/api-keys/hooks/useRotateApiKey";
import { isApiKeyActive } from "@/features/api-keys/types/api-key.types";
import { ApiKeysList } from "@/features/api-keys/ui/ApiKeysList";
import { ApiKeysListSkeleton } from "@/features/api-keys/ui/ApiKeysSkeleton";
import { RevokeApiKeyDialog } from "@/features/api-keys/ui/RevokeApiKeyDialog";
import { parseApiError } from "@/lib/api-error";

type ApiKeysSectionProps = {
  onCreateRequest: () => void;
  onSecretRevealed: (apiKey: string) => void;
};

export const ApiKeysSection = ({
  onCreateRequest,
  onSecretRevealed,
}: ApiKeysSectionProps) => {
  const {
    apiKeys,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useApiKeys();
  const [showRevoked, setShowRevoked] = useState(false);
  const {
    mutate: rotateApiKey,
    isPending: isRotating,
    variables: rotatingKeyId,
  } = useRotateApiKey({ onRotated: onSecretRevealed });
  const {
    mutate: revokeApiKey,
    isPending: isRevoking,
    variables: revokingKeyId,
  } = useRevokeApiKey();
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);

  const visibleApiKeys = useMemo(
    () =>
      showRevoked ? apiKeys : apiKeys.filter((apiKey) => isApiKeyActive(apiKey)),
    [apiKeys, showRevoked],
  );

  const errorDetail = isError ? parseApiError(error).detail : null;

  const handleConfirmRevoke = () => {
    if (!revokeTarget) {
      return;
    }

    revokeApiKey(revokeTarget, {
      onSettled: () => setRevokeTarget(null),
    });
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Machine credentials for your platforms. Keys are scoped to one
                organization and always use the ESCROW_MANAGER role.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="show-revoked-keys"
                checked={showRevoked}
                onCheckedChange={setShowRevoked}
              />
              <Label htmlFor="show-revoked-keys" className="text-sm">
                Show revoked
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <ApiKeysListSkeleton /> : null}

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

          {!isLoading && !errorDetail && visibleApiKeys.length === 0 ? (
            <NoData
              icon={KeyRoundIcon}
              title={showRevoked ? "No API keys yet" : "No active API keys"}
              description={
                showRevoked
                  ? "Create a key to authenticate your backend with Trustless Work."
                  : "Create a key or enable revoked keys to review past credentials."
              }
              actionLabel="Create API key"
              onAction={onCreateRequest}
            />
          ) : null}

          {!isLoading && !errorDetail && visibleApiKeys.length > 0 ? (
            <div className="flex flex-col gap-4">
              <ApiKeysList
                apiKeys={visibleApiKeys}
                onRotate={(keyId) => rotateApiKey(keyId)}
                onRevoke={setRevokeTarget}
                rotatingKeyId={isRotating ? (rotatingKeyId ?? null) : null}
                revokingKeyId={isRevoking ? (revokingKeyId ?? null) : null}
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

      <RevokeApiKeyDialog
        revokeTarget={revokeTarget}
        isRevoking={isRevoking}
        onOpenChange={(open) => {
          if (!open) {
            setRevokeTarget(null);
          }
        }}
        onConfirm={handleConfirmRevoke}
      />
    </>
  );
};
