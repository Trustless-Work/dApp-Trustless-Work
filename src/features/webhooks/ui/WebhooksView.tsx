"use client";

import { WebhookIcon } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { DashboardPageHeaderActions } from "@/components/shared/DashboardPageHeaderContext";
import { IntegrationPageTabs } from "@/components/shared/IntegrationPageTabs";
import { NoData } from "@/components/shared/NoData";

export const WebhooksView = () => (
  <>
    <DashboardPageHeaderActions>
      <IntegrationPageTabs />
    </DashboardPageHeaderActions>

    <Container>
      <NoData
        icon={WebhookIcon}
        title="Webhooks coming soon"
        description="Configure event notifications for your integrations from this page."
      />
    </Container>
  </>
);
