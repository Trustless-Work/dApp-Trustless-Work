"use client";

import { INTEGRATION_TABS } from "@/constants/integration-tabs";
import { RoundedTabLinks } from "@/components/ui/custom-tab";

export const IntegrationPageTabs = () => (
  <RoundedTabLinks
    fullWidth
    items={INTEGRATION_TABS.map((tab) => ({
      href: tab.href,
      label: tab.label,
      icon: <tab.icon />,
    }))}
  />
);
