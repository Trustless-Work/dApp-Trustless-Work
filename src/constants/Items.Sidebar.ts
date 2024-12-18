import { LuLayoutDashboard } from "react-icons/lu";
import { BookOpen } from "lucide-react";
import { FaStackOverflow, FaWpforms } from "react-icons/fa";
import { MdOutlineBugReport } from "react-icons/md";

export const ItemsSidebar = {
  teams: [
    {
      name: "Trustless Work",
      logo: "/logo.png",
      plan: "Escrows as a service",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LuLayoutDashboard,
      isActive: true,
      isExpandable: false,
    },
    {
      title: "Escrows",
      url: "#",
      icon: FaStackOverflow,
      isActive: false,
      isExpandable: true,
      items: [
        { title: "My Escrows", url: "/dashboard/escrow/my-escrows" },
        {
          title: "Initialize Escrow",
          url: "/dashboard/escrow/initialize-escrow",
        },
        { title: "Fund Escrow", url: "/dashboard/escrow/fund-escrow" },
        { title: "Complete Escrow", url: "/dashboard/escrow/complete-escrow" },
        {
          title: "Claim Escrow Earnings",
          url: "/dashboard/escrow/claim-escrow-earnings",
        },
        { title: "Cancel Escrow", url: "/dashboard/escrow/cancel-escrow" },
        {
          title: "Refund Remaining Funds",
          url: "/dashboard/escrow/refund-remaining-funds",
        },
        { title: "Get Engagement", url: "/dashboard/escrow/get-engagement" },
      ],
    },
    {
      title: "Request API key",
      url: "/dashboard/request-api-key",
      icon: FaWpforms,
      isActive: true,
      isExpandable: false,
    },
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
    {
      title: "Report an API Issue",
      url: "/dashboard/report-issue",
      icon: MdOutlineBugReport,
      isActive: true,
      isExpandable: false,
    },
  ],
};
