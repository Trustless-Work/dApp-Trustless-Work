"use client";

import { KeyRoundIcon } from "lucide-react";
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
import { useApiKeys } from "@/features/api-keys/hooks/useApiKeys";
import { useDeleteApiKey } from "@/features/api-keys/hooks/useDeleteApiKey";
import { useRotateApiKey } from "@/features/api-keys/hooks/useRotateApiKey";
import { ApiKeysList } from "@/features/api-keys/ui/ApiKeysList";
import { ApiKeysListSkeleton } from "@/features/api-keys/ui/ApiKeysSkeleton";
import { DeleteApiKeyDialog } from "@/features/api-keys/ui/DeleteApiKeyDialog";
import { parseApiError } from "@/lib/api-error";

type ApiKeysSectionProps = {
  onCreateRequest: () => void;
  onSecretRevealed: (apiKey: string) => void;
};

export const ApiKeysSection = ({
  onCreateRequest,
  onSecretRevealed,
}: ApiKeysSectionProps) => {
  const { apiKeys, isLoading, isError, error, refetch } = useApiKeys();
  const {
    mutate: rotateApiKey,
    isPending: isRotating,
    variables: rotatingKeyId,
  } = useRotateApiKey({ onRotated: onSecretRevealed });
  const {
    mutate: deleteApiKey,
    isPending: isDeleting,
    variables: deletingKeyId,
  } = useDeleteApiKey();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const errorDetail = isError ? parseApiError(error).detail : null;

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    deleteApiKey(deleteTarget, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Machine credentials for your platforms. Keys are scoped to one
            organization and always use the ESCROW_MANAGER role.
          </CardDescription>
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

          {!isLoading && !errorDetail && apiKeys.length === 0 ? (
            <NoData
              icon={KeyRoundIcon}
              title="No API keys yet"
              description="Create a key to authenticate your backend with Trustless Work."
              actionLabel="Create API key"
              onAction={onCreateRequest}
            />
          ) : null}

          {!isLoading && !errorDetail && apiKeys.length > 0 ? (
            <ApiKeysList
              apiKeys={apiKeys}
              onRotate={(keyId) => rotateApiKey(keyId)}
              onDelete={setDeleteTarget}
              rotatingKeyId={isRotating ? (rotatingKeyId ?? null) : null}
              deletingKeyId={isDeleting ? (deletingKeyId ?? null) : null}
            />
          ) : null}
        </CardContent>
      </Card>

      <DeleteApiKeyDialog
        deleteTarget={deleteTarget}
        isDeleting={isDeleting}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
