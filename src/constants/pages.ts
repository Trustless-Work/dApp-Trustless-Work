import type { LucideIcon } from "lucide-react";
import {
  KeyRoundIcon,
  Layers2Icon,
  LayoutDashboardIcon,
  Settings2Icon,
  WebhookIcon,
} from "lucide-react";

export type DashboardPageConfig = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const DASHBOARD_PAGES: Record<string, DashboardPageConfig> = {
  "/dashboard": {
    title: "Dashboard",
    description:
      "Get a snapshot of your escrows, recent activity, and integration health.",
    icon: LayoutDashboardIcon,
  },
  "/dashboard/escrows": {
    title: "Manage Escrows",
    description:
      "Browse, filter, and manage escrow contracts on the Stellar network.",
    icon: Layers2Icon,
  },
  "/dashboard/api-keys": {
    title: "API Keys",
    description:
      "Generate and rotate API keys to authenticate your applications.",
    icon: KeyRoundIcon,
  },
  "/dashboard/webhooks": {
    title: "Webhooks",
    description:
      "Subscribe to escrow events and deliver payloads to your endpoints.",
    icon: WebhookIcon,
  },
  "/dashboard/settings": {
    title: "Settings",
    description:
      "Update your profile, preferences, and workspace configuration.",
    icon: Settings2Icon,
  },
};

export function getDashboardPage(pathname: string): DashboardPageConfig | null {
  const exactMatch = DASHBOARD_PAGES[pathname];
  if (exactMatch) {
    return exactMatch;
  }

  const nestedMatch = Object.entries(DASHBOARD_PAGES)
    .filter(([path]) => path !== "/dashboard" && pathname.startsWith(`${path}/`))
    .sort(([pathA], [pathB]) => pathB.length - pathA.length)[0];

  return nestedMatch?.[1] ?? null;
}
