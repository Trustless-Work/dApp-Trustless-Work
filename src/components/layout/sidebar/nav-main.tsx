import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import useNetwork from "@/hooks/useNetwork";

const NavMain = ({
  groups,
}: {
  groups: {
    label: string;
    items: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      isExternal?: boolean;
      isExpandable?: boolean;
      isDynamic?: boolean;
      items?: {
        title: string;
        url: string;
        isExternal?: boolean;
        isDynamic?: boolean;
      }[];
    }[];
  }[];
}) => {
  const { t } = useLanguage();
  const { currentNetwork } = useNetwork();
  const pathname = usePathname();

  // Helper function to get dynamic URLs based on network
  const getDynamicUrl = (url: string) => {
    if (url === "stellar-expert") {
      return currentNetwork === "testnet"
        ? "https://stellar.expert/explorer/testnet"
        : "https://stellar.expert/explorer/public";
    }
    if (url === "escrow-viewer") {
      return currentNetwork === "testnet"
        ? "https://viewer.trustlesswork.com/"
        : "https://viewer.trustlesswork.com/";
    }
    return url;
  };

  const isItemActive = (itemUrl: string) => {
    if (itemUrl === "#") return false;

    if (itemUrl.startsWith("http")) return false;

    if (itemUrl === "/dashboard") {
      return pathname === "/dashboard";
    }

    if (itemUrl === "/dashboard/contact") {
      return pathname.startsWith("/dashboard/contact");
    }

    if (itemUrl === "/dashboard/escrow/my-escrows") {
      return pathname.startsWith("/dashboard/escrow");
    }

    if (itemUrl === "/dashboard/report-issue") {
      return pathname.startsWith("/dashboard/report-issue");
    }

    if (itemUrl === "/dashboard/help") {
      return pathname.startsWith("/dashboard/help");
    }

    return pathname === itemUrl;
  };

  const isSubItemActive = (subItemUrl: string) => {
    if (subItemUrl.startsWith("http")) return false;
    return pathname === subItemUrl;
  };

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{t(group.label)}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.isExpandable ? (
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {item.icon && <item.icon />}
                        <span>{t(item.title)}</span>
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubItemActive(subItem.url)}
                            >
                              <Link
                                href={getDynamicUrl(subItem.url)}
                                target={
                                  subItem.isExternal ? "_blank" : undefined
                                }
                                rel={
                                  subItem.isExternal
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                              >
                                {t(subItem.title)}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton asChild isActive={isItemActive(item.url)}>
                    <Link
                      href={getDynamicUrl(item.url)}
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noopener noreferrer" : undefined}
                    >
                      {item.icon && <item.icon />}
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
};

export default NavMain;
