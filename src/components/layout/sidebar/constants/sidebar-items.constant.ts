import {
  BookOpen,
  Bug,
  CircleHelp,
  Layers,
  LayoutDashboard,
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
      label: "Platform",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          isActive: true,
          isExpandable: false,
        },
        // {
        //   title: "Contacts",
        //   url: "/dashboard/contact",
        //   icon: LuContactRound,
        //   isActive: true,
        //   isExpandable: false,
        // },
      ],
    },
    {
      label: "Financials",
      items: [
        {
          title: "Escrows",
          url: "/dashboard/escrow/my-escrows",
          icon: Layers,
          isActive: false,
          isExpandable: false,
        },
      ],
    },
    {
      label: "Documentation",
      items: [
        {
          title: "Documentation",
          url: "#",
          icon: BookOpen,
          isExpandable: true,
          items: [
            {
              title: "API Documentation",
              url: "https://docs.trustlesswork.com/trustless-work",
              isExternal: true,
            },
            {
              title: "Website",
              url: "https://www.trustlesswork.com/",
              isExternal: true,
            },
          ],
        },
      ],
    },
    {
      label: "Support",
      items: [
        {
          title: "Report an API Issue",
          url: "/dashboard/report-issue",
          icon: Bug,
          isActive: true,
          isExpandable: false,
        },
        {
          title: "Help",
          url: "/dashboard/help",
          icon: CircleHelp,
          isActive: true,
          isExpandable: false,
        },
      ],
    },
  ],
};
