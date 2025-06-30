import {
  BookOpen,
  Bug,
  CircleHelp,
  Layers,
  LayoutDashboard,
  LucideContactRound,
  MessageCircle,
} from "lucide-react";

export const ItemsSidebar = {
  teams: [
    {
      name: "Trustless Work",
      logo: "/logo.png",
      plan: "Escrows as a service",
    },
  ],
  navGroups: [
    {
      label: "sidebar.platform",
      items: [
        {
          title: "sidebar.dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          isActive: true,
          isExpandable: false,
        },
        {
          title: "sidebar.contacts",
          url: "/dashboard/contact",
          icon: LucideContactRound,
          isActive: true,
          isExpandable: false,
        },
        {
          title: "sidebar.chats",
          url: "/dashboard/chats",
          icon: MessageCircle,
          isActive: true,
          isExpandable: false,
        },
      ],
    },
    {
      label: "sidebar.financials",
      items: [
        {
          title: "sidebar.escrows",
          url: "/dashboard/escrow/my-escrows",
          icon: Layers,
          isActive: false,
          isExpandable: false,
        },
      ],
    },
    {
      label: "sidebar.resources",
      items: [
        {
          title: "sidebar.resources",
          url: "#",
          icon: BookOpen,
          isExpandable: true,
          items: [
            {
              title: "sidebar.apiDocs",
              url: "https://docs.trustlesswork.com/trustless-work",
              isExternal: true,
            },
            {
              title: "sidebar.website",
              url: "https://www.trustlesswork.com/",
              isExternal: true,
            },
            {
              title: "sidebar.stellarExpert",
              url: "https://stellar.expert/explorer/testnet",
              isExternal: true,
            },
            {
              title: "sidebar.escrowViewer",
              url: "https://viewer.trustlesswork.com/",
              isExternal: true,
            },
          ],
        },
      ],
    },
    {
      label: "sidebar.support",
      items: [
        {
          title: "sidebar.reportIssue",
          url: "/dashboard/report-issue",
          icon: Bug,
          isActive: true,
          isExpandable: false,
        },
        {
          title: "sidebar.help",
          url: "/dashboard/help",
          icon: CircleHelp,
          isActive: true,
          isExpandable: false,
        },
      ],
    },
  ],
};
