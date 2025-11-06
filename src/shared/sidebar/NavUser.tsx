"use client";

import {
  ChevronsUpDown,
  Copy,
  CreditCard,
  IdCard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/ui/sidebar";
import { copyToClipboard } from "@/lib/copy";
import { useGlobalUIBoundedStore } from "@/store/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGlobalAuthenticationStore } from "@/store/data";
import TooltipInfo from "@/shared/utils/Tooltip";
import { useWallet } from "@/modules/auth/hooks/useWallet";
import { formatAddress } from "@/lib/format";

export const NavUser = () => {
  const { isMobile } = useSidebar();
  const address = useGlobalAuthenticationStore((state) => state.address);
  const name = useGlobalAuthenticationStore((state) => state.name);
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const copiedKeyId = useGlobalUIBoundedStore((state) => state.copiedKeyId);
  const setCopiedKeyId = useGlobalUIBoundedStore(
    (state) => state.setCopiedKeyId,
  );
  const { handleDisconnect } = useWallet();
  const router = useRouter();
  const pathname = usePathname();

  // Reset copiedKeyId on mount to clear any stale values from localStorage
  useEffect(() => {
    setCopiedKeyId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!address) {
      router.push("/");
    } else if (pathname === "/") {
      router.push("/dashboard");
    }
  }, [address, pathname, router]);

  const user = {
    name:
      loggedUser?.firstName && loggedUser?.lastName
        ? `${loggedUser.firstName} ${loggedUser.lastName}`
        : loggedUser?.firstName || loggedUser?.lastName || "Without Name",
    adress: address,
    avatar: loggedUser?.profileImage,
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {loggedUser?.firstName
                    ? loggedUser.firstName?.charAt(0)
                    : "?"}{" "}
                  {loggedUser?.lastName ? loggedUser.lastName.charAt(0) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.adress}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {loggedUser?.firstName
                      ? loggedUser.firstName?.charAt(0)
                      : "?"}{" "}
                    {loggedUser?.lastName ? loggedUser.lastName.charAt(0) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="truncate text-xs">
                        {formatAddress(user.adress)}
                      </p>

                      <p className="text-xs text-green-700 h-2">
                        {copiedKeyId && "Address copied!"}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(user.adress, user.adress)}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    >
                      <TooltipInfo content="Copy address">
                        <Copy
                          className={cn(
                            "h-4 w-4",
                            copiedKeyId
                              ? "text-green-700"
                              : "text-muted-foreground",
                          )}
                        />
                      </TooltipInfo>
                    </button>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            {loggedUser?.identification && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IdCard />
                    <span className="truncate">
                      Identification - {loggedUser?.identification}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CreditCard />
                Wallet - {name}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={`/dashboard/public-profile/${address}`}>
                <DropdownMenuItem>
                  <User />
                  Public Profile
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/settings">
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <button className="w-full" onClick={handleDisconnect}>
              <DropdownMenuItem>
                <LogOut />
                Disconnect
              </DropdownMenuItem>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
