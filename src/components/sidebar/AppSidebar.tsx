"use client";

import * as React from "react";
import {
  FaStackOverflow,
  FaExternalLinkAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useWalletStore } from "@/store/walletStore";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent as SidebarContentComponent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const escrowItems = [
  { title: "Initialize Escrow", url: "/escrow/initialize-escrow" },
  { title: "Fund Escrow", url: "/escrow/fund-escrow" },
  { title: "Complete Escrow", url: "/escrow/complete-escrow" },
  { title: "Claim Escrow Earnings", url: "/escrow/claim-escrow-earnings" },
  { title: "Cancel Escrow", url: "/escrow/cancel-escrow" },
  { title: "Refund Remaining Funds", url: "/escrow/refund-remaining-funds" },
  { title: "Get Engagement", url: "/escrow/get-engagement" },
];

const documentationLinks = [
  { title: "API Docs", url: "https://docs.trustlesswork.com/trustless-work" },
  { title: "Website", url: "https://www.trustlesswork.com" },
];

export const SidebarSkeleton = () => (
  <div className="space-y-2 p-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <SidebarMenuSkeleton key={i} showIcon />
    ))}
  </div>
);

const formatAddress = (address: string): string => {
  if (!address) return "";
  const start = address.slice(0, 8);
  const end = address.slice(-8);
  return `${start}....${end}`;
};

const SidebarContentSection = ({
  address,
  isActive,
}: {
  address: string;
  name: string | undefined;
  isActive: (path: string) => boolean;
}) => (
  <>
    <SidebarHeader className="border-b p-4" aria-label="Company Information">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Trustless Work" width={24} height={24} />
        <div>
          <h2 className="text-lg font-semibold">Trustless Work</h2>
          <p className="text-sm text-muted-foreground">Escrow-as-a-service</p>
        </div>
      </div>
    </SidebarHeader>

    <SidebarContentComponent>
      {address && (
        <Collapsible defaultOpen>
          <SidebarGroup>
            <CollapsibleTrigger className="flex w-full items-center p-2">
              <SidebarGroupLabel className="flex items-center gap-2">
                <FaStackOverflow className="h-4 w-4" />
                <span>Main Menu</span>
                <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {escrowItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link href={item.url}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      )}

      <SidebarGroup>
        <SidebarGroupLabel>Documentation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {documentationLinks.map((link) => (
              <SidebarMenuItem key={link.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group"
                  >
                    <span>{link.title}</span>
                    <FaExternalLinkAlt className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContentComponent>

    <SidebarFooter>
      <SidebarGroup>
        <SidebarGroupLabel>
          <FaUserCircle className="h-4 w-4" />
          <span className="ml-2">
            {address ? formatAddress(address) : "Not Connected"}
          </span>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/wallet">Wallet</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/settings">Settings</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarFooter>
  </>
);

export function AppSidebar() {
  const { address, name } = useWalletStore();
  const pathname = usePathname();

  const isActive = React.useCallback(
    (path: string) => pathname === path,
    [pathname],
  );

  return (
    <Sidebar collapsible={address ? "offcanvas" : "icon"}>
      <SidebarContentSection
        address={address}
        name={name}
        isActive={isActive}
      />
      <SidebarRail />
    </Sidebar>
  );
}
