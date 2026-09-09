import type { LucideIcon } from "lucide-react";
import {
  DiscIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  WebhookIcon,
} from "lucide-react";

export type DashboardNavSubItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  external?: boolean;
};

export type DashboardNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  external?: boolean;
  items?: DashboardNavSubItem[];
};

export type DashboardNavGroup = {
  label: string;
  showLabel?: boolean;
  items: DashboardNavItem[];
};

export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    label: "Platform",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Manage Escrows",
        url: "/dashboard/escrows",
        icon: DiscIcon,
      },
    ],
  },
  {
    label: "Integrations",
    items: [
      {
        title: "API Keys",
        url: "/dashboard/api-keys",
        icon: KeyRoundIcon,
      },
      {
        title: "Webhooks",
        url: "/dashboard/webhooks",
        icon: WebhookIcon,
      },
    ],
  },
];

/** Backoffice sidebar — same shape as the dashboard, different destinations. */
export const ADMIN_NAV_GROUPS: DashboardNavGroup[] = [
  {
    label: "Platform",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboardIcon,
      },
    ],
  },
];
