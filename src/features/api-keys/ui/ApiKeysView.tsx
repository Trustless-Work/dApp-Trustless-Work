"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { DashboardPageHeaderActions } from "@/components/shared/DashboardPageHeaderContext";
import { IntegrationPageTabs } from "@/components/shared/IntegrationPageTabs";
import { Button } from "@/components/ui/button";
import { ApiKeysSection } from "@/features/api-keys/ui/ApiKeysSection";
import { CreateApiKeyDialog } from "@/features/api-keys/ui/CreateApiKeyDialog";
import { GeneratedApiKeyDialog } from "@/features/api-keys/ui/GeneratedApiKeyDialog";

export const ApiKeysView = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [revealedApiKey, setRevealedApiKey] = useState<string | null>(null);

  const handleSecretRevealed = (apiKey: string) => {
    setRevealedApiKey(apiKey);
  };

  return (
    <>
      <DashboardPageHeaderActions>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:gap-4">
          <Button
            type="button"
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
          >
            <PlusIcon />
            Generate API Key
          </Button>

          <IntegrationPageTabs />
        </div>
      </DashboardPageHeaderActions>

      <Container>
        <ApiKeysSection
          onCreateRequest={() => setCreateDialogOpen(true)}
          onSecretRevealed={handleSecretRevealed}
        />
      </Container>

      <CreateApiKeyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={handleSecretRevealed}
      />

      <GeneratedApiKeyDialog
        apiKey={revealedApiKey}
        onOpenChange={(open) => {
          if (!open) {
            setRevealedApiKey(null);
          }
        }}
      />
    </>
  );
};
