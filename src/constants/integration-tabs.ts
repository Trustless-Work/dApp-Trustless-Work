import type { LucideIcon } from "lucide-react";
import { KeyRoundIcon, WebhookIcon } from "lucide-react";

export type IntegrationTabConfig = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const INTEGRATION_TABS: IntegrationTabConfig[] = [
  {
    href: "/dashboard/api-keys",
    label: "API Keys",
    icon: KeyRoundIcon,
  },
  {
    href: "/dashboard/webhooks",
    label: "Webhooks",
    icon: WebhookIcon,
  },
];
